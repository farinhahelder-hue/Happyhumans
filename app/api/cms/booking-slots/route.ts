import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { data, error } = await supabase
    .from('booking_slots')
    .select('*, booking_requests(id, client_name, client_email, status)')
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data || [] });
}

export async function POST(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();
  const { date, time, type = 'coaching', notes = '', duration_minutes = 60 } = body;
  if (!date || !time) return NextResponse.json({ error: 'date et time requis' }, { status: 400 });

  const { data, error } = await supabase
    .from('booking_slots')
    .insert({ slot_date: date, slot_time: time, slot_type: type, notes, duration_minutes })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slot: data }, { status: 201 });
}
