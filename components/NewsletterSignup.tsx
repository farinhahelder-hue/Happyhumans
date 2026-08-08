"use client";

import { useState } from "react";

export default function NewsletterSignup({
  title = "Restez informé·e",
  subtitle = "Recevez mes articles et réflexions sur le leadership et le Happiness Design.",
  source = "site",
}: {
  title?: string;
  subtitle?: string;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, source }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand to-accent text-white rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-white/80 mb-6 max-w-xl mx-auto">{subtitle}</p>

      {status === "done" ? (
        <p className="font-semibold">✅ Merci ! Votre inscription est enregistrée.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 min-w-0 px-4 py-3 rounded-lg text-gray-900"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-white text-brand rounded-lg font-bold hover:bg-gray-100 transition disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "Envoi..." : "S'inscrire"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-white/90">
          Une erreur s&apos;est produite. Veuillez réessayer.
        </p>
      )}
    </div>
  );
}
