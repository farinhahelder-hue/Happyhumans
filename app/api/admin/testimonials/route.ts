import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const quote = (body.quote || "").trim();
    const authorName = (body.author_name || "").trim();

    if (!quote || !authorName) {
      return NextResponse.json(
        { error: "Le témoignage et le nom sont obligatoires" },
        { status: 400 }
      );
    }

    // New testimonials go to the end of the list by default.
    let displayOrder = body.display_order;
    if (typeof displayOrder !== "number") {
      const { count } = await supabase
        .from("cms_testimonials")
        .select("*", { count: "exact", head: true });
      displayOrder = count ?? 0;
    }

    const { data, error } = await supabase
      .from("cms_testimonials")
      .insert({
        quote,
        author_name: authorName,
        author_role: body.author_role || null,
        company: body.company || null,
        display_order: displayOrder,
        published: !!body.published,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, testimonial: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Testimonial create error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
