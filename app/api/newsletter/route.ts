import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface SubscribeBody {
  email: string;
  website?: string; // honeypot — must stay empty for genuine humans
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeBody = await request.json();

    // Honeypot tripped: pretend success, store nothing.
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const email = (body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // ignoreDuplicates → INSERT ... ON CONFLICT DO NOTHING, so re-subscribing
    // the same address is a no-op rather than an error.
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, source: body.source || "site" },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer l'inscription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
