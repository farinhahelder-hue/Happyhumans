// Envoi d'email via Brevo — utilisé directement côté serveur (pas d'appel HTTP à soi-même)
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[sendEmail] BREVO_API_KEY manquante — email non envoyé');
    return { skipped: true };
  }

  const senderEmail = process.env.SENDER_EMAIL || 'happyhumans.coaching@gmail.com';
  const senderName  = process.env.SENDER_NAME  || 'Happy Humans';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender:      { name: senderName, email: senderEmail },
      to:          [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('[sendEmail] Erreur Brevo:', data);
  return res.ok ? { id: data.messageId } : { error: data.message };
}

export function bookingConfirmationHtml(data: { name?: string; date?: string; time?: string; slot_type?: string }) {
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1a1a1a">
      <p style="font-size:13px;color:#2d5f54;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Happy Humans</p>
      <h1 style="font-size:26px;font-weight:400;margin:0 0 24px">Votre demande a bien été reçue.</h1>
      <p style="font-size:15px;line-height:1.7;color:#444">
        Merci ${data.name || ''} — Monica a bien reçu votre demande de séance${data.date ? ` pour le <strong>${data.date}</strong> à <strong>${data.time || ''}</strong>` : ''}.
      </p>
      <p style="font-size:15px;line-height:1.7;color:#444;margin-top:16px">Elle vous confirmera sous 48h à cette adresse.</p>
      <div style="margin:32px 0;padding:20px 24px;background:#f5f0e8;border-left:3px solid #2d5f54;border-radius:4px">
        <p style="font-size:13px;color:#2d5f54;margin:0 0 4px;font-weight:600">Séance demandée</p>
        <p style="font-size:14px;color:#444;margin:0">${data.slot_type === 'discovery' ? 'Séance découverte — Gratuite — 45 min' : 'Séance coaching — 45 min'}</p>
      </div>
      <p style="font-size:13px;color:#c9a96e;margin-top:32px;font-style:italic">— Monica Schneider, Happy Humans</p>
    </div>`;
}

export function contactConfirmationHtml(name: string) {
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1a1a1a">
      <p style="font-size:13px;color:#2d5f54;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Happy Humans</p>
      <h1 style="font-size:26px;font-weight:400;margin:0 0 24px">Votre message est bien arrivé.</h1>
      <p style="font-size:15px;line-height:1.7;color:#444">Merci ${name} — je réponds personnellement sous 48h.</p>
      <div style="margin:32px 0;text-align:center">
        <a href="https://happyhumans.vercel.app/booking" style="display:inline-block;background:#2d5f54;color:white;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:13px;font-weight:600">Réserver une séance →</a>
      </div>
      <p style="font-size:13px;color:#c9a96e;margin-top:32px;font-style:italic">— Monica Schneider, Happy Humans</p>
    </div>`;
}

export function adminNotifHtml(data: Record<string, string | undefined>) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px">
      <h2 style="color:#2d5f54">Nouvelle demande — ${data.name || ''}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${Object.entries({ Nom: data.name, Email: data.email, Téléphone: data.phone, Date: data.date ? `${data.date} à ${data.time}` : undefined, Type: data.slot_type, Message: data.message })
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="padding:6px 0;color:#666;width:100px">${k}</td><td style="padding:6px 0"><strong>${v}</strong></td></tr>`)
          .join('')}
      </table>
    </div>`;
}
