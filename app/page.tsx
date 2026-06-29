'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookingWidget from '@/components/BookingWidget'
import { useCmsContent } from '@/hooks/useCmsContent'

const CARD_DEFS = {
  coaching: {
    href: '/coaching',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
    title: 'Coaching individuel',
    desc: 'Clarté, confiance et direction — un accompagnement sur mesure pour managers, dirigeants et personnes en transition.',
  },
  organisations: {
    href: '/entreprises',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    title: 'Pour les organisations',
    desc: 'Coaching de dirigeants, ateliers de cohésion et accompagnement du changement pour remettre de l\'alignement.',
  },
  'happiness-design': {
    href: '/happiness-design',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    title: 'Happiness Design',
    desc: '12 séances pour reprendre les rênes de votre bonheur — au boulot et ailleurs. Un programme multidisciplinaire unique.',
  },
  relations: {
    href: '/relations',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    title: 'Relations & Attachement',
    desc: 'Comprenez votre style d\'attachement et transformez durablement vos relations — personnelles et professionnelles.',
  },
}

const DEFAULTS = {
  // Hero
  hero_badge:           'Monica Schneider · Executive Coach · Happy Humans',
  hero_title:           'Clarté, confiance et relations qui vous ressemblent',
  hero_subtitle:        'Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling',
  hero_cta_primary:     'Séance découverte gratuite',
  hero_cta_contact:     'Me contacter',
  // Services
  services_badge:       'Accompagnement',
  services_title:       'Comment puis-je vous aider ?',
  services_b2c_title:  'Pour les particuliers',
  services_b2c_text:    'Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarté, de la confiance et une direction qui leur ressemble vraiment.',
  services_b2c_cta:    'Réserver une séance découverte →',
  services_b2b_title:  'Pour les organisations',
  services_b2b_text:    "Coaching de leadership, ateliers, séminaires et accompagnement du changement pour remettre de l'alignement et de l'élan dans les équipes.",
  services_b2b_cta:     "Discuter d'un projet →",
  // Cards section
  cards_section_badge:  'Aller plus loin',
  cards_section_title: 'Explorez les thématiques',
  cards_link_label:    'Découvrir →',
  // Booking
  booking_badge:        'Agenda',
  booking_widget_title: 'Choisissez votre créneau',
  booking_widget_subtitle: 'Séance découverte offerte (45 min) ou programme de coaching.',
  // Contact
  contact_section_badge: 'Contact',
  contact_section_title: 'Une question ? Écrivez-nous',
  contact_section_subtitle: 'Réponse sous 48h.',
  form_success_title:  'Message envoyé !',
  form_success_body:   'Monica vous répondra sous 48h à {email}.',
  form_sending:        'Envoi en cours…',
  form_submit:         'Envoyer le message',
  // Card order (Explorez les thématiques)
  home_card_order_1:   'coaching',
  home_card_order_2:   'organisations',
  home_card_order_3:   'happiness-design',
  home_card_order_4:   'relations',
  // Misc
  logo_url:            '',
  contact_email:       'happyhumans.coaching@gmail.com',
  booking_modal_title: 'Choisissez votre créneau',
  booking_modal_subtitle: 'Séance découverte offerte · 45 minutes · Sans engagement',
}

export default function LandingPage() {
  const c = useCmsContent('home', DEFAULTS)
  const s = useCmsContent('settings', { contact_email: 'happyhumans.coaching@gmail.com', site_name: 'Happy Humans' })
  const [bookingOpen, setBookingOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  // Dynamic card order for "Explorez les thématiques"
  const orderedCards = [
    c.home_card_order_1 || 'coaching',
    c.home_card_order_2 || 'organisations',
    c.home_card_order_3 || 'happiness-design',
    c.home_card_order_4 || 'relations',
  ].map(page => CARD_DEFS[page as keyof typeof CARD_DEFS] || CARD_DEFS.coaching)

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
              {c.field('hero_badge')}
            </p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">
              {c.field('hero_title')}
            </h1>
            <p className="mt-6 text-base text-stone-300 md:text-lg">{c.field('hero_subtitle')}</p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => setBookingOpen(true)}
                className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition"
              >
                {c.field('hero_cta_primary')}
              </button>
              <Link
                href="/contact"
                className="rounded-full border border-stone-500 px-8 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition"
              >
                {c.field('hero_cta_contact')}
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SERVICES ══════════════════════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:px-10 md:py-24" id="services">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.field('services_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.services_title || 'Un accompagnement pour deux contextes'}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">{c.field('services_b2c_title')}</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">{c.field('services_b2c_text')}</p>
                <button onClick={() => setBookingOpen(true)} className="text-sm font-semibold text-[#2d5f54] hover:underline">
                  {c.field('services_b2c_cta')}
                </button>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">{c.field('services_b2b_title')}</h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-600">{c.field('services_b2b_text')}</p>
                <a href="#contact" className="text-sm font-semibold text-[#2d5f54] hover:underline">
                  {c.field('services_b2b_cta')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ EXPLORER L'ACCOMPAGNEMENT ════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.field('cards_section_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.field('cards_section_title')}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {orderedCards.map((card) => (
                <Link key={card.href} href={card.href} className="group rounded-2xl bg-[#f5f0e8] p-7 hover:bg-[#eef5f3] transition">
                  <div className="mb-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-serif font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">{card.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{card.desc}</p>
                  <span className="text-sm font-semibold text-[#2d5f54]">{c.field('cards_link_label')}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOOKING ═══════════════════════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:px-10 md:py-24" id="booking">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.booking_badge}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.field('booking_widget_title')}</h2>
              <p className="mt-3 text-sm text-stone-500">{c.field('booking_widget_subtitle')}</p>
            </div>
            <BookingWidget />
          </div>
        </section>

        {/* ══ CONTACT ═══════════════════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:px-10 md:py-24" id="contact">
          <div className="mx-auto max-w-xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.field('contact_section_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.field('contact_section_title')}</h2>
              <p className="mt-3 text-sm text-stone-500">{c.field('contact_section_subtitle')}</p>
            </div>
            {sent ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-10 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#2d5f54] flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{c.field('form_success_title')}</h3>
                <p className="text-sm text-stone-500">{c.form_success_body.replace('{email}', form.email)}</p>
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
                  {sending ? c.form_sending : c.form_submit}
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
              <h2 className="text-xl font-semibold text-stone-900">{c.field('booking_modal_title')}</h2>
              <p className="text-sm text-stone-500 mt-1">{c.field('booking_modal_subtitle')}</p>
            </div>
            <BookingWidget defaultType="discovery" />
          </div>
        </div>
      )}

    </div>
  )
}
