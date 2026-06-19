-- Booking Slots System for Happy Humans CMS
-- Allows Monica to create/delete available time slots for coaching sessions

-- Table for storing available booking slots
CREATE TABLE IF NOT EXISTS booking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date date NOT NULL,
  slot_time time NOT NULL,
  slot_type text NOT NULL DEFAULT 'coaching' CHECK (slot_type IN ('coaching', 'discovery', 'enterprise')),
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 1,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(slot_date, slot_time, slot_type)
);

-- Table for storing bookings
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES booking_slots(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Public read access to available slots
CREATE POLICY "Allow public read access to available slots"
  ON booking_slots FOR SELECT
  TO public
  USING (status = 'available' AND slot_date >= CURRENT_DATE);

-- Admin full access to booking_slots
CREATE POLICY "Allow authenticated users full access to slots"
  ON booking_slots FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public to insert booking requests
CREATE POLICY "Allow public to insert booking requests"
  ON booking_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Admin full access to booking_requests
CREATE POLICY "Allow authenticated users full access to requests"
  ON booking_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_slots_date ON booking_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_status ON booking_slots(status);
CREATE INDEX IF NOT EXISTS idx_requests_slot ON booking_requests(slot_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON booking_requests(status);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_booking_slots_updated_at
  BEFORE UPDATE ON booking_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
