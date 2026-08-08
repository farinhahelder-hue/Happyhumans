import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function BlogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("cms_blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // RLS only returns drafts to an authenticated (admin) session.
  const { data: drafts } = user
    ? await supabase
        .from("cms_blog_posts")
        .select("*")
        .eq("published", false)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Explorez mes articles sur le leadership, le coaching et le Happiness Design
        </p>
      </div>

      {/* Published Articles */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Articles publiés</h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 sm:w-48 sm:h-48 object-cover group-hover:opacity-75 transition"
                    />
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 mb-3">
                        {post.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-brand/10 text-brand-dark px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Aucun article publié pour le moment.
          </p>
        )}
      </section>

      {/* Drafts (visible only to the logged-in admin, enforced by RLS) */}
      {drafts && drafts.length > 0 && (
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded">
          <h2 className="text-2xl font-bold mb-4">Brouillons</h2>
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{draft.title}</p>
                  <p className="text-sm text-gray-600">{draft.excerpt}</p>
                </div>
                <Link
                  href={`/blog/${draft.slug}`}
                  className="text-yellow-700 hover:text-yellow-900 font-semibold text-sm"
                >
                  Aperçu
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <NewsletterSignup source="blog" />
      </div>
    </main>
  );
}
