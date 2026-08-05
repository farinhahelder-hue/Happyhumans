"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

const supabase = createClient();

const VISIBILITY_KEYS = [
  { key: "show-in-menu", label: "Afficher le menu de navigation" },
  { key: "show-in-footer", label: "Afficher le pied de page" },
  { key: "coaching-published", label: "Page /coaching visible" },
  { key: "entreprises-published", label: "Page /entreprises visible" },
  { key: "blog-published", label: "Blog visible" },
  { key: "contact-published", label: "Page /contact visible" },
] as const;

const CONTACT_FIELDS = [
  { key: "contact-email", label: "Email de contact" },
  { key: "contact-phone", label: "Téléphone de contact" },
] as const;

const BUSINESS_FIELDS = [
  { key: "business-name", label: "Nom de l'entreprise" },
  { key: "business-address-locality", label: "Ville" },
  { key: "business-address-country", label: "Pays (code ISO, ex: FR)" },
  { key: "business-service-area", label: "Zone de service" },
  { key: "business-price-range", label: "Gamme de prix (ex: €€)" },
] as const;

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useUnsavedChanges(JSON.stringify(values) !== JSON.stringify(baseline));

  const allKeys = [
    ...VISIBILITY_KEYS.map((f) => f.key),
    ...CONTACT_FIELDS.map((f) => f.key),
    ...BUSINESS_FIELDS.map((f) => f.key),
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cms_settings_kv")
      .select("key, value")
      .in("key", allKeys);

    const loaded: Record<string, string> = {};
    data?.forEach(({ key, value }) => {
      loaded[key] = value;
    });
    setValues(loaded);
    setBaseline(loaded);
    setLoading(false);
  };

  const handleToggle = (key: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  const handleTextChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const rows = allKeys
      .filter((key) => values[key] !== undefined)
      .map((key) => ({ key, value: values[key] }));

    const { error } = await supabase
      .from("cms_settings_kv")
      .upsert(rows, { onConflict: "key" });

    setSaving(false);
    if (!error) {
      setBaseline(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Paramètres</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ Paramètres sauvegardés
        </div>
      )}

      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-1">Visibilité</h2>
        <p className="text-sm text-gray-600 mb-6">
          Contrôle ce qui est visible sur le site public.
        </p>

        <div className="space-y-4">
          {VISIBILITY_KEYS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={values[key] === "true"}
                onChange={() => handleToggle(key)}
                className="w-5 h-5"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-1">Coordonnées</h2>
        <p className="text-sm text-gray-600 mb-6">
          Affichées sur la page /contact.
        </p>

        <div className="space-y-4">
          {CONTACT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="text"
                value={values[key] || ""}
                onChange={(e) => handleTextChange(key, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-1">Géo & Business</h2>
        <p className="text-sm text-gray-600 mb-6">
          Utilisé pour le référencement local (schema.org) affiché à Google.
        </p>

        <div className="space-y-4">
          {BUSINESS_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="text"
                value={values[key] || ""}
                onChange={(e) => handleTextChange(key, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
