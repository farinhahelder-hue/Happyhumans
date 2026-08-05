"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CONTENT_BLOCKS, storageKey, type ContentBlock } from "@/lib/contentBlocks";
import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

const supabase = createClient();

const PAGES = [
  { id: "home", label: "Accueil" },
  { id: "coaching", label: "Coaching" },
  { id: "entreprises", label: "Entreprises" },
  { id: "contact", label: "Contact" },
  { id: "global", label: "Général" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

// Public URL each tab maps to, for the "Voir la page" preview link.
const PAGE_PREVIEW: Record<PageId, { href: string; label: string }> = {
  home: { href: "/", label: "Voir la page ↗" },
  coaching: { href: "/coaching", label: "Voir la page ↗" },
  entreprises: { href: "/entreprises", label: "Voir la page ↗" },
  contact: { href: "/contact", label: "Voir la page ↗" },
  global: { href: "/", label: "Voir le site ↗" },
};

export default function ContentAdminPage() {
  const [activeTab, setActiveTab] = useState<PageId>("home");
  const [values, setValues] = useState<
    Record<string, Record<string, string> | Record<string, string>[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    setLoading(true);
    const keys = CONTENT_BLOCKS.map(storageKey);
    const { data } = await supabase
      .from("cms_settings_kv")
      .select("key, value")
      .in("key", keys);

    const rawByKey = Object.fromEntries(
      (data || []).map(({ key, value }) => [key, value])
    );

    const loaded: Record<string, Record<string, string> | Record<string, string>[]> = {};
    for (const block of CONTENT_BLOCKS) {
      const raw = rawByKey[storageKey(block)];
      if (raw) {
        try {
          loaded[storageKey(block)] = JSON.parse(raw);
          continue;
        } catch {
          // fall through to defaults on malformed JSON
        }
      }
      loaded[storageKey(block)] = block.defaults;
    }

    setValues(loaded);
    setLoading(false);
  };

  const blocksForTab = CONTENT_BLOCKS.filter((b) => b.page === activeTab);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Contenu du site</h1>
      <p className="text-gray-600 mb-8">
        Modifie les textes des pages publiques — titres, programmes, FAQ, tarifs,
        etc. Chaque bloc se sauvegarde indépendamment.
      </p>

      <div className="flex items-center justify-between mb-8 border-b">
        <div className="flex gap-3">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setActiveTab(page.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === page.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
        <a
          href={PAGE_PREVIEW[activeTab].href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline whitespace-nowrap pb-2"
        >
          {PAGE_PREVIEW[activeTab].label}
        </a>
      </div>

      {loading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : (
        <div className="space-y-6">
          {blocksForTab.map((block) => (
            <ContentBlockEditor
              key={storageKey(block)}
              block={block as ContentBlock}
              initialValue={values[storageKey(block)]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
