'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookingWidget from '@/components/BookingWidget'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  // Hero
  hero_badge:           'Monica Schneider · Executive Coach · Happy Humans',
  hero_title:           'Clarté, confiance et relations qui vous ressemblent',
  hero_subtitle:        'Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling',
  hero_cta_primary:     'Découvrir l\'approche →',
  hero_cta_secondary:   'Séance découverte gratuite',
  // Services
  services_title:       'Comment puis-je vous aider ?',
  services_b2c_title:   'Pour les individus',
  services_b2c_text:    'Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarté, de la confiance et une direction qui leur ressemble vraiment.',
  services_b2c_cta:     'Réserver une séance découverte →',
  services_b2b_title:   'Pour les organisations',
  services_b2b_text:    'Coaching de leadership, ateliers, séminaires et accompagnement du changement pour remettre de l\'alignement et de l\'élan dans les équipes.',
  services_b2b_cta:     'Discuter d\'un projet →',
  // Test
  test_title:           'Quel est votre style d\'attachement ?',
  test_subtitle:        'Découvrez si vous êtes sécure, anxieux ou évitant — et ce que cela change dans vos relations. 16 questions · 5 minutes · Résultat immédiat.',
  test_cta:             'Faire le test gratuit',
  // Réservation
  booking_title:        'Prenez rendez-vous',
  booking_subtitle:     'Séance découverte offerte · 45 minutes · Sans engagement',
  // Contact
  contact_title:        'Une question ? Écrivez-nous',
  contact_intro:        'Je réponds personnellement à chaque message sous 48h. — Monica',
  // Misc
  logo_url:             '',
  contact_email:        'happyhumans.coaching@gmail.com',
}

export default function LandingPage() {
  const c = useCmsContent('home', DEFAULTS)
  const s = useCmsContent('settings', { contact_email: 'happyhumans.coaching@gmail.com', site_name: 'Happy Humans' })
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
    <div className="min-h-screen bg-[#f5f0e8] font-sans">
      <Header />
      <main className="pt-[72px]">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-stone-900 px-6 py-24 text-center md:py-36 md:px-10">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format&fit=crop"
            alt="Bureau élégant avec lumière naturelle, ambiance coaching professionnel"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
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
                className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition"
              >
                Séance découverte gratuite
              </button>
              <Link
                href="/contact"
                className="rounded-full border border-stone-500 px-8 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SERVICES ══════════════════════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:px-10 md:py-24" id="services">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Accompagnement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Un accompagnement pour deux contextes</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">Que vous soyez un individu en quête de clarté ou une organisation qui veut remettre de l&apos;alignement dans ses équipes.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les individus</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarté, de la confiance et une direction qui leur ressemble vraiment.</p>
                <button onClick={() => setBookingOpen(true)} className="text-sm font-semibold text-[#2d5f54] hover:underline">
                  Réserver une séance découverte →
                </button>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les organisations</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">Coaching de leadership, ateliers, séminaires et accompagnement du changement pour remettre de l&apos;alignement et de l&apos;élan dans les équipes.</p>
                <a href="#contact" className="text-sm font-semibold text-[#2d5f54] hover:underline">
                  Discuter d&apos;un projet →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ EXPLORER L'ACCOMPAGNEMENT ════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Aller plus loin</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Explorez les thématiques</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/coaching" className="group rounded-2xl bg-[#f5f0e8] p-7 hover:bg-[#eef5f3] transition">
                <div className="mb-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-serif font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">Coaching individuel</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">Clarté, confiance et direction — un accompagnement sur mesure pour managers, dirigeants et personnes en transition.</p>
                <span className="text-sm font-semibold text-[#2d5f54]">Découvrir →</span>
              </Link>
              <Link href="/relations" className="group rounded-2xl bg-[#f5f0e8] p-7 hover:bg-[#eef5f3] transition">
                <div className="mb-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-serif font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">Relations & Attachement</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">Comprenez votre style d&apos;attachement et transformez durablement vos relations — personnelles et professionnelles.</p>
                <span className="text-sm font-semibold text-[#2d5f54]">Découvrir →</span>
              </Link>
              <Link href="/entreprises" className="group rounded-2xl bg-[#f5f0e8] p-7 hover:bg-[#eef5f3] transition">
                <div className="mb-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-serif font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">Pour les organisations</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">Coaching de dirigeants, ateliers de cohésion et accompagnement du changement pour remettre de l&apos;alignement.</p>
                <span className="text-sm font-semibold text-[#2d5f54]">Découvrir →</span>
              </Link>
              <Link href="/happiness-design" className="group rounded-2xl bg-[#f5f0e8] p-7 hover:bg-[#eef5f3] transition">
                <div className="mb-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-serif font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">Happiness Design</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">12 séances pour reprendre les rênes de votre bonheur — au boulot et ailleurs. Un programme multidisciplinaire unique.</p>
                <span className="text-sm font-semibold text-[#2d5f54]">Découvrir →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ BOOKING ═══════════════════════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:px-10 md:py-24" id="booking">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Agenda</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Choisissez votre créneau</h2>
              <p className="mt-3 text-sm text-stone-500">Séance découverte offerte (45 min) ou programme de coaching.</p>
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
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54]" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54]" placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54] resize-none" placeholder="Votre question ou demande…" />
                </div>
                <button type="submit" disabled={sending} className="w-full rounded-full bg-[#2d5f54] py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a34] disabled:opacity-60 transition">
                  {sending ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
                {s.contact_email && (
                  <p className="text-center text-xs text-stone-400">
                    Ou directement par email : <a href={`mailto:${s.contact_email}`} className="text-[#2d5f54] hover:underline">{s.contact_email}</a>
                  </p>
                )}
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />

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
              <p className="text-sm text-stone-500 mt-1">Séance découverte offerte · 45 minutes · Sans engagement</p>
            </div>
            <BookingWidget defaultType="discovery" />
          </div>
        </div>
      )}

    </div>
  )
}
