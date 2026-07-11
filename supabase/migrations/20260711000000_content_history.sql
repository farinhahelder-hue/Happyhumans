-- ── Historique des modifications de contenu ──────────────────
-- Journalise chaque changement de site_content (admin, inline edit, API)
-- pour permettre la consultation et la restauration depuis le CMS.

CREATE TABLE IF NOT EXISTS site_content_history (
  id bigserial PRIMARY KEY,
  page text NOT NULL,
  block_key text NOT NULL,
  old_value text,
  new_value text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_history_page
  ON site_content_history(page, changed_at DESC);

ALTER TABLE site_content_history ENABLE ROW LEVEL SECURITY;

-- Seul le service_role (API routes) lit et écrit l'historique
DROP POLICY IF EXISTS "service role history" ON site_content_history;
CREATE POLICY "service role history" ON site_content_history
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger : journalise créations et modifications de site_content
CREATE OR REPLACE FUNCTION log_site_content_change() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.value IS DISTINCT FROM OLD.value THEN
      INSERT INTO site_content_history(page, block_key, old_value, new_value)
      VALUES (OLD.page, OLD.block_key, OLD.value, NEW.value);
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO site_content_history(page, block_key, old_value, new_value)
    VALUES (NEW.page, NEW.block_key, NULL, NEW.value);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_site_content_history ON site_content;
CREATE TRIGGER trg_site_content_history
  AFTER INSERT OR UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION log_site_content_change();

-- Nettoyage automatique : garde 90 jours d'historique max (appelé par le trigger 1 fois sur ~100)
CREATE OR REPLACE FUNCTION prune_content_history() RETURNS void AS $$
  DELETE FROM site_content_history WHERE changed_at < now() - interval '90 days';
$$ LANGUAGE sql SECURITY DEFINER;
