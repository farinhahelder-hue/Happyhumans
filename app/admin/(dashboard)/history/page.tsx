"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HistoryEntry } from "@/lib/types";

const supabase = createClient();

const TYPE_LABELS: Record<string, string> = {
  blog_post: "Article de blog",
  setting: "Paramètre",
  contact_submission: "Formulaire de contact",
  testimonial: "Témoignage",
};

const ACTION_LABELS: Record<string, string> = {
  create: "➕ Création",
  update: "✏️ Modification",
  delete: "🗑️ Suppression",
  restore: "↩️ Restauration",
};

function summarize(value: string | null): string {
  if (!value) return "—";
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed.title || parsed.name || JSON.stringify(parsed).slice(0, 80);
    }
    return String(parsed);
  } catch {
    return value.slice(0, 80);
  }
}

const PAGE_SIZE = 25;
type TypeFilter =
  | "all"
  | "blog_post"
  | "setting"
  | "contact_submission"
  | "testimonial";

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, visibleCount]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [typeFilter]);

  const loadHistory = async () => {
    setLoading(true);
    let query = supabase
      .from("site_content_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(visibleCount);

    if (typeFilter !== "all") {
      query = query.eq("content_type", typeFilter);
    }

    const { data } = await query;
    setEntries(data || []);
    setHasMore((data || []).length === visibleCount);
    setLoading(false);
  };

  const canRestore = (entry: HistoryEntry) =>
    !!entry.old_value &&
    (entry.content_type === "blog_post" ||
      entry.content_type === "setting" ||
      entry.content_type === "testimonial");

  const handleRestore = async (entry: HistoryEntry) => {
    if (!confirm("Restaurer cette valeur précédente ?")) return;

    setRestoringId(entry.id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/history/${entry.id}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Restore failed");
      }

      setMessage("✅ Restauré avec succès");
      await loadHistory();
    } catch (err) {
      setMessage("❌ Impossible de restaurer cette entrée");
      console.error(err);
    } finally {
      setRestoringId(null);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Historique</h1>
      <p className="text-gray-600 mb-8">
        Chaque modification de contenu est enregistrée ici et peut être restaurée
        à tout moment.
      </p>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          {message}
        </div>
      )}

      <div className="flex gap-3 mb-6">
        {(
          [
            "all",
            "blog_post",
            "testimonial",
            "setting",
            "contact_submission",
          ] as const
        ).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                typeFilter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {type === "all" ? "Tout" : TYPE_LABELS[type] || type}
            </button>
          )
        )}
      </div>

      {loading && entries.length === 0 ? (
        <p className="text-gray-600">Chargement...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-600 text-center py-16">Aucune activité enregistrée.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {ACTION_LABELS[entry.action] || entry.action}
                    </span>
                    <span className="text-sm text-gray-500">
                      {TYPE_LABELS[entry.content_type] || entry.content_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {summarize(entry.new_value ?? entry.old_value)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {entry.changed_by}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === entry.id ? null : entry.id)
                    }
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition"
                  >
                    {expandedId === entry.id ? "Masquer" : "Détails"}
                  </button>
                  {canRestore(entry) && (
                    <button
                      onClick={() => handleRestore(entry)}
                      disabled={restoringId === entry.id}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {restoringId === entry.id ? "..." : "↩ Restaurer"}
                    </button>
                  )}
                </div>
              </div>

              {expandedId === entry.id && (
                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-600 mb-1">AVANT</p>
                    <pre className="bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                      {entry.old_value
                        ? JSON.stringify(JSON.parse(safeJson(entry.old_value)), null, 2)
                        : "—"}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mb-1">APRÈS</p>
                    <pre className="bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                      {entry.new_value
                        ? JSON.stringify(JSON.parse(safeJson(entry.new_value)), null, 2)
                        : "—"}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                disabled={loading}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Charger plus"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function safeJson(value: string): string {
  try {
    JSON.parse(value);
    return value;
  } catch {
    return JSON.stringify(value);
  }
}
