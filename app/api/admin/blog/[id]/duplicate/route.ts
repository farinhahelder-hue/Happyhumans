import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: original, error: fetchError } = await supabase
      .from("cms_blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const baseSlug = `${original.slug}-copie`;
    let slug = baseSlug;
    for (let i = 2; i < 50; i++) {
      const { data: existing } = await supabase
        .from("cms_blog_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data: copy, error: insertError } = await supabase
      .from("cms_blog_posts")
      .insert({
        title: `${original.title} (copie)`,
        slug,
        excerpt: original.excerpt,
        content: original.content,
        featured_image: original.featured_image,
        tags: original.tags,
        note_angle: original.note_angle,
        reading_time: original.reading_time,
        seo_title: original.seo_title,
        seo_description: original.seo_description,
        og_image: original.og_image,
        published: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, post: copy }, { status: 201 });
  } catch (error) {
    console.error("Blog post duplicate error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate post" },
      { status: 500 }
    );
  }
}
