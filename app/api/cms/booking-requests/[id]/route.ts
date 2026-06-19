import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { status } = await req.json();
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  const { data: request } = await supabase
    .from('booking_requests')
    .select('slot_id')
    .eq('id', params.id)
    .single();

  if (status === 'confirmed' && request?.slot_id) {
    await supabase.from('booking_slots').update({ status: 'booked' }).eq('id', request.slot_id);
  }
  if (status === 'cancelled' && request?.slot_id) {
    await supabase.from('booking_slots').update({ status: 'available' }).eq('id', request.slot_id);
  }

  const { error } = await supabase
    .from('booking_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
