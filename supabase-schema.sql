-- YourWonClaim leads table
-- Run this in Supabase SQL Editor (same project as fixsepticnow / mesothelioma)

CREATE TABLE IF NOT EXISTS ywc_leads (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  source_url  TEXT,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups by email and date
CREATE INDEX IF NOT EXISTS ywc_leads_email_idx       ON ywc_leads (email);
CREATE INDEX IF NOT EXISTS ywc_leads_created_at_idx  ON ywc_leads (created_at DESC);

-- Row Level Security: allow service role full access, block anon reads
ALTER TABLE ywc_leads ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS by default — no policy needed for the API.
-- Prevent public/anon reads (belt-and-suspenders)
CREATE POLICY "deny_anon_select" ON ywc_leads
  FOR SELECT USING (FALSE);
