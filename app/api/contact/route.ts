import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string; // honeypot — must stay empty for genuine humans
}

// Fire an email notification via the Resend HTTP API when configured. No SDK
// needed — a plain fetch keeps this dependency-free. Silently skipped unless
// RESEND_API_KEY, CONTACT_NOTIFICATION_TO and CONTACT_NOTIFICATION_FROM are set.
async function sendEmailNotification(body: ContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_TO;
  const from = process.env.CONTACT_NOTIFICATION_FROM;
  if (!apiKey || !to || !from) return;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: body.email,
      subject: `Nouveau message : ${body.subject}`,
      html: `<h2>Nouveau message depuis le site</h2>
        <p><strong>Nom :</strong> ${esc(body.name)}</p>
        <p><strong>Email :</strong> ${esc(body.email)}</p>
        ${body.phone ? `<p><strong>Téléphone :</strong> ${esc(body.phone)}</p>` : ""}
        <p><strong>Sujet :</strong> ${esc(body.subject)}</p>
        <p><strong>Message :</strong></p>
        <p>${esc(body.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactSubmission = await request.json();

    // Honeypot tripped: pretend success so bots get no signal, but store nothing.
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Validation
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to contact_submissions table
    const { error } = await supabase.from("contact_submissions").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject,
      message: body.message,
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      status: "new",
    });

    if (error) throw error;

    // Note: the `contact_submission_log` DB trigger (migrations/003) already
    // records this submission into site_content_history — no manual insert
    // needed here.

    // Notify by email (best-effort — never fail the submission over it).
    try {
      await sendEmailNotification(body);
    } catch (mailError) {
      console.error("Contact email notification failed:", mailError);
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
