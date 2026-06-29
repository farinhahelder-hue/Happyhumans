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
  section_text:  "Quand une équipe perd de sa cohérence, les résultats s'en ressentent toujours.\n\nAvec 10 ans passés à développer des marques internationales pour Henkel, LVMH et L'Oréal — en Allemagne, France, Royaume-Uni et Europe de l'Est — j'ai vécu de l'intérieur les dynamiques de transformation d'équipe, de prise de poste et de communication interculturelle.\n\nAujourd'hui j'apporte cette expérience dans ma pratique de coaching. Je travaille avec les dirigeants et les organisations pour remettre de l'alignement — entre les personnes, entre les objectifs et les moyens, entre ce qu'on dit et ce qu'on fait — ou tout simplement pour rebooster l'engagement et l'élan commun.",
  // Domaines
  domain_1_title: 'Coaching de dirigeants',
  domain_1_text:  'Accompagnement individuel sur 3 à 6 mois. Prise de poste, leadership, transitions, gestion de l\'ambiguïté.',
  domain_2_title: 'Communication interculturelle',
  domain_2_text:  "Décoder les différences de communication au sein d'équipes multiculturelles. Issu de 10 ans d'expérience internationale.",
  domain_3_title: 'Communication interne',
  domain_3_text:  "Construire une communication interne qui engage vraiment. Du sens, pas du bruit. Pour rebooster l'adhésion des équipes.",
  domain_4_title: 'Sparring partner',
  domain_4_text:  "Un regard externe sur vos décisions stratégiques, votre positionnement et votre communication de dirigeant.",
  domain_5_title: "Cohésion d'équipe",
  domain_5_text:  "Ateliers et séminaires sur mesure. Diagnostic d'équipe, identification des blocages, plan de transformation.",
  domain_6_title: "Happiness Design™ en entreprise",
  domain_6_text:  "Remettre du sens et de l'engagement au travail. Programme basé sur les neurosciences, la psychologie positive et la philosophie pratique.",
  // Témoignage Dorothée
  temoignage_dorothee_text:   "On a eu un super feedback sur la réunion de présentation que nous avons préparée ensemble. Jérôme (le n+1 de ma cliente) nous a dit : \"Champagne !\"",
  temoignage_dorothee_author: "Dorothée*",
  temoignage_dorothee_role:   "Directrice Achats Beauty Retail",
  // Tarification
  price_1_label: 'Coaching dirigeant',
  price_1_price: 'À partir de 350 €',
  price_1_unit: '/ séance',
  price_2_label: 'Programme équipe',
  price_2_price: 'Sur devis',
  price_3_label: 'Conférence & formation',
  price_3_price: 'Sur devis',
}

export default function EntreprisesPage() {
  const c = useCmsContent('entreprises', DEFAULTS)

  const domains = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title: c.domain_1_title || 'Coaching de dirigeants',
      text: c.domain_1_text || '',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      title: c.domain_2_title || 'Communication interculturelle',
      text: c.domain_2_text || '',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title: c.domain_3_title || 'Communication interne',
      text: c.domain_3_text || '',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
      title: c.domain_4_title || 'Sparring partner',
      text: c.domain_4_text || '',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title: c.domain_5_title || "Cohésion d'équipe",
      text: c.domain_5_text || '',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
      title: c.domain_6_title || "Happiness Design™ en entreprise",
      text: c.domain_6_text || '',
    },
  ]

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
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.get('page_title')}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.get('intro_text', undefined, { multiline: true })}</p>
          </div>
        </section>

        {/* CE QUE NOUS PROPOSONS */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Offres</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.get('section_title')}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.section_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
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

        {/* DOMAINES D'INTERVENTION */}
        <section className="bg-[#f5f0e8] py-16 md:py-20 px-6 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Expertise</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Domaines d&apos;intervention</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">Une approche ancrée dans la réalité du terrain</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {domains.map(({ icon, title, text }) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#eef5f3] flex items-center justify-center mb-4 flex-shrink-0">
                    {icon}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMME PRISE DE POSTE */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Programme phare</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">Coaching Flash<br />Prise de poste</h2>
                <p className="text-base leading-relaxed text-stone-600">
                  Vous venez de prendre un nouveau poste — ou vous êtes sur le point de le faire. Les 90 premiers jours sont décisifs.
                  Ce programme intensif de 5 séances vous aide à asseoir votre légitimité, définir vos priorités et transformer
                  le syndrome de l&apos;imposteur en carburant.
                </p>
                <ul className="space-y-2 text-sm text-stone-600">
                  {['Clarifier votre vision et vos objectifs 90 jours', 'Identifier vos alliés et cartographier les dynamiques', 'Construire votre posture de leadership', 'Gérer la pression et les attentes sans perdre pied', 'Suivi Notion inclus entre les séances'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#2f6b61] mt-0.5 font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="rounded-xl bg-[#f5f0e8] border border-stone-200 px-4 py-2.5 text-center">
                    <p className="text-xs text-stone-400 uppercase tracking-wider">Format</p>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">5 séances · 60 min</p>
                  </div>
                  <div className="rounded-xl bg-[#f5f0e8] border border-stone-200 px-4 py-2.5 text-center">
                    <p className="text-xs text-stone-400 uppercase tracking-wider">Rythme</p>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">1 séance / 2 semaines</p>
                  </div>
                  <div className="rounded-xl bg-[#2f6b61] border border-[#2f6b61] px-4 py-2.5 text-center">
                    <p className="text-xs text-emerald-200 uppercase tracking-wider">Tarif</p>
                    <p className="text-sm font-semibold text-white mt-0.5">Sur devis</p>
                  </div>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  En savoir plus ou demander un devis →
                </Link>
              </div>
              <div className="rounded-2xl bg-[#f5f0e8] p-8 border border-stone-100">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800 mb-4">Sparring Partner — pour les marketers</p>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">Un regard extérieur stratégique</h3>
                <p className="text-sm leading-relaxed text-stone-600 mb-5">
                  Vous êtes marketer·euse et vous avez besoin d&apos;un interlocuteur de confiance pour tester vos idées, challenger
                  votre stratégie ou vous préparer à une prise de parole importante. Monica, ex-L&apos;Oréal / LVMH, vous offre
                  le recul d&apos;une pair qui connaît vos enjeux.
                </p>
                <ul className="space-y-2 text-sm text-stone-600 mb-6">
                  {['Préparer un pitch ou une présentation', 'Challenger une stratégie marketing', 'Naviguer une transition de poste', 'Communication en environnement multiculturel'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sparring-partner" className="inline-block rounded-full bg-[#2f6b61] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#235249] transition">
                  En savoir plus →
                </Link>
              </div>
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

        {/* TARIFICATION */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Investissement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Des formules adaptées à votre organisation</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">Chaque engagement est construit sur mesure. Les fourchettes ci-dessous vous donnent un point de repère ; un devis précis est établi après échange.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: c.get('price_1_label', 'Coaching dirigeant'), price: c.get('price_1_price', 'À partir de 350 €'), unit: c.get('price_1_unit', '/ séance'), desc: 'Accompagnement individuel de dirigeants, managers et hauts potentiels. Programme sur 3 à 6 mois.', items: ['Bilan de départ et objectifs', 'Séances bimensuelles 90 min', 'Disponibilité inter-séances', 'Rapport de progression'], cta: 'Demander un devis', highlight: false },
                { label: c.get('price_2_label', 'Programme équipe'), price: c.get('price_2_price', 'Sur devis'), unit: '', desc: 'Ateliers collectifs, séminaires de cohésion et accompagnement du changement pour vos équipes.', items: ["Diagnostic d'équipe", 'Ateliers sur mesure', 'Coaching de groupe', 'Suivi post-programme'], cta: 'Discutons-en', highlight: true },
                { label: c.get('price_3_label', 'Conférence & formation'), price: c.get('price_3_price', 'Sur devis'), unit: '', desc: 'Interventions sur le leadership, la transformation, la qualité de présence et le philosophical counselling.', items: ['Format keynote ou atelier', 'Contenu personnalisé', 'Support de présentation', 'Session Q&R incluse'], cta: 'Voir les thèmes', highlight: false },
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
                  <a href="/contact" className={`mt-auto rounded-full py-2.5 text-center text-sm font-semibold transition ${highlight ? 'bg-white text-[#2f6b61] hover:bg-stone-50' : 'bg-[#2f6b61] text-white hover:bg-[#235249]'}`}>{cta}</a>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* POURQUOI MONICA ? */}
        <section className="bg-[#f5f0e8] py-12 md:py-16 px-6 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-white border border-amber-200 p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-3">Différenciation</p>
              <h2 className="text-xl font-serif font-semibold text-stone-900 mb-5 md:text-2xl">
                Pourquoi une coach avec 10 ans en marketing international ?
              </h2>
              <div className="text-base leading-relaxed text-stone-600 space-y-4">
                <p>La plupart des coachs connaissent les outils. Monica connaît aussi la pression d&apos;un lancement produit chez L&apos;Oréal, le management d&apos;équipes à Berlin, Paris et Londres, et les enjeux de communication dans des organisations matricielles complexes.</p>
                <p>Ce n&apos;est pas un avantage anecdotique. C&apos;est ce qui lui permet de comprendre vos enjeux sans que vous ayez à les expliquer — et de proposer des solutions qui collent à la réalité du terrain.</p>
              </div>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                Discuter de votre projet →
              </Link>
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGE DOROTHÉE */}
        <section className="bg-[#f7f4ef] py-14 md:py-16">
          <div className="mx-auto max-w-2xl px-6 md:px-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <span className="text-3xl font-serif leading-none text-[#2f6b61] select-none">&ldquo;</span>
              <blockquote lang="fr" className="mt-3 text-base leading-relaxed text-stone-700 italic">
                {c.get('temoignage_dorothee_text', undefined, { multiline: true })}
              </blockquote>
              <footer className="mt-6">
                <p className="text-sm font-semibold text-stone-900">{c.get('temoignage_dorothee_author')}</p>
                <p className="text-xs text-stone-500 italic mt-0.5">{c.get('temoignage_dorothee_role')}</p>
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
