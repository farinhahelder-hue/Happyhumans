"use client";

import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Échec de l'envoi");

      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 border rounded-lg text-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 text-xs border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? "Envoi..." : "📤 Envoyer"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {value && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-20 rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-1.5 text-xs text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Retirer
          </button>
        </div>
      )}
    </div>
  );
}
