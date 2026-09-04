CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  newsletter_opt_in INTEGER NOT NULL DEFAULT 0 CHECK (newsletter_opt_in IN (0, 1)),
  source TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  first_submitted_at TEXT NOT NULL,
  last_submitted_at TEXT NOT NULL,
  newsletter_opted_in_at TEXT,
  submission_count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_leads_last_submitted_at
  ON leads(last_submitted_at);

CREATE INDEX IF NOT EXISTS idx_leads_newsletter_opt_in
  ON leads(newsletter_opt_in);
