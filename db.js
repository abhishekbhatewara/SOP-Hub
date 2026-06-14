const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'rbdpl.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS sop_edits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id      TEXT NOT NULL,
    field       TEXT NOT NULL,
    suggestion  TEXT NOT NULL,
    old_value   TEXT NOT NULL,
    new_value   TEXT NOT NULL,
    accepted    INTEGER DEFAULT 0,
    ts          TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Safe migration — add role column if it doesn't exist yet
try { db.exec(`ALTER TABLE sop_edits ADD COLUMN role TEXT DEFAULT 'user'`); } catch(_) {}

module.exports = db;
