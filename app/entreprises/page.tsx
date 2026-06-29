'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:    '',
  page_title:    "Remettre de l'alignement et de l'élan dans vos équipes.",
  intro_text:    "Coaching de dirigeants, ateliers de cohésion, accompagnement du changement et séminaires sur mesure.",
  section_image: '',
  section_title: 'Ce que nous proposons',
  section_text:  "Quand une équipe perd de sa cohérence, les résultats s'en ressentent toujours.\n\nJe travaille avec les dirigeants et les organisations pour remettre de l'alignement — entre les personnes, entre les objectifs et les moyens, entre ce qu'on dit et ce qu'on fait — ou tout simplement pour rebooster l'engagement et l'élan commun.",
}

export default function EntreprisesPage() {
  const c = useCmsContent('entreprises', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80'}
            alt="Entreprises"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Entreprises</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.page_title}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.intro_text}</p>
          </div>
        </section>

        {/* SECTION PRINCIPALE */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Offres</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.section_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.section_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline mt-2">
                  Discuter de votre projet →
                </Link>
              </div>
              {c.section_image ? (
                <img src={c.section_image} alt={c.section_title} className="rounded-2xl object-cover shadow-lg h-72 w-full" />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop"
                  alt="Réunion d'équipe et leadership en entreprise"
                  className="rounded-2xl object-cover shadow-lg h-72 w-full"
                />
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Un projet ? Une question ?</h2>
            <Link href="/contact" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Prendre contact
            </Link>
          </div>
        </section>

        {/* ── TARIFICATION ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Investissement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Des formules adaptées à votre organisation</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">Chaque engagement est construit sur mesure. Les fourchettes ci-dessous vous donnent un point de repère ; un devis précis est établi après échange.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  label: 'Coaching dirigeant',
                  price: 'À partir de 350 €',
                  unit: '/ séance',
                  desc: 'Accompagnement individuel de dirigeants, managers et hauts potentiels. Programme sur 3 à 6 mois.',
                  items: ['Bilan de départ et objectifs', 'Séances bimensuelles 90 min', 'Disponibilité inter-séances', 'Rapport de progression'],
                  cta: 'Demander un devis',
                  highlight: false,
                },
                {
                  label: 'Programme équipe',
                  price: 'Sur devis',
                  unit: '',
                  desc: 'Ateliers collectifs, séminaires de cohésion et accompagnement du changement pour vos équipes.',
                  items: ['Diagnostic d\'équipe', 'Ateliers sur mesure', 'Coaching de groupe', 'Suivi post-programme'],
                  cta: 'Discutons-en',
                  highlight: true,
                },
                {
                  label: 'Conférence & formation',
                  price: 'À partir de 1 500 €',
                  unit: '/ demi-journée',
                  desc: 'Interventions sur le leadership, la transformation, la qualité de présence et le philosophical counselling.',
                  items: ['Format keynote ou atelier', 'Contenu personnalisé', 'Support de présentation', 'Session Q&R incluse'],
                  cta: 'Voir les thèmes',
                  highlight: false,
                },
              ].map(({ label, price, unit, desc, items, cta, highlight }) => (
                <div key={label} className={`rounded-2xl p-7 flex flex-col ${highlight ? 'bg-[#2f6b61] text-white shadow-lg ring-2 ring-[#2f6b61]' : 'bg-[#f7f4ef] text-stone-900'}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${highlight ? 'text-emerald-200' : 'text-amber-800'}`}>{label}</p>
                  <div className="mb-1">
                    <span className={`text-2xl font-serif font-semibold ${highlight ? 'text-white' : 'text-stone-900'}`}>{price}</span>
                    {unit && <span className={`ml-1 text-xs ${highlight ? 'text-emerald-200' : 'text-stone-500'}`}>{unit}</span>}
                  </div>
                  <p className={`mb-5 text-sm leading-relaxed ${highlight ? 'text-emerald-100' : 'text-stone-600'}`}>{desc}</p>
                  <ul className="mb-6 flex-1 space-y-2">
                    {items.map(item => (
                      <li key={item} className={`flex items-start gap-2 text-xs ${highlight ? 'text-emerald-100' : 'text-stone-600'}`}>
                        <span className="mt-0.5 text-amber-400">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className={`mt-auto rounded-full py-2.5 text-center text-sm font-semibold transition ${highlight ? 'bg-white text-[#2f6b61] hover:bg-stone-50' : 'bg-[#2f6b61] text-white hover:bg-[#235249]'}`}>
                    {cta}
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-stone-400">Prise en charge possible via OPCO selon éligibilité · Devis établi sous 48h</p>
          </div>
        </section>
        {/* TÉMOIGNAGE DOROTHÉE */}
        <section className="bg-[#f7f4ef] py-14 md:py-16">
          <div className="mx-auto max-w-2xl px-6 md:px-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <span className="text-3xl font-serif leading-none text-[#2f6b61] select-none">&ldquo;</span>
              <blockquote lang="fr" className="mt-3 text-base leading-relaxed text-stone-700 italic">
                On a eu un super feedback sur la réunion de présentation que nous avons préparée ensemble.
                Jérôme (le n+1 de ma cliente) nous a dit : &ldquo;Champagne !&rdquo;
              </blockquote>
              <footer className="mt-6">
                <p className="text-sm font-semibold text-stone-900">Dorothée*</p>
                <p className="text-xs text-stone-500 italic mt-0.5">Directrice Achats Beauty Retail</p>
                <p className="text-xs text-stone-400 mt-1">* Prénom modifié</p>
              </footer>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}