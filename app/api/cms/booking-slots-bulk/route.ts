import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

// POST /api/cms/booking-slots-bulk
// Crée des créneaux récurrents (ex: tous les mardis et jeudis de 9h à 18h sur 4 semaines)
export async function POST(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const sb = createClient(url, key);
  const body = await req.json();

  const {
    days_of_week,  // [1,2,3,4,5] (1=Lundi...7=Dimanche)
    start_hour,    // 9
    end_hour,      // 17
    slot_type,     // 'discovery' | 'coaching' | 'enterprise'
    duration,      // 45
    weeks,         // 4
    start_date,    // 'YYYY-MM-DD' (default: today)
  } = body;

  if (!days_of_week?.length || start_hour == null || end_hour == null || !slot_type || !weeks) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  const from = new Date(start_date || new Date().toISOString().split('T')[0]);
  from.setHours(0, 0, 0, 0);
  const until = new Date(from);
  until.setDate(until.getDate() + weeks * 7);

  const slots: { slot_date: string; slot_time: string; slot_type: string; duration_minutes: number; status: string }[] = [];
  const cur = new Date(from);

  while (cur < until) {
    const dow = cur.getDay() === 0 ? 7 : cur.getDay(); // 1=Lun...7=Dim
    if (days_of_week.includes(dow)) {
      for (let h = start_hour; h < end_hour; h++) {
        slots.push({
          slot_date:        cur.toISOString().split('T')[0],
          slot_time:        `${String(h).padStart(2,'0')}:00:00`,
          slot_type,
          duration_minutes: duration || 45,
          status:           'available',
        });
      }
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (!slots.length) return NextResponse.json({ created: 0 });

  const { data, error } = await sb.from('booking_slots').insert(slots).select('id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ created: data?.length || 0, message: `${data?.length} créneaux créés` });
}
