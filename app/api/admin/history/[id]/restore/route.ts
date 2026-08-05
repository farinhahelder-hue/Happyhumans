import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: entry, error: fetchError } = await supabase
      .from("site_content_history")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !entry) {
      return NextResponse.json(
        { error: "History entry not found" },
        { status: 404 }
      );
    }

    if (!entry.old_value) {
      return NextResponse.json(
        { error: "Nothing to restore for this entry" },
        { status: 400 }
      );
    }

    if (entry.content_type === "blog_post") {
      const oldRow = JSON.parse(entry.old_value);

      // Restoring a delete re-creates the row; restoring an update overwrites
      // the current fields back to their prior state. Either way, an upsert
      // on the primary key does the right thing.
      const { error } = await supabase.from("cms_blog_posts").upsert({
        id: entry.content_id,
        title: oldRow.title,
        slug: oldRow.slug,
        excerpt: oldRow.excerpt,
        content: oldRow.content,
        featured_image: oldRow.featured_image,
        tags: oldRow.tags,
        note_angle: oldRow.note_angle,
        reading_time: oldRow.reading_time,
        seo_title: oldRow.seo_title,
        seo_description: oldRow.seo_description,
        og_image: oldRow.og_image,
        published: oldRow.published,
      });

      if (error) throw error;
    } else if (entry.content_type === "setting") {
      const { error } = await supabase
        .from("cms_settings_kv")
        .upsert({ key: entry.content_id, value: entry.old_value });

      if (error) throw error;
    } else if (entry.content_type === "testimonial") {
      const oldRow = JSON.parse(entry.old_value);

      const { error } = await supabase.from("cms_testimonials").upsert({
        id: entry.content_id,
        quote: oldRow.quote,
        author_name: oldRow.author_name,
        author_role: oldRow.author_role,
        company: oldRow.company,
        display_order: oldRow.display_order,
        published: oldRow.published,
      });

      if (error) throw error;
    } else {
      return NextResponse.json(
        { error: `Restore not supported for type "${entry.content_type}"` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json(
      { error: "Failed to restore" },
      { status: 500 }
    );
  }
}
