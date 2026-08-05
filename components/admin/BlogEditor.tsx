"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { BlogPost } from "@/lib/types";

const supabase = createClient();

interface BlogEditorProps {
  initialPost?: BlogPost;
}

function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditor({ initialPost }: BlogEditorProps) {
  const router = useRouter();
  const isEditing = !!initialPost;

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [featuredImage, setFeaturedImage] = useState(
    initialPost?.featured_image || ""
  );
  const [tags, setTags] = useState((initialPost?.tags || []).join(", "));
  const [noteAngle, setNoteAngle] = useState(initialPost?.note_angle || "");
  const [readingTime, setReadingTime] = useState(
    initialPost?.reading_time?.toString() || ""
  );
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialPost?.seo_description || ""
  );
  const [ogImage, setOgImage] = useState(initialPost?.og_image || "");
  const [published, setPublished] = useState(initialPost?.published || false);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("cms_blog_posts")
      .select("tags")
      .then(({ data }) => {
        const tags = Array.from(
          new Set((data || []).flatMap((row: { tags: string[] | null }) => row.tags || []))
        ).sort((a, b) => a.localeCompare(b));
        setAvailableTags(tags);
      });
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      note_angle: noteAngle || null,
      reading_time: readingTime ? parseInt(readingTime, 10) : null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      og_image: ogImage || null,
      published,
    };

    try {
      const response = await fetch(
        isEditing ? `/api/admin/blog/${initialPost!.id}` : "/api/admin/blog",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Save failed");
      }

      const { post } = result;
      setSlug(post.slug);

      router.push(`/admin/blog/${post.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la sauvegarde."
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!isEditing) return;
    try {
      const response = await fetch(
        `/api/admin/blog/${initialPost!.id}/duplicate`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Duplicate failed");
      const { post } = await response.json();
      router.push(`/admin/blog/${post.id}`);
      router.refresh();
    } catch (err) {
      setError("Impossible de dupliquer l'article.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!confirm(`Supprimer définitivement "${title}" ?`)) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog/${initialPost!.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError("Impossible de supprimer l'article.");
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Modifier l'article" : "Nouvel article"}
          </h1>
          {isEditing && (
            <a
              href={`/blog/${initialPost!.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              👁 Voir l'article →
            </a>
          )}
        </div>

        <div className="flex gap-3">
          {isEditing && (
            <>
              <button
                onClick={handleDuplicate}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                ⧉ Dupliquer
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition text-sm font-medium disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-lg font-semibold"
              placeholder="Titre de l'article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder="titre-de-larticle"
            />
            <p className="text-xs text-gray-500 mt-1">/blog/{slug || "..."}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extrait</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Résumé accrocheur affiché dans la liste des articles"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Contenu</label>
              <div className="flex gap-1 text-sm border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1 ${
                    activeTab === "edit" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 ${
                    activeTab === "preview" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Aperçu
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Écrivez votre article ici…"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sélectionnez du texte puis cliquez un bouton pour le mettre en
                  forme, comme dans un traitement de texte.
                </p>
              </>
            ) : (
              <div className="border rounded-lg p-6 min-h-[400px]">
                {content ? (
                  <div
                    className="article-content text-gray-800"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="text-gray-400">Rien à prévisualiser pour le moment.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">Publié</p>
                <p className="text-xs text-gray-500">
                  {published
                    ? "Visible sur /blog et dans le sitemap"
                    : "Brouillon — visible uniquement en admin"}
                </p>
              </div>
            </label>
          </div>

          <ImageUploadField
            label="Image à la une"
            value={featuredImage}
            onChange={setFeaturedImage}
            placeholder="https://images.unsplash.com/... ou envoyez un fichier"
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              list="existing-tags"
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="Leadership, Coaching"
            />
            {availableTags.length > 0 && (
              <datalist id="existing-tags">
                {availableTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Temps de lecture (min)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm"
                placeholder="5"
              />
              <button
                type="button"
                onClick={() => setReadingTime(estimateReadingTime(content).toString())}
                className="px-3 py-2 text-xs border rounded-lg hover:bg-gray-50 transition whitespace-nowrap"
                title="Estimer à partir du contenu (~200 mots/min)"
              >
                Calculer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Note d'angle</label>
            <textarea
              value={noteAngle}
              onChange={(e) => setNoteAngle(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="Note interne sur l'angle de l'article (visible sur la page publiée)"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">SEO</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre SEO
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  placeholder="Par défaut : le titre de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description SEO
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  placeholder="Par défaut : l'extrait"
                />
              </div>

              <ImageUploadField
                label="Image Open Graph"
                value={ogImage}
                onChange={setOgImage}
                placeholder="Par défaut : l'image à la une"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
