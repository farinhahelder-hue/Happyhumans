'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  page_title:    'Happiness Design',
  page_subtitle: '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au boulot et ailleurs.',
  intro_text:    "Neurosciences, psychologie positive, philosophie pratique, design thinking — toutes les disciplines au service d'une transformation durable, pour que vous repreniez pleinement les rênes de votre vie.",
}

const STEPS = [
  { n: '01', title: 'Comment ça marche', desc: 'Neurosciences + gratitude' },
  { n: '02', title: 'Audit de sa vie', desc: 'Life Design / Bonheur' },
  { n: '03', title: 'Audit du boulot', desc: 'Design Thinking appliqué à votre vie professionnelle' },
  { n: '04', title: 'Audit des forces', desc: 'Identifier vos ressources et atouts profonds' },
  { n: '05', title: 'Forces pratiquées', desc: 'Via Character Strengths — lesquelles activez-vous vraiment ?' },
  { n: '06', title: "L'échec", desc: 'Changer son rapport à l\'échec — audit des freins' },
  { n: '07', title: 'Audit des freins', desc: 'Syndrome de l\'imposteur · Attachement (TA) · Peurs (fears)' },
  { n: '08', title: 'Homo risibilis', desc: "Imparfait mais impactant — l'action salvatrice" },
  { n: '09', title: 'V1 / V2', desc: 'Qui je suis, qui je veux devenir' },
  { n: '10', title: 'Les 3 métamorphoses', desc: 'Les trois transformations clés de votre parcours' },
  { n: '11', title: "Child's Plan", desc: 'Jalons avec rappels pour ancrer les engagements' },
  { n: '12', title: 'Follow-ups × 4', desc: '4 sessions de suivi pour consolider et ancrer le changement' },
]

export default function HappinessDesignPage() {
  const c = useCmsContent('happiness-design', DEFAULTS)
  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="bg-stone-900 px-6 py-24 md:py-32 md:px-10 text-center relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80&auto=format&fit=crop"
            alt="Lumière dorée symbolisant la transformation et le bonheur"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Programme</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.page_title}</h1>
            <p className="mt-5 text-xl font-serif font-light text-amber-300 md:text-2xl">{c.page_subtitle}</p>
            <p className="mt-7 text-base leading-relaxed text-stone-300 max-w-2xl mx-auto">{c.intro_text}</p>
            <div className="mt-10">
              <Link href="/booking" className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition">
                Séance découverte gratuite (45 min)
              </Link>
            </div>
          </div>
        </section>

        {/* 12 ÉTAPES */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:py-28 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Le programme</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">12 séances, 12 transformations</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="flex gap-5 bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2d5f54] flex items-center justify-center text-white text-xs font-bold">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suivi post-programme */}
            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-sm text-stone-700">
                <strong className="text-[#2d5f54]">+ 4 sessions de suivi</strong> incluses pour ancrer durablement les changements.
              </p>
            </div>
          </div>
        </section>

        {/* À PROPOS DU PROGRAMME */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Programme</p>
            <h2 className="text-2xl font-serif font-light text-stone-900 mb-6 md:text-3xl">Une boîte à outils multidisciplinaire</h2>
            <p className="text-base leading-relaxed text-stone-600 mb-4">
              Ce n&apos;est pas le bonheur qui fait la différence, mais comment on réagit dans l&apos;adversité. Et une seule discipline ne suffit pas.
            </p>
            <p className="text-base leading-relaxed text-stone-600">
              Happiness Design mêle <strong>neurosciences</strong>, <strong>psychologie positive</strong>, <strong>psychologie classique</strong>, <strong>méditation</strong>, <strong>pratique philosophique</strong> et <strong>design thinking</strong> — pour coller au plus près de votre chemin unique.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#2d5f54] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Prêt·e à reprendre les rênes ?</h2>
            <p className="text-sm text-emerald-100 mb-7">Commençons par une séance découverte de 45 min — gratuite et sans engagement.</p>
            <Link href="/booking" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d5f54] hover:bg-amber-50 transition">
              Réserver ma séance découverte →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
