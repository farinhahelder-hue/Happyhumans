-- Newsletter subscribers captured from the public site.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Visitors may subscribe (inserts also happen server-side via the service key).
DROP POLICY IF EXISTS "Allow visitors to subscribe" ON newsletter_subscribers;
CREATE POLICY "Allow visitors to subscribe"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Single-admin site: Monica (any authenticated user) can read/update/delete.
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON newsletter_subscribers;
CREATE POLICY "Allow admin to read subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin to update subscribers" ON newsletter_subscribers;
CREATE POLICY "Allow admin to update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin to delete subscribers" ON newsletter_subscribers;
CREATE POLICY "Allow admin to delete subscribers"
  ON newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at
  ON newsletter_subscribers(created_at DESC);
