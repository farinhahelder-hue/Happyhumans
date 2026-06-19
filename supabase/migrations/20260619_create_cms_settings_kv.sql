-- NOTE: This migration is kept for reference only.
-- The app now uses the existing 'cms_settings' table instead of cms_settings_kv.
-- See: add_group_name_to_cms_settings_and_seed_happy_humans migration

-- Create cms_settings_kv table for flexible key-value settings (logo, branding, etc.)
CREATE TABLE IF NOT EXISTS cms_settings_kv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cms_settings_kv ENABLE ROW LEVEL SECURITY;

-- Public read (needed for logo/settings in Header)
CREATE POLICY "Allow public read settings_kv"
  ON cms_settings_kv FOR SELECT TO public USING (true);

-- Authenticated write
CREATE POLICY "Allow authenticated write settings_kv"
  ON cms_settings_kv FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service role full access (for API routes using service_role key)
CREATE POLICY "Allow service role settings_kv"
  ON cms_settings_kv FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_settings_kv_key ON cms_settings_kv(key);

-- Insert defaults
INSERT INTO cms_settings_kv (key, value) VALUES
  ('logo_url', ''),
  ('logo_alt', 'Happy Humans'),
  ('site_name', 'Happy Humans'),
  ('tagline', 'philo-coaching'),
  ('favicon_url', ''),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('linkedin_url', ''),
  ('instagram_url', ''),
  ('instagram_handle', ''),
  ('facebook_url', ''),
  ('seo_title', 'Happy Humans - Coaching, leadership et transformation'),
  ('seo_description', 'Monica Schneider - Executive Coach certifiée'),
  ('og_image', ''),
  ('footer_text', ''),
  ('footer_links', '')
ON CONFLICT (key) DO NOTHING;
