"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { storageKey, type ContentBlock, type ContentField } from "@/lib/contentBlocks";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import type { Locale } from "@/lib/i18n";
import ImageUploadField from "@/components/admin/ImageUploadField";

const supabase = createClient();

function FieldInput({
  field,
  value,
  onChange,
  altValue,
  onAltChange,
}: {
  field: ContentField;
  value: string;
  onChange: (value: string) => void;
  altValue?: string;
  onAltChange?: (value: string) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUploadField
        label={field.label}
        value={value}
        onChange={onChange}
        altValue={altValue}
        onAltChange={onAltChange}
        placeholder="https://... ou envoyez un fichier"
      />
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      )}
    </div>
  );
}

export default function ContentBlockEditor({
  block,
  initialValue,
  locale = "fr",
}: {
  block: ContentBlock;
  initialValue: Record<string, string> | Record<string, string>[];
  locale?: Locale;
}) {
  const [draft, setDraft] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(initialValue);
  const isDefault = JSON.stringify(draft) === JSON.stringify(block.defaults);

  useUnsavedChanges(isDirty);

  const handleReset = () => {
    const ok = window.confirm(
      "Rétablir le texte d'origine de ce bloc ? Les modifications non enregistrées seront perdues. Pensez à sauvegarder ensuite pour appliquer."
    );
    if (ok) setDraft(block.defaults);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const { error: dbError } = await supabase
        .from("cms_settings_kv")
        .upsert(
          { key: storageKey(block, locale), value: JSON.stringify(draft) },
          { onConflict: "key" }
        );
      if (dbError) throw dbError;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const blankItem = () =>
    Object.fromEntries(block.kind === "list" ? block.itemFields.map((f) => [f.key, ""]) : []);

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-start mb-1 gap-3">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          className="flex items-center gap-2 text-left min-w-0"
        >
          <span className="text-gray-400 text-xs w-3 shrink-0">
            {collapsed ? "▶" : "▼"}
          </span>
          <h3 className="font-bold truncate">{block.label}</h3>
          {isDirty && (
            <span
              title="Modifications non enregistrées"
              className="inline-block w-2 h-2 rounded-full bg-orange-400 shrink-0"
            />
          )}
        </button>
        <div className="flex items-center gap-3 shrink-0">
          {saved && <span className="text-xs text-green-700">✅ Sauvegardé</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button
            type="button"
            onClick={handleReset}
            disabled={isDefault}
            title="Rétablir le texte d'origine"
            className="px-3 py-1.5 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition disabled:opacity-40"
          >
            Rétablir
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
      {!collapsed && block.help && (
        <p className="text-xs text-gray-500 mb-4">{block.help}</p>
      )}

      {collapsed ? null : block.kind === "fields" ? (
        <div className="space-y-4 mt-4">
          {block.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={(draft as Record<string, string>)[field.key] || ""}
              onChange={(value) =>
                setDraft((d) => ({ ...(d as Record<string, string>), [field.key]: value }))
              }
              altValue={(draft as Record<string, string>)[`${field.key}Alt`] || ""}
              onAltChange={(value) =>
                setDraft((d) => ({
                  ...(d as Record<string, string>),
                  [`${field.key}Alt`]: value,
                }))
              }
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {(draft as Record<string, string>[]).map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  #{index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) => {
                        const items = [...(d as Record<string, string>[])];
                        if (index === 0) return items;
                        [items[index - 1], items[index]] = [items[index], items[index - 1]];
                        return items;
                      })
                    }
                    disabled={index === 0}
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50 transition disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) => {
                        const items = [...(d as Record<string, string>[])];
                        if (index === items.length - 1) return items;
                        [items[index], items[index + 1]] = [items[index + 1], items[index]];
                        return items;
                      })
                    }
                    disabled={index === (draft as Record<string, string>[]).length - 1}
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50 transition disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) =>
                        (d as Record<string, string>[]).filter((_, i) => i !== index)
                      )
                    }
                    className="px-2 py-1 text-xs border border-red-200 text-red-700 rounded hover:bg-red-50 transition"
                  >
                    🗑
                  </button>
                </div>
              </div>
              {block.itemFields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={item[field.key] || ""}
                  onChange={(value) =>
                    setDraft((d) => {
                      const items = [...(d as Record<string, string>[])];
                      items[index] = { ...items[index], [field.key]: value };
                      return items;
                    })
                  }
                  altValue={item[`${field.key}Alt`] || ""}
                  onAltChange={(value) =>
                    setDraft((d) => {
                      const items = [...(d as Record<string, string>[])];
                      items[index] = { ...items[index], [`${field.key}Alt`]: value };
                      return items;
                    })
                  }
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setDraft((d) => [...(d as Record<string, string>[]), blankItem()])
            }
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition"
          >
            + Ajouter un élément
          </button>
        </div>
      )}
    </div>
  );
}
