-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Visitors can insert
DROP POLICY IF EXISTS "Allow visitors to create submissions" ON contact_submissions;
CREATE POLICY "Allow visitors to create submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Single-admin site: any authenticated user (Monica) can read/update/delete.
DROP POLICY IF EXISTS "Allow admin to read all submissions" ON contact_submissions;
CREATE POLICY "Allow admin to read all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin to update submissions" ON contact_submissions;
CREATE POLICY "Allow admin to update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to delete submissions" ON contact_submissions;
CREATE POLICY "Allow admin to delete submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

DROP TRIGGER IF EXISTS contact_submissions_set_updated_at ON contact_submissions;
CREATE TRIGGER contact_submissions_set_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Log contacts in history table
-- NOTE: depends on site_content_history from 002_cms_settings_and_history.sql
CREATE OR REPLACE FUNCTION log_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO site_content_history (
    content_type,
    content_id,
    action,
    old_value,
    new_value,
    changed_by
  ) VALUES (
    'contact_submission',
    NEW.id::text,
    'create',
    NULL,
    json_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject
    )::text,
    'visitor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contact_submission_log ON contact_submissions;
CREATE TRIGGER contact_submission_log
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION log_contact_submission();
