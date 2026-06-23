'use client'

import BookingWidget from '@/components/BookingWidget'
import MiniNav from '@/components/MiniNav'
import MiniFooter from '@/components/MiniFooter'

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
  reassurance_1_title:  '🎁 Séance découverte gratuite',
  reassurance_1_text:   '45 minutes sans engagement',
  reassurance_2_title:  '📅 Confirmation sous 48h',
  reassurance_2_text:   'Monica confirme chaque réservation manuellement',
  reassurance_3_title:  '🔄 Annulation libre',
  reassurance_3_text:   'Reporter ou annuler jusqu\'à 48h avant, sans frais',
}

export default function BookingPage() {
  const c = useCmsContent('booking', DEFAULTS_BOOKING)

  return (
    <>
      <MiniNav />
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

        <section className="bg-[#f5f0e8] py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <BookingWidget />
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              {[
                { emoji: '🎁', title: 'Séance découverte gratuite', desc: '45 minutes sans engagement pour vous présenter et voir si le coaching vous correspond.' },
                { emoji: '📅', title: 'Confirmation sous 48h', desc: 'Monica confirme chaque réservation manuellement et vous répond par email.' },
                { emoji: '🔄', title: 'Annulation libre', desc: 'Vous pouvez reporter ou annuler jusqu\'à 48h avant la séance, sans frais.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-2xl bg-[#f5f0e8] p-6">
                  <div className="text-2xl mb-3">{emoji}</div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MiniFooter />
    </>
  )
}
