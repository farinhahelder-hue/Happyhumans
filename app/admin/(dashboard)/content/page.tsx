"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CONTENT_BLOCKS, storageKey, type ContentBlock } from "@/lib/contentBlocks";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
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
  const [locale, setLocale] = useState<Locale>("fr");
  const [values, setValues] = useState<
    Record<string, Record<string, string> | Record<string, string>[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValues(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const loadValues = async (loc: Locale) => {
    setLoading(true);
    const frKeys = CONTENT_BLOCKS.map((b) => storageKey(b, "fr"));
    const locKeys =
      loc === "fr" ? [] : CONTENT_BLOCKS.map((b) => storageKey(b, loc));
    const { data } = await supabase
      .from("cms_settings_kv")
      .select("key, value")
      .in("key", [...frKeys, ...locKeys]);

    const rawByKey = Object.fromEntries(
      (data || []).map(({ key, value }) => [key, value])
    );

    const loaded: Record<string, Record<string, string> | Record<string, string>[]> = {};
    for (const block of CONTENT_BLOCKS) {
      const baseKey = storageKey(block, "fr");
      // EN editing starts from the French text as a translation base.
      const chosen =
        (loc === "fr" ? undefined : rawByKey[storageKey(block, loc)]) ??
        rawByKey[baseKey];
      if (chosen) {
        try {
          loaded[baseKey] = JSON.parse(chosen);
          continue;
        } catch {
          // fall through to defaults on malformed JSON
        }
      }
      loaded[baseKey] = block.defaults;
    }

    setValues(loaded);
    setLoading(false);
  };

  const blocksForTab = CONTENT_BLOCKS.filter((b) => b.page === activeTab);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
        <h1 className="text-4xl font-bold">Contenu du site</h1>
        <div className="flex gap-1 border rounded-lg overflow-hidden shrink-0">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-4 py-2 text-sm font-medium transition ${
                locale === loc
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-8">
        Modifie les textes des pages publiques. Chaque bloc se sauvegarde
        indépendamment.
        {locale !== "fr" && (
          <>
            {" "}
            Tu édites la version{" "}
            <strong>{LOCALE_LABELS[locale]}</strong> : les champs laissés tels
            quels afficheront le texte français sur le site.
          </>
        )}
      </p>

      <div className="flex items-center justify-between mb-8 border-b">
        <div className="flex gap-3 overflow-x-auto">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setActiveTab(page.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
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
          href={
            locale === "fr"
              ? PAGE_PREVIEW[activeTab].href
              : `/${locale}${PAGE_PREVIEW[activeTab].href}`.replace(/\/$/, "") ||
                `/${locale}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline whitespace-nowrap pb-2 pl-4"
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
              key={`${storageKey(block, "fr")}-${locale}`}
              block={block as ContentBlock}
              initialValue={values[storageKey(block, "fr")]}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
