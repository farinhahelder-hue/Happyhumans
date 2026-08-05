"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  THEME_FONTS,
  THEME_KEYS,
  THEME_DEFAULTS,
  THEME_TEMPLATES,
  contrastWithWhite,
  type FontKey,
  type Theme,
} from "@/lib/theme";

const supabase = createClient();

const FONT_ENTRIES = Object.entries(THEME_FONTS) as [
  FontKey,
  (typeof THEME_FONTS)[FontKey]
][];

export default function AppearancePage() {
  const [theme, setTheme] = useState<Theme>(THEME_DEFAULTS);
  const [baseline, setBaseline] = useState<Theme>(THEME_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(theme) !== JSON.stringify(baseline);
  useUnsavedChanges(dirty);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("cms_settings_kv")
        .select("key, value")
        .in("key", Object.values(THEME_KEYS));

      const byKey = Object.fromEntries(
        (data || []).map(({ key, value }) => [key, value])
      );
      const font = byKey[THEME_KEYS.font];
      const loaded: Theme = {
        brand: byKey[THEME_KEYS.brand] || THEME_DEFAULTS.brand,
        accent: byKey[THEME_KEYS.accent] || THEME_DEFAULTS.accent,
        font: font && font in THEME_FONTS ? (font as FontKey) : THEME_DEFAULTS.font,
        logo: byKey[THEME_KEYS.logo] || "",
        favicon: byKey[THEME_KEYS.favicon] || "",
      };
      setTheme(loaded);
      setBaseline(loaded);
      setLoading(false);
    })();
  }, []);

  const update = (patch: Partial<Theme>) => {
    setTheme((t) => ({ ...t, ...patch }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const rows = [
      { key: THEME_KEYS.brand, value: theme.brand },
      { key: THEME_KEYS.accent, value: theme.accent },
      { key: THEME_KEYS.font, value: theme.font },
      { key: THEME_KEYS.logo, value: theme.logo },
      { key: THEME_KEYS.favicon, value: theme.favicon },
    ];
    const { error } = await supabase
      .from("cms_settings_kv")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (!error) {
      setBaseline(theme);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-4xl font-bold">Apparence</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        Personnalise l&apos;identité visuelle du site public. Les changements
        apparaissent après avoir rechargé le site.
      </p>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ Apparence sauvegardée — recharge le site pour voir le résultat.
        </div>
      )}

      {/* Live preview */}
      <section className="mb-8 rounded-xl border overflow-hidden">
        <div
          className="p-8 text-white"
          style={{
            background: `linear-gradient(to right, ${theme.brand}, ${theme.accent})`,
            fontFamily: THEME_FONTS[theme.font].family,
          }}
        >
          <p className="text-sm opacity-90 mb-1">Aperçu</p>
          <p className="text-2xl font-bold mb-4">
            {theme.logo ? "Votre logo s'affichera ici" : "Happy Humans"}
          </p>
          <div className="flex gap-3">
            <span
              className="px-4 py-2 rounded-lg font-bold text-sm"
              style={{ background: "#fff", color: theme.brand }}
            >
              Bouton principal
            </span>
            <span className="px-4 py-2 rounded-lg font-bold text-sm border border-white/70">
              Bouton secondaire
            </span>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-1">Modèles</h2>
        <p className="text-sm text-gray-600 mb-6">
          Applique une combinaison de couleurs et de police en un clic. Tu peux
          ensuite ajuster chaque élément ci-dessous.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_TEMPLATES.map((tpl) => {
            const active = tpl.brand === theme.brand && tpl.accent === theme.accent;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() =>
                  update({ brand: tpl.brand, accent: tpl.accent, font: tpl.font })
                }
                className={`text-left p-3 rounded-lg border-2 transition ${
                  active
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex gap-1 mb-2">
                  <span
                    className="w-6 h-6 rounded-full"
                    style={{ background: tpl.brand }}
                  />
                  <span
                    className="w-6 h-6 rounded-full"
                    style={{ background: tpl.accent }}
                  />
                </div>
                <span className="text-sm font-medium">{tpl.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Colours */}
      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Couleurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ColorField
            label="Couleur principale"
            help="Boutons, liens, titres accentués."
            value={theme.brand}
            onChange={(v) => update({ brand: v })}
          />
          <ColorField
            label="Couleur secondaire"
            help="Dégradés et accents complémentaires."
            value={theme.accent}
            onChange={(v) => update({ accent: v })}
          />
        </div>
      </section>

      {/* Font */}
      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-1">Police</h2>
        <p className="text-sm text-gray-600 mb-6">
          La police du texte sur tout le site public.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FONT_ENTRIES.map(([key, font]) => (
            <button
              key={key}
              type="button"
              onClick={() => update({ font: key })}
              style={{ fontFamily: font.family }}
              className={`p-3 rounded-lg border-2 text-left transition ${
                theme.font === key
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="block text-lg">Aa</span>
              <span className="block text-xs text-gray-600 mt-1">{font.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Logo & favicon */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-1">Logo &amp; icône</h2>
        <p className="text-sm text-gray-600 mb-6">
          Le logo remplace le nom écrit dans l&apos;en-tête. L&apos;icône (favicon)
          s&apos;affiche dans l&apos;onglet du navigateur.
        </p>
        <div className="space-y-6">
          <ImageUploadField
            label="Logo (en-tête)"
            value={theme.logo}
            onChange={(v) => update({ logo: v })}
            placeholder="https://... ou envoyez un fichier"
          />
          <ImageUploadField
            label="Icône du site (favicon)"
            value={theme.favicon}
            onChange={(v) => update({ favicon: v })}
            placeholder="https://... ou envoyez un fichier (idéalement carré)"
          />
        </div>
      </section>
    </div>
  );
}

function ColorField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const lowContrast = contrastWithWhite(value) < 4;
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <p className="text-xs text-gray-500 mb-2">{help}</p>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 rounded border cursor-pointer bg-white p-1"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-32 px-3 py-2 border rounded-lg text-sm font-mono"
        />
      </div>
      {lowContrast && (
        <p className="text-xs text-amber-600 mt-2">
          ⚠ Cette couleur est claire : le texte blanc des boutons risque
          d&apos;être peu lisible. Choisis une teinte plus foncée si besoin.
        </p>
      )}
    </div>
  );
}
