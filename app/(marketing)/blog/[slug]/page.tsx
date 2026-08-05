import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

interface Params {
  slug: string;
}

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) return {};

  const ogImage = post.og_image || post.featured_image;

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const supabase = await createClient();

  // RLS: anon can only fetch published posts; a logged-in admin session
  // can also preview drafts by visiting this same URL directly.
  const { data: post } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <article>
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-brand/10 text-brand-dark px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-gray-600 mb-8">
            <span>
              {new Date(post.created_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post.reading_time && <span>• {post.reading_time} min de lecture</span>}
          </div>

          {post.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {/* Content */}
        <div
          className="article-content text-gray-800 text-lg mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Metadata */}
        {post.note_angle && (
          <div className="bg-brand/5 border-l-4 border-brand p-6 rounded my-8">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Note d'angle :</span> {post.note_angle}
            </p>
          </div>
        )}

        {/* Call to action */}
        <div className="bg-gradient-to-r from-brand to-accent text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à passer à l'action ?</h2>
          <p className="mb-6 text-white/80">
            Réservez une séance découverte gratuite pour explorer vos défis
          </p>
          <a
            href="/contact#discovery"
            className="inline-block px-8 py-3 bg-white text-brand rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Réserver une séance
          </a>
        </div>
      </article>

      {/* Related articles */}
      <div className="mt-16 pt-8 border-t">
        <h3 className="text-2xl font-bold mb-6">Articles similaires</h3>
        <p className="text-gray-600">
          Retrouvez d'autres articles dans la catégorie{" "}
          <span className="font-semibold">{post.tags?.[0]}</span> sur le blog.
        </p>
      </div>
    </main>
  );
}
