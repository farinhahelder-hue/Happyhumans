-- English translations for blog posts. The slug (URL), featured image, tags,
-- reading time and og image are shared across languages; only the text fields
-- get an English variant. All nullable — an untranslated post falls back to
-- French on the /en/blog pages.
ALTER TABLE cms_blog_posts
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT;
