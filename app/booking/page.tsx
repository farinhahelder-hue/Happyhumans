'use client'

import BookingWidget from '@/components/BookingWidget'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS_BOOKING = {
  hero_badge:           'Réservation',
  hero_title:           'Choisissez votre créneau',
  hero_subtitle:        'Séance découverte gratuite (45 min) — choisissez la date qui vous convient.',
  filter_all:           'Toutes',
  filter_discovery:     'Découverte',
  filter_coaching:      'Coaching',
  filter_enterprise:    'Entreprises',
  empty_slots_text:     'Aucun créneau disponible pour le moment.',
  form_name_label:      'Votre nom',
  form_email_label:     'Votre email',
  form_phone_label:     'Téléphone (optionnel)',
  form_message_label:   'Message (optionnel)',
  form_submit_label:    'Envoyer ma demande',
  success_title:        'Demande envoyée !',
  success_text:         'Monica vous confirmera votre séance sous 48h.',
  reassurance_1_title:  'Séance découverte gratuite',
  reassurance_1_text:   '45 minutes sans engagement',
  reassurance_2_title:  'Confirmation sous 48h',
  reassurance_2_text:   'Monica confirme chaque réservation manuellement',
  reassurance_3_title:  'Annulation libre',
  reassurance_3_text:   "Reporter ou annuler jusqu'à 48h avant, sans frais",
}

export default function BookingPage() {
  const c = useCmsContent('booking', DEFAULTS_BOOKING)

  return (
    <>
      <Header />
      <main>
        <section className="relative flex h-[38vh] items-end overflow-hidden bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop"
            alt="Paysage serein avec lumière naturelle, ambiance de sérénité et clarté"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(43,111,98,0.35),transparent_50%)]" />
          <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 md:px-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Réservation</p>
            <h1 className="text-4xl font-serif font-light text-white md:text-5xl">Choisissez votre créneau</h1>
            <p className="mt-4 max-w-xl text-base text-stone-300">
              Séance découverte gratuite (45 min) — choisissez la date qui vous convient.
            </p>
          </div>
        </section>

        {/* Calendly — réservation directe */}
        <section className="bg-[#f5f0e8] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-10">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800 mb-2">Calendrier disponible</p>
              <h2 className="text-2xl font-serif font-light text-stone-900">Choisissez votre créneau</h2>
              <p className="text-sm text-stone-500 mt-2">Réservation instantanée — confirmation immédiate dans votre agenda</p>
            </div>
            {/* Calendly inline widget */}
            <div
              className="calendly-inline-widget rounded-2xl overflow-hidden shadow-sm"
              data-url="https://calendly.com/happyhumans-coaching?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=2d5f54"
              style={{ minWidth: 320, height: 700 }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </div>
        </section>

        {/* Booking widget alternatif */}
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="mb-6 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider">Ou sélectionner parmi les créneaux disponibles</p>
            </div>
            <BookingWidget />
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, title: 'Séance découverte gratuite', desc: '45 minutes sans engagement pour vous présenter et voir si le coaching vous correspond.' },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: 'Confirmation sous 48h', desc: 'Monica confirme chaque réservation manuellement et vous répond par email.' },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>, title: 'Annulation libre', desc: "Vous pouvez reporter ou annuler jusqu'à 48h avant la séance, sans frais." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="rounded-2xl bg-[#f5f0e8] p-6">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mx-auto mb-3">{icon}</div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
