import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogEditor from "@/components/admin/BlogEditor";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return <BlogEditor initialPost={post} />;
}
