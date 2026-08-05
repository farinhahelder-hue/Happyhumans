"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/types";

const supabase = createClient();

type StatusFilter = "all" | "published" | "draft";

export default function BlogListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort((a, b) => a.localeCompare(b));

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "published" && !post.published) return false;
    if (statusFilter === "draft" && post.published) return false;
    if (tagFilter && !(post.tags || []).includes(tagFilter)) return false;
    if (search) {
      const needle = search.toLowerCase();
      const haystack = `${post.title} ${post.excerpt || ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cms_blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const togglePublished = async (post: BlogPost) => {
    setBusyId(post.id);
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    await loadPosts();
    setBusyId(null);
  };

  const duplicatePost = async (post: BlogPost) => {
    setBusyId(post.id);
    const response = await fetch(`/api/admin/blog/${post.id}/duplicate`, {
      method: "POST",
    });
    setBusyId(null);
    if (response.ok) {
      const { post: newPost } = await response.json();
      router.push(`/admin/blog/${newPost.id}`);
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Supprimer définitivement "${post.title}" ?`)) return;
    setBusyId(post.id);
    await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    await loadPosts();
    setBusyId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Articles</h1>
        <Link
          href="/admin/blog/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          ✍️ Nouvel article
        </Link>
      </div>

      {posts.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou un extrait..."
            className="flex-1 min-w-[220px] px-4 py-2 border rounded-lg text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
          {allTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="">Tous les tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600 text-center py-16">
          Aucun article pour le moment.{" "}
          <Link href="/admin/blog/new" className="text-blue-600 hover:underline">
            Créez le premier !
          </Link>
        </p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-gray-600 text-center py-16">
          Aucun article ne correspond à ces filtres.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-bold text-lg hover:text-blue-600 transition truncate"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.published ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition"
                  title="Voir"
                >
                  👁
                </a>
                <button
                  onClick={() => togglePublished(post)}
                  disabled={busyId === post.id}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {post.published ? "Dépublier" : "Publier"}
                </button>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition"
                >
                  Éditer
                </Link>
                <button
                  onClick={() => duplicatePost(post)}
                  disabled={busyId === post.id}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  title="Dupliquer"
                >
                  ⧉
                </button>
                <button
                  onClick={() => deletePost(post)}
                  disabled={busyId === post.id}
                  className="px-3 py-1.5 text-sm border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
