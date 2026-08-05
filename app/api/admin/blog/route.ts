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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const baseSlug = slugify(body.slug || title);
    let slug = baseSlug;

    // Ensure slug uniqueness by suffixing -2, -3, ... if needed
    for (let i = 2; i < 50; i++) {
      const { data: existing } = await supabase
        .from("cms_blog_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data, error } = await supabase
      .from("cms_blog_posts")
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data }, { status: 201 });
  } catch (error) {
    console.error("Blog post create error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
