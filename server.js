require('dotenv').config();
const express = require('express');
const path = require('path');
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

// ── GET accepted edits for a SOP (latest per field, applied as overrides) ──
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

// ── GET full edit history for a SOP ──
app.get('/api/sops/:id/history', (req, res) => {
  const rows = db.prepare(`
    SELECT id, field, suggestion, old_value, new_value, accepted, ts
    FROM sop_edits WHERE sop_id = ?
    ORDER BY id DESC
  `).all(req.params.id);
  res.json(rows);
});

// ── POST generate AI suggestion via Gemini 2.5 Flash ──
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
  opportunities: sopData.opportunities
}, null, 2)}

Team brainstorm suggestion: "${suggestion}"

Analyse the suggestion and return ONLY the fields that need to change. Use this exact JSON structure:
{
  "explanation": "Clear, concise explanation of what was changed and why it improves the SOP",
  "changes": {
    "objective": "updated string — include ONLY if the objective needs to change",
    "processDescription": ["full updated array — include ONLY if any step description changes"],
    "kpis": ["full updated array — include ONLY if KPIs change"],
    "opportunities": [{"title": "...", "desc": "..."}] — include ONLY if opportunities change
  }
}

Rules:
- Only include a field in "changes" if it actually needs updating based on the suggestion
- If processDescription changes, return the FULL array (not just the changed steps)
- Maintain the same professional, clear tone as the original
- Keep the same level of specificity and detail
- For opportunities, preserve the {title, desc} structure exactly
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

// ── POST accept a specific field change ──
app.post('/api/sops/:id/accept', (req, res) => {
  const { field, oldValue, newValue, suggestion } = req.body;
  if (!field || newValue === undefined) return res.status(400).json({ error: 'Missing field or newValue' });

  // Supersede any previous accepted edits for this field
  db.prepare(`UPDATE sop_edits SET accepted = 2 WHERE sop_id = ? AND field = ? AND accepted = 1`)
    .run(req.params.id, field);

  db.prepare(`
    INSERT INTO sop_edits (sop_id, field, suggestion, old_value, new_value, accepted)
    VALUES (?, ?, ?, ?, ?, 1)
  `).run(req.params.id, field, suggestion || '', JSON.stringify(oldValue), JSON.stringify(newValue));

  res.json({ ok: true });
});

// ── POST revert a field to its original (base JS) value ──
app.post('/api/sops/:id/revert', (req, res) => {
  const { field } = req.body;
  db.prepare(`UPDATE sop_edits SET accepted = 2 WHERE sop_id = ? AND field = ? AND accepted = 1`)
    .run(req.params.id, field);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`RBDPL SOP Hub → http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠  GEMINI_API_KEY not set in .env — AI suggestions will not work');
  }
});
