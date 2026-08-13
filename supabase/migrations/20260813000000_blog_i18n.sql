-- English translations for blog posts (bilingual FR/EN — see docs/PLAN_FR_EN.md).
-- The slug, image, tags, category, dates and read time are shared across
-- languages; only the text fields get an English variant. All nullable — an
-- untranslated post falls back to French on the /en/blog pages.
ALTER TABLE cms_blog_posts
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT;
