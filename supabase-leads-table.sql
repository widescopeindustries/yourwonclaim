-- YourWonClaim.com - Leads Table for Supabase
-- Run this in your Supabase SQL Editor to create the leads table

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anonymous inserts (for the lead form)
CREATE POLICY "Allow anonymous lead submissions" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Create a policy to allow authenticated users to read (optional - for admin dashboard)
-- CREATE POLICY "Allow authenticated read access" ON leads
--     FOR SELECT
--     USING (auth.role() = 'authenticated');

-- Create index on timestamp for sorting
CREATE INDEX IF NOT EXISTS leads_timestamp_idx ON leads(timestamp DESC);

-- Create index on email for deduplication checks
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

COMMENT ON TABLE leads IS 'Lead form submissions from yourwonclaim.com';
COMMENT ON COLUMN leads.name IS 'Veteran name from form';
COMMENT ON COLUMN leads.email IS 'Veteran email from form';
COMMENT ON COLUMN leads.source IS 'Page URL where form was submitted';
COMMENT ON COLUMN leads.timestamp IS 'When the lead was submitted';
