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

// PATCH — mettre à jour le statut d'une demande
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { status } = await req.json();
  const validStatuses = ['pending', 'confirmed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  // Si confirmé, marquer le créneau comme booked
  if (status === 'confirmed') {
    const { data: request } = await supabase
      .from('booking_requests')
      .select('slot_id')
      .eq('id', params.id)
      .single();

    if (request?.slot_id) {
      await supabase
        .from('booking_slots')
        .update({ status: 'booked' })
        .eq('id', request.slot_id);
    }
  }

  // Si annulé, re-libérer le créneau
  if (status === 'cancelled') {
    const { data: request } = await supabase
      .from('booking_requests')
      .select('slot_id')
      .eq('id', params.id)
      .single();

    if (request?.slot_id) {
      await supabase
        .from('booking_slots')
        .update({ status: 'available' })
        .eq('id', request.slot_id);
    }
  }

  const { error } = await supabase
    .from('booking_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
