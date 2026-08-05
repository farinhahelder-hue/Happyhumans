import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    const { pageId, order } = await request.json();

    if (!pageId || !Array.isArray(order)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const key = `page-sections-order-${pageId}`;
    const value = JSON.stringify(order);

    const { error } = await supabase
      .from("cms_settings_kv")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw error;

    // History is logged automatically by the cms_settings_kv_history trigger.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page order save error:", error);
    return NextResponse.json(
      { error: "Failed to save page order" },
      { status: 500 }
    );
  }
}
