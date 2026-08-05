-- Client testimonials, editable from /admin/testimonials
CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  company TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cms_testimonials_published ON cms_testimonials(published);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_display_order ON cms_testimonials(display_order);

ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published testimonials" ON cms_testimonials;
CREATE POLICY "Public can read published testimonials"
  ON cms_testimonials FOR SELECT
  TO anon
  USING (published = true);

-- Single-admin site: any authenticated user (Monica) has full access.
DROP POLICY IF EXISTS "Admin full access to testimonials" ON cms_testimonials;
CREATE POLICY "Admin full access to testimonials"
  ON cms_testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Keep updated_at current on every write (reuses set_updated_at() from migrations/001)
DROP TRIGGER IF EXISTS cms_testimonials_set_updated_at ON cms_testimonials;
CREATE TRIGGER cms_testimonials_set_updated_at
  BEFORE UPDATE ON cms_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Log changes into site_content_history (reuses the pattern from migrations/002)
CREATE OR REPLACE FUNCTION log_testimonial_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('testimonial', NEW.id::text, 'create', NULL, row_to_json(NEW)::text, 'admin');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('testimonial', NEW.id::text, 'update', row_to_json(OLD)::text, row_to_json(NEW)::text, 'admin');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('testimonial', OLD.id::text, 'delete', row_to_json(OLD)::text, NULL, 'admin');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_testimonials_history ON cms_testimonials;
CREATE TRIGGER cms_testimonials_history
  AFTER INSERT OR UPDATE OR DELETE ON cms_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION log_testimonial_history();
