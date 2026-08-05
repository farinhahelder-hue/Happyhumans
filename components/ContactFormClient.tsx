"use client";

import { useState } from "react";
import { events } from "@/lib/analytics";

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // Honeypot: a field hidden from humans. Bots tend to fill every input, so a
  // non-empty value marks the submission as spam (handled server-side).
  const [website, setWebsite] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      events.submitContactForm(formData.subject);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      events.contactFormError(err instanceof Error ? err.message : "unknown");
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from humans, ignored by screen readers. */}
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
      <div>
        <label className="block text-sm font-medium mb-2">Nom *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Téléphone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Sujet *</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="coaching">Coaching individuel</option>
          <option value="entreprise">Programme entreprise</option>
          <option value="workshop">Workshop/Formation</option>
          <option value="partenariat">Partenariat</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          placeholder="Votre message..."
        />
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ Message envoyé avec succès ! Je vous répondrai rapidement.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ❌ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
}
