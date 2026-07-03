-- ── CMS UX Upgrade — 2026-07-03 ──────────────────────────────
-- 1. SEO fields on articles
-- 2. Page visibility + robots in cms_settings_kv
-- 3. Geo / business settings in cms_settings_kv

-- ── 1. SEO columns on cms_blog_posts ────────────────────────
ALTER TABLE cms_blog_posts
  ADD COLUMN IF NOT EXISTS seo_title       text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS og_image        text;

-- ── 2. Page visibility settings ─────────────────────────────
-- Pages: home, a-propos, coaching, entreprises, happiness-design,
--        sparring-partner, relations, temoignages, booking, contact, blog, faq
DO $$
DECLARE
  pages text[] := ARRAY[
    'home','a-propos','coaching','entreprises','happiness-design',
    'sparring-partner','relations','temoignages','booking','contact','blog','faq'
  ];
  p text;
BEGIN
  FOREACH p IN ARRAY pages LOOP
    INSERT INTO cms_settings_kv (key, value) VALUES
      ('page_' || p || '_visible',       'true'),
      ('page_' || p || '_indexable',     'true'),
      ('page_' || p || '_show_in_nav',   'true'),
      ('page_' || p || '_show_in_footer','true')
    ON CONFLICT (key) DO NOTHING;
  END LOOP;
END;
$$;

-- ── 3. Geo / business settings ───────────────────────────────
INSERT INTO cms_settings_kv (key, value) VALUES
  ('geo_business_name',    'Happy Humans — Monica Schneider'),
  ('geo_address',          'Paris, France'),
  ('geo_lat',              '48.8566'),
  ('geo_lng',              '2.3522'),
  ('geo_default_locale',   'fr-FR'),
  ('geo_default_region',   'FR'),
  ('geo_schema_type',      'Person'),
  ('geo_price_range',      '€€'),
  ('geo_service_area',     'Paris, France, Europe, International (en ligne)')
ON CONFLICT (key) DO NOTHING;
