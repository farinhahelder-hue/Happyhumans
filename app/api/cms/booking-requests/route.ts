import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function requireAuth(req: NextRequest) {
  const token = req.headers.get('x-cms-token');
  if (token !== process.env.CMS_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
}

// GET — toutes les demandes de réservation avec info créneau
export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { data, error } = await supabase
    .from('booking_requests')
    .select(\`
      *,
      booking_slots (
        slot_date,
        slot_time,
        slot_type,
        duration_minutes
      )
    \`)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data || [] });
}
