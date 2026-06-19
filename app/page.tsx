'use client'
import { useState } from 'react'
import Link from 'next/link'
import BookingWidget from '@/components/BookingWidget'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_title:   'Clarté, confiance et relations qui vous ressemblent',
  hero_subtitle: 'Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling',
  logo_url: '',
  contact_email: 'monica@happyhumans.ch',
}

export default function LandingPage() {
  const c = useCmsContent('home', DEFAULTS)
  const s = useCmsContent('settings', { contact_email: 'monica@happyhumans.ch', site_name: 'Happy Humans' })
  const [bookingOpen, setBookingOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const year = new Date().getFullYear()

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'contact' }),
      })
      setSent(true)
    } catch { /* silent */ }
    finally { setSending(false) }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-sans">

      {/* ══ NAV MINIMALISTE ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur-sm md:px-10">
        <div className="flex items-center gap-3">
          {c.logo_url
            ? <img src={c.logo_url} alt="Happy Humans" className="h-8 w-auto" />
            : <span className="text-lg font-serif font-semibold text-stone-900">Happy Humans</span>
          }
        </div>
        <button
          onClick={() => setBookingOpen(true)}
          className="rounded-full bg-[#2f6b61] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#235249] transition"
        >
          Réserver une séance
        </button>
      </header>

      <main>

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-stone-900 px-6 py-24 text-center md:py-36 md:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(43,111,98,0.35),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(182,140,94,0.2),transparent_40%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Monica Schneider · Executive Coach · Happy Humans
            </p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">
              {c.hero_title}
            </h1>
            <p className="mt-6 text-base text-stone-300 md:text-lg">{c.hero_subtitle}</p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => setBookingOpen(true)}
                className="rounded-full bg-[#2f6b61] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#235249] transition"
              >
                Séance découverte gratuite
              </button>
              <a
                href="#contact"
                className="rounded-full border border-stone-500 px-8 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition"
              >
                Nous écrire
              </a>
            </div>
          </div>
        </section>

        {/* ══ SERVICES ══════════════════════════════════════════════════ */}
        <section className="bg-[#f7f4ef] px-6 py-20 md:px-10 md:py-24" id="services">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Accompagnement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Un accompagnement pour deux contextes</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">Que vous soyez un individu en quête de clarté ou une organisation qui veut remettre de l&apos;alignement dans ses équipes.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3] text-xl">🧭</div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les individus</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarté, de la confiance et une direction qui leur ressemble vraiment.</p>
                <button onClick={() => setBookingOpen(true)} className="text-sm font-semibold text-[#2f6b61] hover:underline">
                  Réserver une séance découverte →
                </button>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3] text-xl">🏢</div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les organisations</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">Coaching de leadership, ateliers, séminaires et accompagnement du changement pour remettre de l&apos;alignement et de l&apos;élan dans les équipes.</p>
                <a href="#contact" className="text-sm font-semibold text-[#2f6b61] hover:underline">
                  Discuter d&apos;un projet →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ RELATIONS / TEST ATTACHEMENT ══════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:px-10 md:py-24" id="relations">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Relations & Attachement</p>
                <h2 className="mb-5 text-2xl font-serif font-light leading-tight text-stone-900 md:text-3xl">
                  Quel est votre style d&apos;attachement ?
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-stone-600">
                  Découvrez si vous êtes sécure, anxieux ou évitant — et ce que cela change dans vos relations. 16 questions · 5 minutes · Résultat immédiat.
                </p>
                <p className="mb-7 text-sm leading-relaxed text-stone-600">
                  Lors d&apos;une <strong>séance offerte de 30 minutes</strong>, Monica vous accompagne pour identifier vos 3 actions concrètes vers des relations plus épanouissantes.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/test-attachement"
                    className="inline-block rounded-full bg-[#2f6b61] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#235249] transition"
                  >
                    Faire le test gratuit
                  </Link>
                  <Link
                    href="/relations"
                    className="inline-block rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-[#2f6b61] hover:text-[#2f6b61] transition"
                  >
                    Explorer les ressources
                  </Link>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  { emoji: '📖', title: 'Théorie de l\'attachement', desc: 'Sécure, anxieux, évitant — comprenez vos schémas relationnels.' },
                  { emoji: '🪞', title: 'Carl Rogers', desc: 'Regard positif inconditionnel et amour de soi comme base.' },
                  { emoji: '💝', title: 'Erich Fromm', desc: 'L\'art d\'aimer : de l\'amour immature à l\'amour mature.' },
                ].map(({ emoji, title, desc }) => (
                  <Link key={title} href="/relations" className="flex gap-4 rounded-xl bg-[#f7f4ef] p-4 hover:shadow-sm transition group">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-stone-900 group-hover:text-[#2f6b61] transition">{title}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ BOOKING ═══════════════════════════════════════════════════ */}
        <section className="bg-[#f7f4ef] px-6 py-20 md:px-10 md:py-24" id="booking">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Agenda</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Choisissez votre créneau</h2>
              <p className="mt-3 text-sm text-stone-500">Séance découverte offerte (30 min) ou programme de coaching.</p>
            </div>
            <BookingWidget />
          </div>
        </section>

        {/* ══ CONTACT ═══════════════════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:px-10 md:py-24" id="contact">
          <div className="mx-auto max-w-xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Contact</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Une question ? Écrivez-nous</h2>
              <p className="mt-3 text-sm text-stone-500">Réponse sous 48h.</p>
            </div>
            {sent ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Message envoyé !</h3>
                <p className="text-sm text-stone-500">Monica vous répondra sous 48h à <strong>{form.email}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Nom *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] resize-none" placeholder="Votre question ou demande…" />
                </div>
                <button type="submit" disabled={sending} className="w-full rounded-full bg-[#2f6b61] py-3.5 text-sm font-semibold text-white hover:bg-[#235249] disabled:opacity-60 transition">
                  {sending ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
                {s.contact_email && (
                  <p className="text-center text-xs text-stone-400">
                    Ou directement par email : <a href={`mailto:${s.contact_email}`} className="text-[#2f6b61] hover:underline">{s.contact_email}</a>
                  </p>
                )}
              </form>
            )}
          </div>
        </section>

      </main>

      {/* ══ FOOTER MINIMAL ════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-200 bg-stone-900 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-stone-400 md:flex-row">
            <p className="font-serif text-base text-stone-300 font-semibold">Happy Humans</p>
            <p>© {year} Happy Humans — Monica Schneider. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-stone-200 transition">Mentions légales</Link>
              <Link href="/politique-confidentialite" className="hover:text-stone-200 transition">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ MODAL BOOKING ═════════════════════════════════════════════════ */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/70 backdrop-blur-sm p-4 pt-16"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setBookingOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              ✕
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-stone-900">Choisissez votre créneau</h2>
              <p className="text-sm text-stone-500 mt-1">Séance découverte offerte · 30 minutes · Sans engagement</p>
            </div>
            <BookingWidget defaultType="discovery" />
          </div>
        </div>
      )}

    </div>
  )
}
