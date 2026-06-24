import { NextRequest, NextResponse } from 'next/server';

// Envoie un email via Brevo (ex-Sendinblue) — gratuit 300 emails/jour
// 1. Créer un compte gratuit sur brevo.com
// 2. SMTP & API → Clés API → Créer une clé
// 3. Ajouter dans Vercel : BREVO_API_KEY = votre clé
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { error: 'BREVO_API_KEY manquante — ajouter dans Vercel env vars' };

  const senderEmail = process.env.SENDER_EMAIL || 'happyhumans.coaching@gmail.com';
  const senderName  = process.env.SENDER_NAME  || 'Happy Humans';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender:   { name: senderName, email: senderEmail },
      to:       [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json().catch(() => ({}));
  return res.ok ? { id: data.messageId } : { error: data.message || `HTTP ${res.status}` };
}

export async function POST(req: NextRequest) {
  const { type, to, data } = await req.json();

  if (!to || !type) {
    return NextResponse.json({ error: 'to et type requis' }, { status: 400 });
  }

  let subject = '';
  let html = '';

  if (type === 'booking_confirmation') {
    subject = 'Votre séance est bien reçue — Happy Humans';
    html = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <p style="font-size: 13px; color: #2d5f54; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Happy Humans</p>
        <h1 style="font-size: 26px; font-weight: 400; margin: 0 0 24px;">Votre demande a bien été reçue.</h1>
        <p style="font-size: 15px; line-height: 1.7; color: #444;">
          Merci ${data?.name || ''} — Monica a bien reçu votre demande de séance pour le <strong>${data?.date || ''}</strong> à <strong>${data?.time || ''}</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 16px;">
          Elle vous confirmera sous 48h à cette adresse email.
        </p>
        <div style="margin: 32px 0; padding: 20px 24px; background: #f5f0e8; border-left: 3px solid #2d5f54; border-radius: 4px;">
          <p style="font-size: 13px; color: #2d5f54; margin: 0 0 4px; font-weight: 600;">Séance demandée</p>
          <p style="font-size: 14px; color: #444; margin: 0;">${data?.slot_type === 'discovery' ? 'Séance découverte — Gratuite — 45 min' : 'Séance coaching — 45 min'}</p>
          ${data?.date ? `<p style="font-size: 14px; color: #666; margin: 4px 0 0;">${data.date} à ${data.time || ''}</p>` : ''}
        </div>
        <p style="font-size: 13px; color: #888; line-height: 1.6;">
          Une question ? Répondez simplement à cet email ou écrivez à
          <a href="mailto:happyhumans.coaching@gmail.com" style="color: #2d5f54;">happyhumans.coaching@gmail.com</a>
        </p>
        <p style="font-size: 13px; color: #c9a96e; margin-top: 32px; font-style: italic;">— Monica Schneider, Happy Humans</p>
      </div>
    `;
  }

  if (type === 'contact_confirmation') {
    subject = 'Message bien reçu — Happy Humans';
    html = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <p style="font-size: 13px; color: #2d5f54; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Happy Humans</p>
        <h1 style="font-size: 26px; font-weight: 400; margin: 0 0 24px;">Votre message est bien arrivé.</h1>
        <p style="font-size: 15px; line-height: 1.7; color: #444;">
          Merci ${data?.name || ''} de nous avoir écrit. Je réponds personnellement à chaque message sous 48h.
        </p>
        <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 16px;">
          En attendant, vous pouvez explorer les ressources sur les relations et l'attachement, ou réserver directement une séance découverte gratuite.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="https://happy-humans.org/booking" style="display: inline-block; background: #2d5f54; color: white; text-decoration: none; padding: 12px 28px; border-radius: 24px; font-size: 13px; font-weight: 600;">
            Réserver une séance →
          </a>
        </div>
        <p style="font-size: 13px; color: #c9a96e; margin-top: 32px; font-style: italic;">— Monica Schneider, Happy Humans</p>
      </div>
    `;
  }

  if (type === 'booking_admin') {
    subject = `Nouvelle réservation — ${data?.name || 'Inconnu'}`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
        <h2 style="color: #2d5f54;">Nouvelle demande de séance</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #666;">Nom</td><td style="padding: 8px 0;"><strong>${data?.name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data?.email}">${data?.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Téléphone</td><td style="padding: 8px 0;">${data?.phone || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0;">${data?.date} à ${data?.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Type</td><td style="padding: 8px 0;">${data?.slot_type}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Message</td><td style="padding: 8px 0;">${data?.message || '—'}</td></tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #888;">Gérer via /cms-admin → Réservations</p>
      </div>
    `;
  }

  if (!html) return NextResponse.json({ error: 'type inconnu' }, { status: 400 });

  const result = await sendEmail({ to, subject, html });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true, id: result.id });
}
