-- Key/value settings store (visibility toggles, geo/business info, page section order)
CREATE TABLE IF NOT EXISTS cms_settings_kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cms_settings_kv ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read settings" ON cms_settings_kv;
CREATE POLICY "Public can read settings"
  ON cms_settings_kv FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Admin full access to settings" ON cms_settings_kv;
CREATE POLICY "Admin full access to settings"
  ON cms_settings_kv FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS cms_settings_kv_set_updated_at ON cms_settings_kv;
CREATE TRIGGER cms_settings_kv_set_updated_at
  BEFORE UPDATE ON cms_settings_kv
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Seed default visibility toggles + geo/business settings (no-op if already present)
INSERT INTO cms_settings_kv (key, value) VALUES
  ('show-in-menu', 'true'),
  ('show-in-footer', 'true'),
  ('coaching-published', 'true'),
  ('entreprises-published', 'true'),
  ('blog-published', 'true'),
  ('contact-published', 'true'),
  ('business-name', 'Happy Humans - Monica Schneider'),
  ('business-address-locality', 'Paris'),
  ('business-address-country', 'FR'),
  ('business-service-area', 'Paris et Île-de-France'),
  ('business-price-range', '€€')
ON CONFLICT (key) DO NOTHING;

-- Audit trail for restorable history across content types
CREATE TABLE IF NOT EXISTS site_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'restore')),
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_content_history_content
  ON site_content_history(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_site_content_history_created_at
  ON site_content_history(created_at DESC);

ALTER TABLE site_content_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to history" ON site_content_history;
CREATE POLICY "Admin full access to history"
  ON site_content_history FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow the contact form trigger (running as anon via the insert) to log itself
DROP POLICY IF EXISTS "Allow system insert into history" ON site_content_history;
CREATE POLICY "Allow system insert into history"
  ON site_content_history FOR INSERT
  TO anon
  WITH CHECK (content_type = 'contact_submission');

-- Generic trigger: logs blog post changes into site_content_history
CREATE OR REPLACE FUNCTION log_blog_post_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('blog_post', NEW.id::text, 'create', NULL, row_to_json(NEW)::text, 'admin');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('blog_post', NEW.id::text, 'update', row_to_json(OLD)::text, row_to_json(NEW)::text, 'admin');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('blog_post', OLD.id::text, 'delete', row_to_json(OLD)::text, NULL, 'admin');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_blog_posts_history ON cms_blog_posts;
CREATE TRIGGER cms_blog_posts_history
  AFTER INSERT OR UPDATE OR DELETE ON cms_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION log_blog_post_history();

-- Generic trigger: logs settings changes into site_content_history
CREATE OR REPLACE FUNCTION log_settings_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
    VALUES ('setting', NEW.key, 'create', NULL, NEW.value, 'admin');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.value IS DISTINCT FROM NEW.value THEN
      INSERT INTO site_content_history (content_type, content_id, action, old_value, new_value, changed_by)
      VALUES ('setting', NEW.key, 'update', OLD.value, NEW.value, 'admin');
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_settings_kv_history ON cms_settings_kv;
CREATE TRIGGER cms_settings_kv_history
  AFTER INSERT OR UPDATE ON cms_settings_kv
  FOR EACH ROW
  EXECUTE FUNCTION log_settings_history();
