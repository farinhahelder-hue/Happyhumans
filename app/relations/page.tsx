'use client';
import Link from 'next/link';
import StayInTouchForm from '@/components/StayInTouchForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCmsContent } from '@/hooks/useCmsContent';

const DEFAULTS = {
  hero_image:   '',
  page_title:   'Des relations saines et épanouissantes',
  intro_text:   "Explorez des ressources, découvrez votre style d'attachement et réservez votre séance offerte pour identifier vos 3 actions clés.",
  cta_title:    'Vos 3 actions vers des relations plus épanouissantes',
  cta_subtitle: "Lors d'une séance offerte de 45 minutes, Monica vous accompagne pour identifier les 3 actions concrètes les plus impactantes pour transformer vos relations dès maintenant.",
};

const QR_TARGET = 'https://happy-humans.org/relations';

const RESOURCES = [
  { emoji: '📖', title: "Les 4 styles d'attachement",       description: "Comprendre comment votre histoire façonne votre façon d'aimer et de vous relier aux autres." },
  { emoji: '💬', title: 'Communication non-violente',        description: "Des outils concrets pour exprimer vos besoins et écouter ceux de l'autre sans vous perdre." },
  { emoji: '🪞', title: "La relation à soi d'abord",         description: 'Pourquoi la qualité de vos relations extérieures commence toujours par la relation que vous avez avec vous-même.' },
  { emoji: '🌱', title: 'Réparer et faire confiance à nouveau', description: 'Après une rupture, un conflit ou une trahison — des pistes pour rouvrir son cœur en toute sécurité.' },
  { emoji: '🤝', title: 'Poser des limites avec douceur',    description: "Dire non sans se sentir coupable : l'art de défendre son espace émotionnel tout en restant ouvert." },
  { emoji: '✨', title: 'Cultiver la sécurité intérieure',   description: 'Développer un ancrage stable pour ne plus dépendre de la validation des autres pour se sentir bien.' },
];

const STEPS = [
  { number: '01', title: 'Faites le test',       description: "Identifiez votre style d'attachement en 16 questions (5 min, gratuit)." },
  { number: '02', title: 'Recevez vos 3 actions', description: 'Monica vous identifie 3 actions concrètes et personnalisées vers des relations plus épanouissantes.' },
  { number: '03', title: "Passez à l'action",     description: 'Repartez avec un plan clair, des outils pratiques et la clarté pour transformer vos relations dès maintenant.' },
];

export default function RelationsPage() {
  const c = useCmsContent('relations', DEFAULTS);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F8F6F2', color: '#2C2C2C' }}>
      <Header />

      {/* ── HERO ── */}
      <section
        className="relative px-4 py-20 md:py-32 text-center overflow-hidden"
        style={{ background: c.hero_image ? 'none' : 'linear-gradient(160deg, #fdf6ee 0%, #f5e8f5 50%, #ede8fa 100%)' }}
      >
        {c.hero_image && (
          <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            style={{ background: 'rgba(168,100,160,0.12)', color: '#7c3d8f', border: '1px solid rgba(168,100,160,0.25)' }}>
            Ressources & accompagnement
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            {c.page_title}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#555' }}>
            {c.intro_text}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#seance-offerte" className="px-8 py-4 font-semibold rounded-2xl text-base transition-all shadow-lg"
              style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
              Réserver ma séance offerte →
            </a>
            <a href="#test-attachement" className="px-8 py-4 font-medium rounded-2xl text-base transition-all"
              style={{ background: 'rgba(168,100,160,0.1)', color: '#7c3d8f', border: '1px solid rgba(168,100,160,0.25)' }}>
              🪢 Faire le test gratuit
            </a>
          </div>
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
            <p className="text-sm leading-relaxed text-stone-600 max-w-2xl mx-auto">
              Cette page vous propose des ressources gratuites et un premier espace d&apos;exploration. Pour aller plus loin, le coaching individuel ou les séances de Philosophical Counselling avec Monica offrent un accompagnement personnalisé et en profondeur.
            </p>
            <a href="/coaching" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
              Découvrir le coaching individuel →
            </a>
          </div>
        </section>

        {/* ── RESSOURCES ── */}
      <section className="px-4 py-20 md:py-24" id="ressources">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#a864a0' }}>Ressources</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
              Comprendre pour transformer
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#666' }}>
              Des clés concrètes pour nourrir vos relations — avec les autres, et avec vous-même.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((r) => (
              <div key={r.title} className="rounded-2xl p-6 transition-all hover:shadow-md"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="text-3xl mb-4">{r.emoji}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>{r.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#666' }}>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEST ATTACHEMENT ── */}
      <section id="test-attachement" className="px-4 py-20 md:py-24"
        style={{ background: 'linear-gradient(135deg, #f5e8f5 0%, #ede8fa 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#a864a0' }}>Test gratuit</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
                Quel est votre style d'attachement ?
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: '#555' }}>
                En 16 questions et 5 minutes, découvrez comment votre style d'attachement influence vos relations amoureuses, amicales et professionnelles.
              </p>
              <ul className="space-y-3 mb-8">
                {['16 questions douces et bienveillantes', 'Résultats détaillés avec pistes de travail', 'Gratuit, sans inscription'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#444' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#a864a0', color: '#fff' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/test-attachement" className="inline-flex px-8 py-4 font-semibold rounded-2xl text-base transition-all"
                style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
                Faire le test maintenant →
              </Link>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-3xl p-6 shadow-xl" style={{ background: '#fff' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(QR_TARGET)}&margin=0&color=7c3d8f`}
                  alt="QR code Happy Humans" width={220} height={220} className="rounded-xl" />
              </div>
              <p className="text-sm text-center" style={{ color: '#888' }}>Scannez pour partager cette page</p>
              <a href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(QR_TARGET)}&margin=20&color=7c3d8f`}
                download="qr-happy-humans-relations.png" target="_blank" rel="noopener noreferrer"
                className="text-sm underline underline-offset-2" style={{ color: '#a864a0' }}>
                ↓ Télécharger le QR code HD
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SÉANCE OFFERTE ── */}
      <section id="seance-offerte" className="px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#a864a0' }}>Offre gratuite</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
              {c.cta_title}
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed" style={{ color: '#666' }}>{c.cta_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {STEPS.map((s) => (
              <div key={s.number} className="rounded-2xl p-7 text-center" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="text-3xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(168,100,160,0.2)' }}>{s.number}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#666' }}>{s.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl p-8 md:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #7c3d8f 0%, #a864a0 100%)', boxShadow: '0 20px 60px rgba(124,61,143,0.3)' }}>
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Réservez votre séance offerte
            </h3>
            <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
              45 minutes avec Monica Schneider. Gratuit, sans engagement. Repartez avec 3 actions concrètes et personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/planifier" className="px-8 py-4 font-semibold rounded-2xl text-base transition-all"
                style={{ background: '#fff', color: '#7c3d8f', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                Choisir mon créneau →
              </Link>
              <Link href="/contact" className="px-8 py-4 font-medium rounded-2xl text-base transition-all"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                Me contacter d'abord
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAY IN TOUCH ── */}
      <StayInTouchForm />

      <Footer />
    </main>
  );
}
