'use client'
import Header from '@/components/Header'
import TemoignagesWidget from '@/components/TemoignagesWidget'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:         '',
  hero_title:         "Il y a des moments où il faut réapprendre à habiter son rôle.",
  hero_subtitle:      "Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling — Monica Schneider accompagne des managers, dirigeants et personnes en transition qui veulent retrouver clarté, confiance et une direction qui leur ressemble vraiment.",
  coaching_b2c_image: '',
  coaching_b2c_title: 'Coaching individuel',
  coaching_b2c_text:  "Un espace pour ralentir, regarder ce qui se passe vraiment — et construire un mouvement qui tient dans la durée.\n\nLe coaching que je propose n'est pas un conseil. C'est un accompagnement qui part de là où vous êtes vraiment : vos questionnements, vos tensions, vos ambitions telles que vous les vivez, pas comme elles devraient être.\n\nJe m'appuie sur les travaux de John Bowlby et Mary Ainsworth sur la théorie de l'attachement, sur les apports de Carl Rogers (regard positif inconditionnel), et sur la philosophie pratique pour travailler sur le sens et la clarté de vos directions.",
  coaching_b2b_image: '',
  coaching_b2b_title: 'Pour les organisations',
  coaching_b2b_text:  "Coaching de dirigeants, ateliers de cohésion, accompagnement du changement et séminaires sur mesure.\n\nQuand une équipe perd de sa cohérence, les résultats s'en ressentiront toujours. Je travaille avec les dirigeants et les organisations pour remettre de l'alignement — entre les personnes, entre les objectifs et les moyens, entre ce qu'on dit et ce qu'on fait.",
  form_intro:         'Décrivez votre enjeu ou posez une question — je vous répondrai sous 48h.',
  reassurance:        '100% confidentiel · Sans engagement · Réponse sous 48h · Séance découverte offerte',
}

export default function CoachingPage() {
  const c = useCmsContent('coaching', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3] py-24 md:py-32 overflow-hidden">
          {c.hero_image && (
            <img src={c.hero_image} alt="Photo de fond" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          )}
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">Coaching individuel</p>
            <h1 className="max-w-4xl text-4xl font-serif font-light leading-tight text-stone-900 md:text-6xl">{c.hero_title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-700">{c.hero_subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </section>

        {/* COACHING INDIVIDUEL */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Individuel</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.coaching_b2c_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2c_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Me contacter →
                </Link>
              </div>
              <img
                src={c.coaching_b2c_image || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop'}
                alt="Personne en introspection et réflexion, coaching individuel"
                className="rounded-2xl object-cover shadow-lg h-72 w-full"
              />
            </div>
          </div>
        </section>

        {/* COACHING B2B */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <img
                src={c.coaching_b2b_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop'}
                alt="Réunion d'équipe et leadership organisationnel en entreprise"
                className="rounded-2xl object-cover shadow-lg h-72 w-full order-2 md:order-1"
              />
              <div className="space-y-5 order-1 md:order-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Organisations</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.coaching_b2b_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2b_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/entreprises" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Voir les offres entreprises →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="bg-[#2f6b61] py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">Prêt·e à commencer ?</h2>
            <p className="mb-6 text-emerald-100 text-sm">{c.form_intro}</p>
            <Link href="/contact" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Prendre contact
            </Link>
            <p className="mt-4 text-xs text-emerald-200">{c.reassurance}</p>
          </div>
        </section>


        {/* ── TARIFS ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Tarifs</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Un investissement transparent</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  label: 'Séance découverte',
                  price: 'Gratuit',
                  unit: '30 minutes',
                  desc: 'Premier échange pour clarifier votre situation, vos attentes et voir si le coaching vous convient.',
                  cta: 'Réserver maintenant',
                  highlight: false,
                },
                {
                  label: 'Séance individuelle',
                  price: '120 €',
                  unit: '60 minutes',
                  desc: 'Séance ponctuelle pour travailler sur un sujet précis ou maintenir une dynamique engagée.',
                  cta: 'Prendre rendez-vous',
                  highlight: false,
                },
                {
                  label: 'Programme complet',
                  price: '350 €',
                  unit: '/ séance · programme 3–6 mois',
                  desc: 'Accompagnement en profondeur avec suivi entre séances, bilan intermédiaire et rapport de progression.',
                  cta: 'Démarrer un programme',
                  highlight: true,
                },
              ].map(({ label, price, unit, desc, cta, highlight }) => (
                <div key={label} className={`rounded-2xl p-7 flex flex-col ${highlight ? 'bg-[#2f6b61] text-white shadow-lg' : 'bg-[#f7f4ef]'}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${highlight ? 'text-emerald-200' : 'text-amber-800'}`}>{label}</p>
                  <p className={`text-3xl font-serif font-semibold mb-0.5 ${highlight ? 'text-white' : 'text-stone-900'}`}>{price}</p>
                  <p className={`text-xs mb-4 ${highlight ? 'text-emerald-200' : 'text-stone-500'}`}>{unit}</p>
                  <p className={`text-sm leading-relaxed flex-1 mb-6 ${highlight ? 'text-emerald-100' : 'text-stone-600'}`}>{desc}</p>
                  <a href="/booking" className={`rounded-full py-2.5 text-center text-sm font-semibold transition ${highlight ? 'bg-white text-[#2f6b61] hover:bg-stone-50' : 'bg-[#2f6b61] text-white hover:bg-[#235249]'}`}>
                    {cta}
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-stone-400">Prise en charge possible via CPF / OPCO selon éligibilité · Devis sur demande pour les programmes entreprises</p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Questions fréquentes</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Ce que vous vous demandez souvent</h2>
            </div>
            {[
              {
                q: "Quelle est la durée d'un accompagnement ?",
                a: "Un programme complet se déroule généralement sur 3 à 6 mois, avec des séances bimensuelles de 60 à 90 minutes. La durée est adaptée à votre objectif et à votre rythme. Il n'y a pas de formule toute faite : chaque parcours commence là où vous en êtes.",
              },
              {
                q: "Comment se passe la première séance ?",
                a: "La première séance est une séance découverte de 30 minutes, offerte et sans engagement. Elle permet de clarifier votre situation, vos attentes et de voir si le coaching — et si nous — c'est pour vous. Pas de programme caché, pas de pression.",
              },
              {
                q: "En quoi le Philosophical Counselling est-il différent du coaching ?",
                a: "Le Philosophical Counselling part des questionnements profonds : le sens, les valeurs, la façon dont vous vous représentez votre situation. Là où le coaching travaille sur des objectifs concrets, le philosophical counselling travaille sur ce qui vous empêche de voir clair — vos cadres de pensée, vos présupposés, vos récits sur vous-même.",
              },
              {
                q: "Le coaching se fait en présentiel ou à distance ?",
                a: "Les deux sont possibles. La majorité des séances se déroulent en visioconférence (Zoom), ce qui offre une grande flexibilité. Des séances en présentiel peuvent être organisées selon votre localisation.",
              },
              {
                q: "Comment annuler ou reporter une séance ?",
                a: "Toute annulation ou report doit être signalé au minimum 48h à l'avance. Au-delà de ce délai, la séance est due. La flexibilité est au cœur de la pratique, dans le respect mutuel.",
              },
              {
                q: "Le coaching est-il pris en charge ?",
                a: "Dans certains cas, le coaching peut être financé via le CPF ou un OPCO dans le cadre d'un plan de développement professionnel. N'hésitez pas à me contacter pour étudier ensemble les options disponibles.",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group border-b border-stone-100 py-5">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-stone-900 hover:text-[#2f6b61] list-none">
                  {q}
                  <span className="ml-4 text-[#2f6b61] transition-transform group-open:rotate-45 text-lg">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{a}</p>
              </details>
            ))}
          </div>
        </section>
        {/* ── LIEN TEMOIGNAGES ── */}
        <div className="bg-[#f7f4ef] py-3 text-center border-t border-stone-100">
          <a href="/temoignages" className="text-sm font-semibold text-[#2f6b61] hover:underline">
            Lire tous les témoignages →
          </a>
        </div>
        <TemoignagesWidget max={3} />

      </main>
      <Footer />
    </>
  )
}
