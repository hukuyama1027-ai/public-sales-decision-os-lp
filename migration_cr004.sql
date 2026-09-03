-- AIMOS-CR-004 reference migration. Runtime uses idempotent lib/schema.js bootstrap.
-- Apply only when the columns do not already exist.
ALTER TABLE events ADD COLUMN release_version TEXT;
ALTER TABLE watch_items ADD COLUMN source_hash_snapshot TEXT;
CREATE INDEX IF NOT EXISTS idx_events_release_created ON events(release_version, created_at);
INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES('cr004',CURRENT_TIMESTAMP);
