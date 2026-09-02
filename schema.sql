CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  plan TEXT,
  path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);

CREATE TABLE IF NOT EXISTS leads (
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
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_price ON leads(price_interest);
CREATE INDEX IF NOT EXISTS idx_leads_usage ON leads(usage_interest);
