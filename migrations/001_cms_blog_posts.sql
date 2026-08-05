-- Blog posts table for the CMS
CREATE TABLE IF NOT EXISTS cms_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  note_angle TEXT,
  reading_time INT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cms_blog_posts_slug ON cms_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_cms_blog_posts_published ON cms_blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_cms_blog_posts_created_at ON cms_blog_posts(created_at DESC);

ALTER TABLE cms_blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON cms_blog_posts;
CREATE POLICY "Public can read published posts"
  ON cms_blog_posts FOR SELECT
  TO anon
  USING (published = true);

-- Single-admin site: any authenticated user (Monica) has full access.
DROP POLICY IF EXISTS "Admin full access to posts" ON cms_blog_posts;
CREATE POLICY "Admin full access to posts"
  ON cms_blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Keep updated_at current on every write
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_blog_posts_set_updated_at ON cms_blog_posts;
CREATE TRIGGER cms_blog_posts_set_updated_at
  BEFORE UPDATE ON cms_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
