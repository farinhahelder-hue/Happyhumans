import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message, type = 'contact' } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email et message sont requis' }, { status: 400 })
    }

    // Tentative d'envoi via Resend si configuré
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'monica@happyhumans.ch'

    if (resendKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)

      // Notification à Monica
      await resend.emails.send({
        from: 'Happy Humans <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `✉️ Nouveau message — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#2f6b61">Nouveau message via happyhumans.ch</h2>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Nom</td><td style="padding:10px;border:1px solid #eee">${name}</td></tr>
              <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Email</td><td style="padding:10px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Type</td><td style="padding:10px;border:1px solid #eee">${type}</td></tr>
              <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Message</td><td style="padding:10px;border:1px solid #eee;white-space:pre-wrap">${message}</td></tr>
            </table>
          </div>
        `,
      })

      // Accusé de réception
      await resend.emails.send({
        from: 'Monica Schneider — Happy Humans <onboarding@resend.dev>',
        to: [email],
        subject: '✅ Message bien reçu — Happy Humans',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#2f6b61">Bonjour ${name},</h2>
            <p>Votre message a bien été reçu. Je vous répondrai sous <strong>48h</strong>.</p>
            <p style="color:#888;font-size:13px">Happy Humans · Monica Schneider · Executive Coach</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact error:', err)
    // Ne pas échouer même si Resend n'est pas configuré
    return NextResponse.json({ success: true })
  }
}
