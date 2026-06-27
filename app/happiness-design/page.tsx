'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  page_title:    'Happiness Design',
  page_subtitle: '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au booze et ailleurs.',
  intro_text:    "Un programme multidisciplinaire qui mêle neurosciences, psychologie positive, philosophie pratique et design thinking — pour reprendre les rênes de votre bonheur au booze et ailleurs.",
}

const STEPS = [
  { n: '1', title: 'Comment ça marche', desc: 'Neurosciences + gratitude' },
  { n: '2', title: 'Audit de sa vie', desc: 'Life Design / Bonheur' },
  { n: '3', title: 'Audit du booze', desc: 'Design Thinking' },
  { n: '4', title: 'Audit des forces', desc: '' },
  { n: '5', title: 'Forces pratiquées', desc: 'Via Character Strengths' },
  { n: '6', title: 'Échec', desc: 'Changer son rapport à l\'échec' },
  { n: '7', title: 'Audit des freins', desc: 'Syndrome de l\'imposteur · Attachement (TA) · Fears' },
  { n: '8', title: 'Homo risibilis', desc: 'Imparfait mais impactant / l\'action salvatrice' },
  { n: '9', title: 'V1 / V2', desc: 'Qui je suis, qui je veux devenir' },
  { n: '10', title: '3 métamorphoses', desc: '' },
  { n: '11', title: "Child's Plan", desc: 'Jalons avec rappels' },
  { n: '12', title: 'Follow-ups × 4', desc: 'Suivi et ancrage' },
]

export default function HappinessDesignPage() {
  const c = useCmsContent('happiness-design', DEFAULTS)
  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="bg-stone-900 px-6 py-20 md:py-32 md:px-10 text-center relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80&auto=format&fit=crop"
            alt="Lumière dorée symbolisant la transformation et le bonheur"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Programme unique</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.page_title}</h1>
            <p className="mt-5 text-xl font-serif font-light text-amber-300 md:text-2xl">12 séances pour reprendre les rênes de votre vie et de votre bonheur — au booze et ailleurs.</p>
            <p className="mt-7 text-base leading-relaxed text-stone-300 max-w-2xl mx-auto">{c.intro_text}</p>
            <div className="mt-10">
              <Link href="/booking" className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition">
                Séance découverte gratuite (45 min)
              </Link>
            </div>
          </div>
        </section>

        {/* LE PROGRAMME EN DÉTAIL */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:py-28 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Le programme en détail</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">12 étapes vers votre transformation</h2>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-[#2d5f54]/20 transform md:-translate-x-1/2" />
              <div className="space-y-8">
                {STEPS.map(({ n, title, desc }, index) => (
                  <div key={n} className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 md:text-right">
                      {index % 2 === 0 && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm ml-10 md:ml-0">
                          <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
                          {desc && <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>}
                        </div>
                      )}
                    </div>
                    <div className="absolute left-5 md:left-1/2 w-10 h-10 rounded-full bg-[#2d5f54] flex items-center justify-center text-white text-sm font-bold transform md:-translate-x-1/2 z-10">
                      {n}
                    </div>
                    <div className="flex-1 md:text-left">
                      {index % 2 !== 0 && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm ml-10 md:ml-0">
                          <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
                          {desc && <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-ups note */}
            <div className="mt-12 rounded-2xl bg-[#2d5f54] p-6 text-center">
              <p className="text-white text-sm">
                <strong>+ 4 sessions de suivi</strong> pour ancrer durablement les changements
              </p>
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Tarifs</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Programme Happiness Design</h2>
            </div>
            <div className="bg-[#f5f0e8] rounded-2xl p-8 text-center border border-amber-200">
              <p className="text-3xl font-serif font-semibold text-stone-900 mb-2">12 séances</p>
              <p className="text-lg text-stone-600 mb-4">Programme complet</p>
              <p className="text-amber-600 font-semibold">Sur devis — <span className="font-normal text-stone-500">nous contacter</span></p>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#2f6b61] px-7 py-3 text-sm font-semibold text-white hover:bg-[#235249] transition">
                  Nous contacter →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* À PROPOS DU PROGRAMME */}
        <section className="bg-[#f5f0e8] px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Pourquoi ce programme ?</p>
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
