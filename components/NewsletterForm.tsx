"use client";

import { useState } from "react";
import { useCmsContent } from "@/hooks/useCmsContent";
import { SITE_DEFAULTS } from "@/lib/cms-defaults/site";

interface NewsletterFormProps {
  variant?: "blog" | "article" | "inline";
}

export default function NewsletterForm({ variant = "blog" }: NewsletterFormProps) {
  // Tous les textes sont modifiables dans le CMS (page « Textes communs » → Newsletter)
  const c = useCmsContent("site", SITE_DEFAULTS);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(c.newsletter_error_invalid);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(c.newsletter_success);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || c.newsletter_error_generic);
      }
    } catch {
      setStatus("error");
      setMessage(c.newsletter_error_network);
    }
  };

  if (variant === "article") {
    return (
      <section className="my-14 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-900 px-8 py-10 text-white">
        <p className="text-amber-300 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          {c.newsletter_badge}
        </p>
        <h3 className="text-xl md:text-2xl font-serif font-light mb-2 leading-snug">
          {c.newsletter_title_short}
        </h3>
        <p className="text-white/60 text-sm mb-6">
          {c.newsletter_text}
        </p>
        {status === "success" ? (
          <p className="text-amber-300 font-medium text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.newsletter_placeholder}
              required
              className="flex-1 px-4 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {status === "loading" ? "…" : c.newsletter_button}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-2 text-red-300 text-xs">{message}</p>}
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {status === "success" ? (
          <p className="text-amber-300 font-medium text-sm">{message}</p>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.newsletter_placeholder}
              required
              className="flex-1 min-w-0 px-5 py-3 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="shrink-0 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "…" : c.newsletter_button}
            </button>
          </>
        )}
        {status === "error" && <p className="text-red-300 text-xs mt-1">{message}</p>}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-stone-900 to-amber-900 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        <p className="text-amber-300 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          {c.newsletter_badge}
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-4 leading-snug">
          {c.newsletter_title}
        </h2>
        <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          {c.newsletter_text}
        </p>

        {status === "success" ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
            <p className="text-amber-200 font-medium">{message}</p>
            <p className="text-white/60 text-sm mt-2">{c.newsletter_success_hint}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.newsletter_placeholder}
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {status === "loading" ? c.newsletter_button_loading : c.newsletter_button}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-red-300 text-sm">{message}</p>}

        <p className="mt-4 text-white/35 text-xs">{c.newsletter_footnote}</p>
      </div>
    </section>
  );
}
