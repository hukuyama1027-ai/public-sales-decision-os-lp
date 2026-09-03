-- AIMOS-CR-003 production migration. Apply once to the existing D1 database.
ALTER TABLE events ADD COLUMN client_key TEXT;
ALTER TABLE events ADD COLUMN entity_type TEXT;
ALTER TABLE events ADD COLUMN entity_id TEXT;
ALTER TABLE events ADD COLUMN metadata_json TEXT;
CREATE INDEX IF NOT EXISTS idx_events_client_created ON events(client_key, created_at);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON events(event_type, created_at);

CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY, source TEXT NOT NULL DEFAULT 'kkj', source_key TEXT,
  title TEXT NOT NULL, organization_name TEXT, prefecture_code TEXT, prefecture_name TEXT,
  city_name TEXT, location TEXT, announced_at TEXT, category TEXT, procedure_type TEXT,
  certification TEXT, description TEXT, source_url TEXT, attachments_json TEXT,
  tender_submission_raw TEXT, opening_event_raw TEXT, period_end_raw TEXT,
  deadline_at TEXT, deadline_source TEXT, raw_hash TEXT, fetched_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL, source_status TEXT NOT NULL DEFAULT 'active'
);
CREATE INDEX IF NOT EXISTS idx_opp_announced ON opportunities(announced_at DESC);
CREATE INDEX IF NOT EXISTS idx_opp_deadline ON opportunities(deadline_at);
CREATE INDEX IF NOT EXISTS idx_opp_org ON opportunities(organization_name);
CREATE INDEX IF NOT EXISTS idx_opp_pref ON opportunities(prefecture_code);
CREATE INDEX IF NOT EXISTS idx_opp_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opp_procedure ON opportunities(procedure_type);

CREATE TABLE IF NOT EXISTS company_profiles (
  client_key TEXT PRIMARY KEY, company_name TEXT NOT NULL, industry TEXT NOT NULL,
  services TEXT NOT NULL, regions_json TEXT NOT NULL, employee_scale TEXT,
  desired_project_size TEXT, public_experience TEXT NOT NULL,
  unified_qualification TEXT NOT NULL, strengths TEXT, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS watch_items (
  client_key TEXT NOT NULL, opportunity_id TEXT NOT NULL, saved_at TEXT NOT NULL,
  deadline_snapshot TEXT, status_snapshot TEXT,
  PRIMARY KEY(client_key, opportunity_id)
);
CREATE INDEX IF NOT EXISTS idx_watch_client_saved ON watch_items(client_key, saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_watch_opp ON watch_items(opportunity_id);
CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT, client_key TEXT, session_id TEXT NOT NULL,
  keyword TEXT, filters_json TEXT, result_count INTEGER NOT NULL DEFAULT 0, searched_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_search_client_time ON search_history(client_key, searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_session_time ON search_history(session_id, searched_at DESC);
CREATE TABLE IF NOT EXISTS recent_views (
  client_key TEXT NOT NULL, opportunity_id TEXT NOT NULL, viewed_at TEXT NOT NULL,
  PRIMARY KEY(client_key, opportunity_id)
);
CREATE TABLE IF NOT EXISTS sync_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT NOT NULL, query_key TEXT NOT NULL,
  started_at TEXT NOT NULL, completed_at TEXT, status TEXT NOT NULL,
  fetched_count INTEGER NOT NULL DEFAULT 0, upserted_count INTEGER NOT NULL DEFAULT 0, error_code TEXT
);
