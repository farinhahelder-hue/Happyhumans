"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/**
 * Dependency-free WYSIWYG editor built on contentEditable + execCommand.
 * Outputs plain HTML (h2/h3/p/strong/em/ul/ol/a…) compatible with the existing
 * blog storage and public rendering. The DOM is the source of truth while
 * editing; React only reads via onChange to avoid caret jumps.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync from an external value change (e.g. initial load) without clobbering
  // the caret while the user is typing.
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value;
    }
  }, [value]);

  // Prefer <p> over <div> for new paragraphs across browsers.
  useEffect(() => {
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      // Not supported everywhere — harmless.
    }
  }, []);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Adresse du lien (https://...)");
    if (url) exec("createLink", url);
  };

  const tools: { key: string; label: React.ReactNode; title: string; run: () => void }[] = [
    { key: "h2", label: "Titre", title: "Titre de section", run: () => exec("formatBlock", "<h2>") },
    { key: "h3", label: "Sous-titre", title: "Sous-titre", run: () => exec("formatBlock", "<h3>") },
    { key: "p", label: "¶", title: "Paragraphe normal", run: () => exec("formatBlock", "<p>") },
    { key: "bold", label: <strong>G</strong>, title: "Gras", run: () => exec("bold") },
    { key: "italic", label: <em>I</em>, title: "Italique", run: () => exec("italic") },
    { key: "ul", label: "• Liste", title: "Liste à puces", run: () => exec("insertUnorderedList") },
    { key: "ol", label: "1. Liste", title: "Liste numérotée", run: () => exec("insertOrderedList") },
    { key: "quote", label: "❝ Citation", title: "Citation", run: () => exec("formatBlock", "<blockquote>") },
    { key: "link", label: "🔗 Lien", title: "Insérer un lien", run: addLink },
    { key: "clear", label: "Effacer style", title: "Retirer la mise en forme", run: () => exec("removeFormat") },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        {tools.map((t) => (
          <button
            key={t.key}
            type="button"
            title={t.title}
            // preventDefault on mousedown keeps the text selection so the
            // command applies to it instead of losing focus first.
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            className="px-2.5 py-1 text-sm border rounded bg-white hover:bg-gray-100 transition"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="article-content text-gray-800 min-h-[420px] p-4 focus:outline-none"
      />
    </div>
  );
}
