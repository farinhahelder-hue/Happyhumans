-- booking_slots: créneaux disponibles pour la prise de RDV
CREATE TABLE IF NOT EXISTS booking_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_date date NOT NULL,
  slot_time time NOT NULL,
  slot_type text NOT NULL DEFAULT 'discovery',
  duration_minutes int NOT NULL DEFAULT 45,
  status text NOT NULL DEFAULT 'available',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;

-- Lecture publique (widget de réservation)
CREATE POLICY "Public read available slots" ON booking_slots
  FOR SELECT USING (status = 'available');

-- Écriture via service role (CMS admin + seed)
CREATE POLICY "Service role full access" ON booking_slots
  FOR ALL USING (true) WITH CHECK (true);

-- booking_requests: demandes soumises par les visiteurs
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id uuid REFERENCES booking_slots(id),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON booking_requests
  FOR ALL USING (true) WITH CHECK (true);

-- ── Seed : créneaux de démonstration (30 prochains jours, lundi–vendredi, 9h–17h) ──
DO $$
DECLARE
  d date := CURRENT_DATE;
  h int;
BEGIN
  FOR i IN 0..29 LOOP
    d := CURRENT_DATE + i;
    -- Lundi (1) à Vendredi (5)
    IF EXTRACT(DOW FROM d) BETWEEN 1 AND 5 THEN
      FOR h IN 9..17 LOOP
        INSERT INTO booking_slots (slot_date, slot_time, slot_type, duration_minutes, status)
        VALUES (
          d,
          (h || ':00')::time,
          CASE WHEN h = 9 THEN 'discovery' ELSE 'coaching' END,
          45,
          'available'
        )
        ON CONFLICT DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END $$;
