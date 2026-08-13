import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { hreflangAlternates } from "@/lib/i18n";
import BlogArticleContent from "@/components/marketing/BlogArticleContent";
import type { BlogPost } from "@/lib/types";

interface Params {
  slug: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as BlogPost) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  const title =
    post.seo_title_en || post.title_en || post.seo_title || post.title;
  const description =
    post.seo_description_en ||
    post.excerpt_en ||
    post.seo_description ||
    post.excerpt ||
    undefined;
  const ogImage = post.og_image || post.featured_image;

  return {
    title,
    description,
    alternates: hreflangAlternates(`/blog/${post.slug}`, "en"),
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return <BlogArticleContent post={post} locale="en" />;
}
