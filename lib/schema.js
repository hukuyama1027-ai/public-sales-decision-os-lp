const BASE_DDL = [
`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  plan TEXT,
  path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
`CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  employee_scale TEXT,
  services TEXT NOT NULL,
  region TEXT NOT NULL,
  public_experience TEXT NOT NULL,
  unified_qualification TEXT NOT NULL,
  email TEXT NOT NULL,
  price_interest TEXT NOT NULL,
  usage_interest INTEGER NOT NULL DEFAULT 0,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
`CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
)`
];

const CR003_DDL = [
`CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY, source TEXT NOT NULL DEFAULT 'kkj', source_key TEXT,
  title TEXT NOT NULL, organization_name TEXT, prefecture_code TEXT, prefecture_name TEXT,
  city_name TEXT, location TEXT, announced_at TEXT, category TEXT, procedure_type TEXT,
  certification TEXT, description TEXT, source_url TEXT, attachments_json TEXT,
  tender_submission_raw TEXT, opening_event_raw TEXT, period_end_raw TEXT,
  deadline_at TEXT, deadline_source TEXT, raw_hash TEXT, fetched_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL, source_status TEXT NOT NULL DEFAULT 'active'
)`,
`CREATE INDEX IF NOT EXISTS idx_opp_announced ON opportunities(announced_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_opp_deadline ON opportunities(deadline_at)`,
`CREATE INDEX IF NOT EXISTS idx_opp_org ON opportunities(organization_name)`,
`CREATE INDEX IF NOT EXISTS idx_opp_pref ON opportunities(prefecture_code)`,
`CREATE INDEX IF NOT EXISTS idx_opp_category ON opportunities(category)`,
`CREATE INDEX IF NOT EXISTS idx_opp_procedure ON opportunities(procedure_type)`,
`CREATE TABLE IF NOT EXISTS company_profiles (
  client_key TEXT PRIMARY KEY, company_name TEXT NOT NULL, industry TEXT NOT NULL,
  services TEXT NOT NULL, regions_json TEXT NOT NULL, employee_scale TEXT,
  desired_project_size TEXT, public_experience TEXT NOT NULL,
  unified_qualification TEXT NOT NULL, strengths TEXT, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`,
`CREATE TABLE IF NOT EXISTS watch_items (
  client_key TEXT NOT NULL, opportunity_id TEXT NOT NULL, saved_at TEXT NOT NULL,
  deadline_snapshot TEXT, status_snapshot TEXT,
  PRIMARY KEY(client_key, opportunity_id)
)`,
`CREATE INDEX IF NOT EXISTS idx_watch_client_saved ON watch_items(client_key, saved_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_watch_opp ON watch_items(opportunity_id)`,
`CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT, client_key TEXT, session_id TEXT NOT NULL,
  keyword TEXT, filters_json TEXT, result_count INTEGER NOT NULL DEFAULT 0,
  searched_at TEXT NOT NULL
)`,
`CREATE INDEX IF NOT EXISTS idx_search_client_time ON search_history(client_key, searched_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_search_session_time ON search_history(session_id, searched_at DESC)`,
`CREATE TABLE IF NOT EXISTS recent_views (
  client_key TEXT NOT NULL, opportunity_id TEXT NOT NULL, viewed_at TEXT NOT NULL,
  PRIMARY KEY(client_key, opportunity_id)
)`,
`CREATE TABLE IF NOT EXISTS sync_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT NOT NULL, query_key TEXT NOT NULL,
  started_at TEXT NOT NULL, completed_at TEXT, status TEXT NOT NULL,
  fetched_count INTEGER NOT NULL DEFAULT 0, upserted_count INTEGER NOT NULL DEFAULT 0,
  error_code TEXT
)`,
`CREATE INDEX IF NOT EXISTS idx_events_client_created ON events(client_key, created_at)`,
`CREATE INDEX IF NOT EXISTS idx_events_type_created ON events(event_type, created_at)`
];

const EVENT_COLUMNS = Object.freeze({
  client_key: 'TEXT',
  entity_type: 'TEXT',
  entity_id: 'TEXT',
  metadata_json: 'TEXT'
});

async function run(db, sql) {
  return db.prepare(sql).run();
}

async function ensureBase(db) {
  for (const sql of BASE_DDL) await run(db, sql);
}

async function ensureEventColumns(db) {
  const info = await db.prepare('PRAGMA table_info(events)').all();
  const existing = new Set((info.results || []).map(x => x.name));
  for (const [name, type] of Object.entries(EVENT_COLUMNS)) {
    if (existing.has(name)) continue;
    try {
      await run(db, `ALTER TABLE events ADD COLUMN ${name} ${type}`);
    } catch (err) {
      const check = await db.prepare('PRAGMA table_info(events)').all();
      if (!(check.results || []).some(x => x.name === name)) throw err;
    }
  }
}

export async function ensureCr003Schema(db) {
  if (!db) throw new Error('DB_UNAVAILABLE');
  await ensureBase(db);
  const applied = await db.prepare("SELECT version FROM schema_migrations WHERE version='cr003' LIMIT 1").first();
  if (applied) return { applied: false, version: 'cr003' };
  await ensureEventColumns(db);
  for (const sql of CR003_DDL) await run(db, sql);
  await db.prepare('INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(?,?)')
    .bind('cr003', new Date().toISOString()).run();
  return { applied: true, version: 'cr003' };
}

export const __test = { BASE_DDL, CR003_DDL, EVENT_COLUMNS };
