import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, bookingConfirmationHtml, contactConfirmationHtml, adminNotifHtml } from '@/lib/send-email';

// Endpoint HTTP pour tests manuels ou intégrations tierces
// Les routes internes (booking, contact) utilisent lib/send-email directement
export async function POST(req: NextRequest) {
  const { type, to, data } = await req.json();

  if (!to || !type) {
    return NextResponse.json({ error: 'to et type requis' }, { status: 400 });
  }

  let subject = '';
  let html = '';

  if (type === 'booking_confirmation') {
    subject = 'Votre séance est bien reçue — Happy Humans';
    html = bookingConfirmationHtml(data || {});
  } else if (type === 'contact_confirmation') {
    subject = 'Message bien reçu — Happy Humans';
    html = contactConfirmationHtml(data?.name || '');
  } else if (type === 'booking_admin' || type === 'admin') {
    subject = `Nouvelle demande — ${data?.name || 'Inconnu'}`;
    html = adminNotifHtml(data || {});
  } else {
    return NextResponse.json({ error: `Type inconnu: ${type}` }, { status: 400 });
  }

  const result = await sendEmail({ to, subject, html });
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true, id: result.id });
}
