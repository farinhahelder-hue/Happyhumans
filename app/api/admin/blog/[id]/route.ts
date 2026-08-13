import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const baseSlug = slugify(body.slug || title);
    if (!baseSlug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    let slug = baseSlug;

    // Ensure slug uniqueness (excluding this post) by suffixing -2, -3, ...
    for (let i = 2; i < 50; i++) {
      const { data: existing } = await supabase
        .from("cms_blog_posts")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data, error } = await supabase
      .from("cms_blog_posts")
      .update({
        title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || "",
        featured_image: body.featured_image || null,
        tags: body.tags || [],
        note_angle: body.note_angle || null,
        reading_time: body.reading_time || null,
        seo_title: body.seo_title || null,
        seo_description: body.seo_description || null,
        og_image: body.og_image || null,
        published: !!body.published,
        title_en: body.title_en || null,
        excerpt_en: body.excerpt_en || null,
        content_en: body.content_en || null,
        seo_title_en: body.seo_title_en || null,
        seo_description_en: body.seo_description_en || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    console.error("Blog post update error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
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

    const { error } = await supabase.from("cms_blog_posts").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog post delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
