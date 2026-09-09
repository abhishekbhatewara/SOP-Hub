require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8422;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: 'application/json' }
});

// ── Admin auth ────────────────────────────────────────────────────────────────
function getAdminToken() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return null;
  return crypto.createHash('sha256').update(pwd + 'rbdpl-sop-hub').digest('hex');
}

function adminOnly(req, res, next) {
  const token = req.headers['x-admin-token'];
  const valid = getAdminToken();
  if (!valid || token !== valid) return res.status(403).json({ error: 'Admin access required' });
  next();
}

// ── POST admin login ──────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const valid = getAdminToken();
  if (!valid) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured' });
  const input = crypto.createHash('sha256').update(password + 'rbdpl-sop-hub').digest('hex');
  if (input !== valid) return res.status(401).json({ error: 'Invalid password' });
  res.json({ token: valid });
});

// ── GET accepted edits for a SOP (applied as overrides on page load) ─────────
app.get('/api/sops/:id/edits', (req, res) => {
  const rows = db.prepare(`
    SELECT field, new_value FROM sop_edits
    WHERE sop_id = ? AND accepted = 1
    ORDER BY id DESC
  `).all(req.params.id);
  const byField = {};
  rows.forEach(r => { if (!byField[r.field]) byField[r.field] = r; });
  res.json(Object.values(byField));
});

// ── GET every accepted edit across all SOPs (for gap/agent overrides) ────────
app.get('/api/edits/all', (req, res) => {
  const rows = db.prepare(`
    SELECT sop_id, field, new_value FROM sop_edits
    WHERE accepted = 1 ORDER BY id DESC
  `).all();
  const out = {};
  rows.forEach(r => {
    if (!out[r.sop_id]) out[r.sop_id] = {};
    if (out[r.sop_id][r.field] === undefined) {
      try { out[r.sop_id][r.field] = JSON.parse(r.new_value); } catch (_) {}
    }
  });
  res.json(out);
});

// ── GET full edit history for a SOP ──────────────────────────────────────────
app.get('/api/sops/:id/history', (req, res) => {
  const rows = db.prepare(`
    SELECT id, field, suggestion, old_value, new_value, accepted, role, ts
    FROM sop_edits WHERE sop_id = ?
    ORDER BY id DESC
  `).all(req.params.id);
  res.json(rows);
});

// ── POST generate AI suggestion ───────────────────────────────────────────────
app.post('/api/sops/:id/suggest', async (req, res) => {
  const { suggestion, sopData } = req.body;
  if (!suggestion || !sopData) return res.status(400).json({ error: 'Missing suggestion or sopData' });

  const prompt = `You are helping update Standard Operating Procedures (SOPs) for Rohan Builders, a real estate developer in India.

Current SOP: ${sopData.id} — ${sopData.title}
Department: ${sopData.dept}
Owner: ${sopData.owner}

Current editable content:
${JSON.stringify({
  objective: sopData.objective,
  processDescription: sopData.processDescription,
  kpis: sopData.kpis,
  opportunities: sopData.opportunities,
  gaps: sopData.gaps,
  agents: sopData.agents
}, null, 2)}

Team brainstorm suggestion: "${suggestion}"

Analyse the suggestion and return ONLY the fields that need to change. Use this exact JSON structure:
{
  "explanation": "Clear, concise explanation of what was changed and why it improves the SOP",
  "changes": {
    "objective": "updated string — include ONLY if the objective needs to change",
    "processDescription": ["full updated array — include ONLY if any step description changes"],
    "kpis": ["full updated array — include ONLY if KPIs change"],
    "opportunities": ["full updated array of strings — include ONLY if they change"],
    "gaps": [{"cat": "Process Logic | Control / Compliance | Data / Integration | Coordination", "title": "short gap name", "desc": "one or two sentences explaining the gap"}],
    "agents": [{"id": 0, "name": "agent name", "objective": "what the agent automates"}]
  }
}

Rules:
- Only include a field in "changes" if it actually needs updating
- If processDescription changes, return the FULL array
- Maintain the same professional tone as the original
- opportunities is an array of plain strings
- For "gaps", return the FULL updated list for this SOP. "cat" MUST be one of exactly:
  "Process Logic", "Control / Compliance", "Data / Integration", "Coordination"
- For "agents", return the FULL updated list attached to this SOP. Keep the existing
  numeric "id" for agents that already exist; use id 0 only for a brand-new agent idea.
  Only "name" and "objective" are editable here.
- Do not invent changes not implied by the suggestion`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    res.json({ explanation: parsed.explanation, changes: parsed.changes || {} });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI suggestion failed', detail: err.message });
  }
});

// ── POST user submits suggestion for admin review (no auth required) ──────────
app.post('/api/sops/:id/submit', (req, res) => {
  const { field, oldValue, newValue, suggestion } = req.body;
  if (!field || newValue === undefined) return res.status(400).json({ error: 'Missing field or newValue' });
  db.prepare(`
    INSERT INTO sop_edits (sop_id, field, suggestion, old_value, new_value, accepted, role)
    VALUES (?, ?, ?, ?, ?, 0, 'user')
  `).run(req.params.id, field, suggestion || '', JSON.stringify(oldValue), JSON.stringify(newValue));
  res.json({ ok: true });
});

// ── POST admin accepts a field change directly ────────────────────────────────
app.post('/api/sops/:id/accept', adminOnly, (req, res) => {
  const { field, oldValue, newValue, suggestion } = req.body;
  if (!field || newValue === undefined) return res.status(400).json({ error: 'Missing field or newValue' });
  db.prepare(`UPDATE sop_edits SET accepted = 2 WHERE sop_id = ? AND field = ? AND accepted = 1`)
    .run(req.params.id, field);
  db.prepare(`
    INSERT INTO sop_edits (sop_id, field, suggestion, old_value, new_value, accepted, role)
    VALUES (?, ?, ?, ?, ?, 1, 'admin')
  `).run(req.params.id, field, suggestion || '', JSON.stringify(oldValue), JSON.stringify(newValue));
  res.json({ ok: true });
});

// ── POST admin reverts a field to base data ───────────────────────────────────
app.post('/api/sops/:id/revert', adminOnly, (req, res) => {
  const { field } = req.body;
  db.prepare(`UPDATE sop_edits SET accepted = 2 WHERE sop_id = ? AND field = ? AND accepted = 1`)
    .run(req.params.id, field);
  res.json({ ok: true });
});

// ── GET all pending user submissions (admin only) ─────────────────────────────
app.get('/api/admin/pending', adminOnly, (req, res) => {
  const rows = db.prepare(`
    SELECT e.*, s.title as sop_title
    FROM sop_edits e
    WHERE e.accepted = 0 AND e.role = 'user'
    ORDER BY e.id DESC
  `).all();
  res.json(rows);
});

// ── POST admin approves a pending submission ──────────────────────────────────
app.post('/api/admin/approve/:editId', adminOnly, (req, res) => {
  const edit = db.prepare(`SELECT * FROM sop_edits WHERE id = ?`).get(req.params.editId);
  if (!edit) return res.status(404).json({ error: 'Not found' });
  db.prepare(`UPDATE sop_edits SET accepted = 2 WHERE sop_id = ? AND field = ? AND accepted = 1`)
    .run(edit.sop_id, edit.field);
  db.prepare(`UPDATE sop_edits SET accepted = 1, role = 'admin' WHERE id = ?`).run(req.params.editId);
  res.json({ ok: true });
});

// ── POST admin rejects a pending submission ───────────────────────────────────
app.post('/api/admin/reject/:editId', adminOnly, (req, res) => {
  db.prepare(`UPDATE sop_edits SET accepted = 3 WHERE id = ?`).run(req.params.editId);
  res.json({ ok: true });
});

// ── GET pending count (admin only, for badge) ─────────────────────────────────
app.get('/api/admin/pending-count', adminOnly, (req, res) => {
  const row = db.prepare(`SELECT COUNT(*) as n FROM sop_edits WHERE accepted = 0 AND role = 'user'`).get();
  res.json({ count: row.n });
});

app.listen(PORT, () => {
  console.log(`RBDPL SOP Hub → http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here')
    console.warn('⚠  GEMINI_API_KEY not set');
  if (!process.env.ADMIN_PASSWORD)
    console.warn('⚠  ADMIN_PASSWORD not set — admin features disabled');
});
