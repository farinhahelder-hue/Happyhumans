'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:   '',
  page_title:   'Des relations saines et épanouissantes',
  intro_text:   "Explorez des ressources, découvrez votre style d'attachement et réservez votre séance offerte pour identifier vos 3 actions clés.",
  cta_title:    'Une séance offerte pour commencer',
  cta_subtitle: "Un espace d'écoute et d'exploration, sans engagement.",
}

const STEPS = [
  { number: '01', title: 'Faites le test',     desc: "Identifiez votre style d'attachement en 16 questions — 5 min, gratuit." },
  { number: '02', title: 'Session découverte', desc: "Monica vous identifie 3 actions concrètes et personnalisées vers des relations plus épanouissantes." },
  { number: '03', title: "Passez à l'action",  desc: "Repartez avec un plan clair, des outils pratiques et la clarté pour transformer vos relations." },
]

const RESOURCES = [
  {
    id: 'attached',
    emoji: '📖',
    title: 'ATTACHED',
    subtitle: "Comprendre son style d'attachement",
    content: (
      <div className="space-y-5 text-sm leading-relaxed text-stone-600">
        <p>Le livre <em>ATTACHED</em> applique la théorie de l'attachement, développée par John Bowlby et Mary Ainsworth, aux relations amoureuses adultes. Les auteurs montrent que la façon dont nous nous lions à un partenaire suit des schémas précis, déterminés par notre histoire émotionnelle précoce.</p>
        <p>Ils identifient <strong className="text-stone-800">trois styles principaux</strong> : sécure, anxieux et évitant.</p>
        <ul className="space-y-3 pl-4 border-l-2 border-[#2f6b61]">
          <li><strong className="text-stone-800">Style sécure :</strong> permet une intimité confiante et stable.</li>
          <li><strong className="text-stone-800">Style anxieux :</strong> génère une peur constante de l'abandon, un besoin de réassurance et une hypervigilance aux signaux de l'autre.</li>
          <li><strong className="text-stone-800">Style évitant :</strong> pousse à fuir la proximité, à valoriser l'indépendance à l'excès et à se sentir "étouffé" dès que la relation devient sérieuse.</li>
        </ul>
        <div className="rounded-xl bg-[#f7f4ef] p-5">
          <h4 className="mb-3 font-semibold text-stone-800">Comment ces styles se forment dans l'enfance</h4>
          <p className="mb-2">Selon Bowlby, le nourrisson a un besoin biologique de proximité avec une figure d'attachement. La façon dont ce parent répond façonne un modèle inconscient de ce à quoi s'attendre des relations.</p>
          <p><em className="text-stone-500">Ces modèles, formés avant l'âge de deux ans, continuent à orienter inconsciemment nos relations adultes.</em></p>
        </div>
      </div>
    ),
  },
  {
    id: 'rogers',
    emoji: '🪞',
    title: 'Carl Rogers',
    subtitle: "Déconstruire l'amour conditionnel pour enfin s'aimer",
    content: (
      <div className="space-y-5 text-sm leading-relaxed text-stone-600">
        <p>L'idée de Carl Rogers repose sur son concept de « regard positif inconditionnel » — accepter une autre personne pleinement, sans jugement ni condition, telle qu'elle est. Son intuition était que nous ne pouvons offrir ce type de regard à quelqu'un d'autre que dans la mesure où nous avons appris à nous l'offrir à nous-mêmes.</p>
        <p>Rogers pensait que la plupart d'entre nous grandissons en intériorisant une acceptation conditionnelle : un amour qui dépendait du fait d'être gentil, performant, séduisant ou conciliant.</p>
        <p>Pour Rogers, une vraie intimité exige la <strong className="text-stone-800">congruence</strong> : être authentique plutôt que de jouer un rôle. Et la congruence n'est possible qu'une fois que l'on a fait la paix avec l'étendue entière de qui l'on est.</p>
        <div className="rounded-xl bg-[#f7f4ef] p-5">
          <h4 className="mb-3 font-semibold text-stone-800">Comment faire la paix avec soi-même selon Rogers</h4>
          <ul className="space-y-2 pl-4 border-l-2 border-[#2f6b61]">
            <li><strong className="text-stone-800">Abandonner les « conditions de valeur »</strong> — Distinguez qui vous êtes réellement de qui vous avez appris que vous aviez le droit d'être.</li>
            <li><strong className="text-stone-800">Faire confiance à son expérience</strong> — Rogers appelait cela le « processus d'évaluation organismique » : vos ressentis sont des données valides.</li>
            <li><strong className="text-stone-800">Pratiquer l'auto-compassion</strong> — Traitez vos propres erreurs avec la même douceur que vous offririez à un ami cher.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'fromm',
    emoji: '💝',
    title: 'Erich Fromm',
    subtitle: "L'art d'aimer : amour immature vs amour mature",
    content: (
      <div className="space-y-5 text-sm leading-relaxed text-stone-600">
        <p>Dans <em>L'art d'aimer</em>, Erich Fromm soutient que l'amour n'est pas un sentiment qui arrive passivement — c'est une pratique active qui s'apprend et se cultive, comme n'importe quel art.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-stone-100 p-4">
            <h4 className="mb-2 font-semibold text-stone-800">Amour immature</h4>
            <p className="text-xs text-stone-600">"J'aime parce que j'ai besoin de toi." Dépendance, fusion, peur de la perte. L'autre comble un vide.</p>
          </div>
          <div className="rounded-xl bg-[#eef4f3] p-4">
            <h4 className="mb-2 font-semibold text-[#2f6b61]">Amour mature</h4>
            <p className="text-xs text-stone-600">"J'ai besoin de toi parce que je t'aime." Choix libre, deux individualités entières qui se rejoignent.</p>
          </div>
        </div>
        <div className="rounded-xl bg-[#f7f4ef] p-5">
          <h4 className="mb-3 font-semibold text-stone-800">Les 4 éléments de l'amour selon Fromm</h4>
          <ul className="space-y-2 pl-4 border-l-2 border-[#2f6b61]">
            <li><strong className="text-stone-800">Connaissance</strong> — voir l'autre tel qu'il est vraiment, pas tel qu'on le projette.</li>
            <li><strong className="text-stone-800">Soin</strong> — s'investir activement dans le bien-être de l'autre.</li>
            <li><strong className="text-stone-800">Respect</strong> — permettre à l'autre de grandir selon sa propre nature.</li>
            <li><strong className="text-stone-800">Responsabilité</strong> — répondre aux besoins de l'autre comme à un acte délibéré.</li>
          </ul>
        </div>
      </div>
    ),
  },
]

const EXERCICES_REFLEXION = [
  "Quels sont les schémas d'attachement que j'ai intériorisés dans mon enfance ?",
  "Quelles « conditions de valeur » est-ce que je me fixe pour me sentir acceptable ?",
  "Dans quelles situations est-ce que je me retrouve à jouer un rôle plutôt qu'à être moi-même ?",
  "Qu'est-ce que j'attends inconsciemment de mes relations que je n'arrive pas à m'offrir moi-même ?",
]

export default function RelationsPage() {
  const c = useCmsContent('relations', DEFAULTS)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const activeResource = RESOURCES.find(r => r.id === activeModal)

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative flex h-[45vh] items-end overflow-hidden bg-stone-900">
          {c.hero_image && <img src={c.hero_image} alt="Photo de fond" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
          <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 md:px-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Relations</p>
            <h1 className="text-4xl font-serif font-light text-white md:text-5xl">{c.page_title}</h1>
            <p className="mt-4 max-w-xl text-base text-stone-300">{c.intro_text}</p>
          </div>
        </section>

        {/* ── ANCRAGE PHILOSOPHIQUE ── */}
        <section className="bg-white py-14 md:py-16">
          <div className="mx-auto max-w-3xl px-6 md:px-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Une approche ancrée dans la philosophie</p>
            <h2 className="mb-5 text-2xl font-serif font-light leading-tight text-stone-900 md:text-3xl">
              Les relations comme terrain d&apos;exploration de soi
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-stone-600 max-w-2xl mx-auto">
              Le Philosophical Counselling — l&apos;une des pratiques au cœur de l&apos;accompagnement Happy Humans — considère les difficultés relationnelles non comme des défaillances, mais comme des invitations à mieux se connaître. Nos schémas d&apos;attachement, nos attentes implicites, nos croyances sur l&apos;autre : tout cela se révèle dans la relation.
            </p>
            <a href="/coaching" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
              Découvrir le coaching individuel →
            </a>
          </div>
        </section>

        {/* ── VOS 3 ACTIONS ── */}
        <section className="bg-[#f7f4ef] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Votre parcours</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Vos 3 actions vers des relations plus épanouissantes</h2>
              <p className="mt-3 max-w-xl mx-auto text-sm text-stone-500">{c.cta_subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map(({ number, title, desc }) => (
                <div key={number} className="rounded-2xl bg-white p-7 shadow-sm">
                  <p className="mb-3 text-3xl font-serif font-light text-[#2f6b61] opacity-40">{number}</p>
                  <h3 className="mb-2 font-semibold text-stone-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a href="/booking" className="inline-block rounded-full bg-[#2f6b61] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#235249]">
                Réserver ma séance offerte
              </a>
            </div>
          </div>
        </section>

        {/* ── RESSOURCES / CARTES MODALES ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Pour aller plus loin</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">3 références qui éclairent les relations</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {RESOURCES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActiveModal(r.id)}
                  className="group rounded-2xl bg-[#f7f4ef] p-7 text-left transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="mb-4 text-3xl">{r.emoji}</div>
                  <h3 className="mb-1 font-semibold text-stone-900 group-hover:text-[#2f6b61] transition">{r.title}</h3>
                  <p className="text-sm text-stone-500">{r.subtitle}</p>
                  <p className="mt-4 text-xs font-semibold text-[#2f6b61]">Lire la synthèse →</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXERCICES ── */}
        <section className="bg-[#f7f4ef] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Pratique</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Questions de réflexion</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {EXERCICES_REFLEXION.map((q, i) => (
                <div key={i} className="rounded-2xl bg-white p-6">
                  <p className="mb-2 text-xs font-bold text-[#2f6b61] opacity-50">{String(i + 1).padStart(2, '0')}</p>
                  <p className="text-sm leading-relaxed text-stone-700 italic">&ldquo;{q}&rdquo;</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
              {[
                { emoji: '🚶', title: 'Marcher sans destination', desc: 'Une promenade consciente pour contacter vos sensations.' },
                { emoji: '💕', title: "S'emmener à des dates", desc: 'Passez du temps avec vous-même comme avec quelqu'un que vous aimez.' },
                { emoji: '✨', title: 'Faire ce qu'on a envie', desc: 'Pleurer, rire, demander de l'aide — faites-le quand même.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-2xl bg-white p-6">
                  <div className="mb-3 text-2xl">{emoji}</div>
                  <h4 className="mb-2 text-sm font-semibold text-stone-900">{title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEST ATTACHEMENT ── */}
        <section className="bg-white py-16 md:py-20" id="test-attachement">
          <div className="mx-auto max-w-3xl px-6 md:px-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Test gratuit</p>
            <h2 className="mb-4 text-2xl font-serif font-light text-stone-900 md:text-3xl">Quel est votre style d&apos;attachement ?</h2>
            <p className="mb-8 text-sm leading-relaxed text-stone-600 max-w-xl mx-auto">
              16 questions · 5 minutes · Résultat immédiat. Découvrez si vous êtes sécure, anxieux ou évitant — et ce que cela change dans vos relations.
            </p>
            <a href="/contact?type=relations" className="inline-block rounded-full bg-[#2f6b61] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#235249]">
              Faire le test
            </a>
          </div>
        </section>

        {/* ── SÉANCE OFFERTE CTA ── */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">{c.cta_title}</h2>
            <p className="mb-7 text-sm text-emerald-100">{c.cta_subtitle}</p>
            <a href="/booking" className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] shadow hover:bg-stone-50">
              Réserver une séance offerte
            </a>
          </div>
        </section>
      </main>

      {/* ── MODAL ── */}
      {activeModal && activeResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              ✕
            </button>
            <div className="mb-6">
              <div className="mb-3 text-3xl">{activeResource.emoji}</div>
              <h2 className="text-xl font-semibold text-stone-900">{activeResource.title}</h2>
              <p className="text-sm text-stone-500">{activeResource.subtitle}</p>
            </div>
            {activeResource.content}
            <div className="mt-8 border-t border-stone-100 pt-6 text-center">
              <p className="mb-3 text-sm text-stone-600">Envie d&apos;explorer ces questions avec Monica ?</p>
              <a href="/booking" className="inline-block rounded-full bg-[#2f6b61] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#235249]">
                Réserver une séance offerte
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
