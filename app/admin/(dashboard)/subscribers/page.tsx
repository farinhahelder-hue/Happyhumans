"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string | null;
  created_at: string;
}

export default function SubscribersPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      setSubs(data || []);
      setLoading(false);
    })();
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm("Retirer cet abonné de la liste ?")) return;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    if (!error) setSubs((s) => s.filter((x) => x.id !== id));
  };

  const exportCsv = () => {
    const header = ["email", "date d'inscription", "source", "statut"];
    const rows = subs.map((s) => [
      s.email,
      new Date(s.created_at).toLocaleDateString("fr-FR"),
      s.source || "",
      s.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abonnes-newsletter.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h1 className="text-4xl font-bold">Abonnés</h1>
        <button
          onClick={exportCsv}
          disabled={subs.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          ⬇ Exporter (CSV)
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        {subs.length} inscrit{subs.length > 1 ? "s" : ""} à la newsletter.
        Exporte la liste en CSV pour l&apos;importer dans ton outil d&apos;emailing.
      </p>

      {subs.length === 0 ? (
        <p className="text-gray-600">Aucun abonné pour le moment.</p>
      ) : (
        <div className="bg-white border rounded-lg divide-y">
          {subs.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{s.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(s.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {s.source ? ` · ${s.source}` : ""}
                </p>
              </div>
              <button
                onClick={() => remove(s.id)}
                className="px-3 py-1.5 text-xs text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
