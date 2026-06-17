import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data.db');

let db;

export async function initDB() {
  const SQL = await initSqlJs();
  if (existsSync(DB_PATH)) {
    const buf = readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT NOT NULL,
    school TEXT DEFAULT '',
    major TEXT DEFAULT '',
    exam_year INTEGER DEFAULT 2026,
    daily_goal REAL DEFAULT 6,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366F1',
    target_score INTEGER DEFAULT 100,
    daily_hours REAL DEFAULT 1.5,
    progress INTEGER DEFAULT 0,
    total_hours REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_id INTEGER,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT DEFAULT '09:00',
    duration TEXT DEFAULT '1h',
    done INTEGER DEFAULT 0,
    elapsed_seconds INTEGER DEFAULT 0,
    started_at TEXT,
    recurrence TEXT DEFAULT 'none',
    repeat_start TEXT,
    repeat_end TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS study_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_id INTEGER,
    duration_minutes INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_start TEXT,
    time_end TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
  )`);

  // Migrate: add new columns if missing (for existing databases)
  const planCols = queryAll("PRAGMA table_info(plans)").map(c => c.name);
  if (!planCols.includes('elapsed_seconds')) db.run("ALTER TABLE plans ADD COLUMN elapsed_seconds INTEGER DEFAULT 0");
  if (!planCols.includes('started_at')) db.run("ALTER TABLE plans ADD COLUMN started_at TEXT");
  if (!planCols.includes('recurrence')) db.run("ALTER TABLE plans ADD COLUMN recurrence TEXT DEFAULT 'none'");
  if (!planCols.includes('repeat_start')) db.run("ALTER TABLE plans ADD COLUMN repeat_start TEXT");
  if (!planCols.includes('repeat_end')) db.run("ALTER TABLE plans ADD COLUMN repeat_end TEXT");

  save();
  return db;
}

export function save() {
  if (db) {
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  }
}

export function getDb() {
  return db;
}

export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export function run(sql, params = []) {
  db.run(sql, params);
  const lastId = queryOne('SELECT last_insert_rowid() as id').id;
  save();
  return { lastInsertRowid: lastId, changes: db.getRowsModified() };
}
