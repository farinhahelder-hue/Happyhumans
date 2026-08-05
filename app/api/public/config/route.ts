import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/publicConfig";

// Visibility toggles change via /admin/settings at any time — never cache.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { visibilityToggles, contactEmail } = await getPublicConfig();

    return NextResponse.json({
      visibilityToggles,
      contactEmail,
      success: true,
    });
  } catch (error) {
    console.error("Config fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch config", success: false },
      { status: 500 }
    );
  }
}
