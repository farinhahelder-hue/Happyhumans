"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

const supabase = createClient();

const BLANK = {
  quote: "",
  author_name: "",
  author_role: "",
  company: "",
  published: false,
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState(BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cms_testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    setTestimonials(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.author_name.trim()) {
      setError("Le témoignage et le nom sont obligatoires.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Échec de la création");

      setNewTestimonial(BLANK);
      setShowNewForm(false);
      await loadTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la création");
    } finally {
      setCreating(false);
    }
  };

  const moveTestimonial = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const current = testimonials[index];
    const target = testimonials[targetIndex];

    const reordered = [...testimonials];
    reordered[index] = target;
    reordered[targetIndex] = current;
    setTestimonials(reordered);

    await Promise.all([
      fetch(`/api/admin/testimonials/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, display_order: targetIndex }),
      }),
      fetch(`/api/admin/testimonials/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, display_order: index }),
      }),
    ]);
    await loadTestimonials();
  };

  const deleteTestimonial = async (testimonial: Testimonial) => {
    if (!confirm(`Supprimer le témoignage de "${testimonial.author_name}" ?`)) return;
    await fetch(`/api/admin/testimonials/${testimonial.id}`, { method: "DELETE" });
    await loadTestimonials();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-4xl font-bold">Témoignages</h1>
        <button
          onClick={() => setShowNewForm((v) => !v)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {showNewForm ? "Annuler" : "+ Nouveau témoignage"}
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        Affichés sur la page /coaching, dans l'ordre ci-dessous. Seuls les
        témoignages "Publié" apparaissent sur le site.
      </p>

      {showNewForm && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 space-y-4">
          <h2 className="font-bold">Nouveau témoignage</h2>
          <textarea
            value={newTestimonial.quote}
            onChange={(e) =>
              setNewTestimonial((t) => ({ ...t, quote: e.target.value }))
            }
            rows={3}
            placeholder="Le texte du témoignage..."
            className="w-full px-4 py-2 border rounded-lg text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={newTestimonial.author_name}
              onChange={(e) =>
                setNewTestimonial((t) => ({ ...t, author_name: e.target.value }))
              }
              placeholder="Nom *"
              className="px-4 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              value={newTestimonial.author_role}
              onChange={(e) =>
                setNewTestimonial((t) => ({ ...t, author_role: e.target.value }))
              }
              placeholder="Fonction (ex: Directeur Général)"
              className="px-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <input
            type="text"
            value={newTestimonial.company}
            onChange={(e) =>
              setNewTestimonial((t) => ({ ...t, company: e.target.value }))
            }
            placeholder="Entreprise (optionnel)"
            className="w-full px-4 py-2 border rounded-lg text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newTestimonial.published}
              onChange={(e) =>
                setNewTestimonial((t) => ({ ...t, published: e.target.checked }))
              }
            />
            Publier immédiatement
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {creating ? "Création..." : "Créer"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-600 text-center py-16">
          Aucun témoignage pour le moment.
        </p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialRow
              key={testimonial.id}
              testimonial={testimonial}
              isFirst={index === 0}
              isLast={index === testimonials.length - 1}
              onMoveUp={() => moveTestimonial(index, -1)}
              onMoveDown={() => moveTestimonial(index, 1)}
              onDelete={() => deleteTestimonial(testimonial)}
              onSaved={loadTestimonials}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialRow({
  testimonial,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSaved,
}: {
  testimonial: Testimonial;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState({
    quote: testimonial.quote,
    author_name: testimonial.author_name,
    author_role: testimonial.author_role || "",
    company: testimonial.company || "",
    published: testimonial.published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isDirty =
    draft.quote !== testimonial.quote ||
    draft.author_name !== testimonial.author_name ||
    draft.author_role !== (testimonial.author_role || "") ||
    draft.company !== (testimonial.company || "") ||
    draft.published !== testimonial.published;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, display_order: testimonial.display_order }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Échec de la sauvegarde");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            testimonial.published
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {testimonial.published ? "Publié" : "Brouillon"}
        </span>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="Monter"
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 transition disabled:opacity-30"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="Descendre"
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 transition disabled:opacity-30"
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            title="Supprimer"
            className="px-2 py-1 text-sm border border-red-200 text-red-700 rounded hover:bg-red-50 transition"
          >
            🗑
          </button>
        </div>
      </div>

      <textarea
        value={draft.quote}
        onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))}
        rows={3}
        className="w-full px-4 py-2 border rounded-lg text-sm"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={draft.author_name}
          onChange={(e) => setDraft((d) => ({ ...d, author_name: e.target.value }))}
          placeholder="Nom *"
          className="px-4 py-2 border rounded-lg text-sm"
        />
        <input
          type="text"
          value={draft.author_role}
          onChange={(e) => setDraft((d) => ({ ...d, author_role: e.target.value }))}
          placeholder="Fonction"
          className="px-4 py-2 border rounded-lg text-sm"
        />
      </div>

      <input
        type="text"
        value={draft.company}
        onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
        placeholder="Entreprise (optionnel)"
        className="w-full px-4 py-2 border rounded-lg text-sm"
      />

      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
          />
          Publié
        </label>

        <div className="flex items-center gap-3">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
