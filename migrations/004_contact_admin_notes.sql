-- Add an internal notes field to contact submissions, for admin-only follow-up notes
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;
