import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data, error } = await supabase
      .from("cms_testimonials")
      .update({
        quote,
        author_name: authorName,
        author_role: body.author_role || null,
        company: body.company || null,
        display_order:
          typeof body.display_order === "number" ? body.display_order : 0,
        published: !!body.published,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, testimonial: data });
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("cms_testimonials")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
