'use client';
import { useState, useRef } from 'react';
import BookingWidget from '@/components/BookingWidget';
import { AttachmentTest } from '@/components/attachment-test/AttachmentTest';
import Header from '@/components/Header';
import Image from 'next/image';

const SOURCES = [
  {
    id: 'attached',
    emoji: '📖',
    title: 'ATTACHED',
    subtitle: "Comprendre son style d'attachement",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <p>Le livre ATTACHED applique la théorie de l'attachement, développée à l'origine par John Bowlby et Mary Ainsworth, aux relations amoureuses adultes. Les auteurs montrent que la façon dont nous nous lions à un partenaire suit des schémas précis, déterminés par notre histoire émotionnelle précoce. Ils identifient <strong>trois styles principaux</strong> : sécure, anxieux et évitant.</p>
        <p>Le style sécure permet une intimité confiante et stable.</p>
        <p>Le style anxieux génère une peur constante de l'abandon, un besoin de réassurance et une hypervigilance aux signaux de l'autre.</p>
        <p>Le style évitant pousse à fuir la proximité, à valoriser l'indépendance à l'excès et à se sentir « étouffé » dès que la relation devient sérieuse.</p>
        <p>Le livre propose des tests pour identifier son propre style, ainsi que celui de son partenaire, et des stratégies concrètes pour mieux communiquer ses besoins.</p>
        <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(168,100,160,0.08)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#2d5f54' }}>Comment ces styles se forment dans l'enfance</h4>
          <div className="space-y-4" style={{ color: '#555' }}>
            <p>Selon Bowlby, le nourrisson a un besoin biologique de proximité avec une figure d'attachement (généralement un parent) pour assurer sa survie. La façon dont ce parent répond — de manière cohérente et sensible, ou au contraire imprévisible, distante, voire intrusive — façonne un modèle inconscient de ce à quoi s'attendre des relations.</p>
            <p>Si le parent est globalement disponible et réconfortant, l'enfant développe un <strong>attachement sécure</strong> : il apprend que ses besoins seront entendus.</p>
            <p>Si les réponses du parent sont incohérentes — parfois chaleureuses, parfois absentes — l'enfant développe un <strong>attachement anxieux</strong> : il apprend à surveiller constamment la disponibilité de l'autre, sans jamais se sentir pleinement rassuré.</p>
            <p>Si le parent est régulièrement distant, peu expressif émotionnellement, ou rejette les demandes de proximité, l'enfant développe un <strong>attachement évitant</strong> : il apprend à minimiser ses propres besoins pour éviter la déception, et à compter avant tout sur lui-même.</p>
            <p className="mt-4" style={{ fontStyle: 'italic' }}>Ces modèles, formés avant l'âge de deux ans, continuent ensuite à orienter inconsciemment nos relations adultes.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'rogers',
    emoji: '🪞',
    title: 'Carl Rogers',
    subtitle: "Déconstruire l\'amour conditionnel pour enfin s'aimer",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54' }}>Le concept de Carl Rogers sur l'amour inconditionnel</h4>
          <div className="space-y-4">
            <p>L'idée de Carl Rogers repose sur son concept de « regard positif inconditionnel » — accepter une autre personne pleinement, sans jugement ni condition, telle qu'elle est. Son intuition était que nous ne pouvons offrir ce type de regard à quelqu'un d'autre que dans la mesure où nous avons appris à nous l'offrir à nous-mêmes.</p>
            <p>Rogers pensait que la plupart d'entre nous grandissons en intériorisant une acceptation conditionnelle : un amour qui dépendait du fait d'être gentil, performant, séduisant ou conciliant. Avec le temps, nous construisons un « concept de soi » façonné par ce que nous pensons avoir le droit d'être, et nous cachons ou rejetons les parts de nous-mêmes qui n'ont pas obtenu l'approbation — la colère, le besoin affectif, la peur, l'ambition, la sexualité.</p>
            <p>Le problème, c'est que lorsque nous n'avons pas accepté ces parts en nous-mêmes, nous ne pouvons inconsciemment pas les tolérer chez un partenaire non plus. Nous devenons anxieux, contrôlants ou critiques quand notre partenaire montre les qualités mêmes que nous avons réprimées en nous. Nous avons aussi du mal à croire que nous sommes véritablement aimés, car nous ne croyons pas être acceptables tels que nous sommes — alors nous jouons un rôle, nous cherchons à plaire, ou nous restons sur nos gardes.</p>
            <p>Pour Rogers, une vraie intimité exige la <strong>congruence</strong> : être authentique plutôt que de jouer un rôle. Et la congruence n'est possible qu'une fois que l'on a fait la paix avec l'étendue entière de qui l'on est — pas la version épurée et « acceptable ».</p>
          </div>
        </div>
        <div className="p-6 rounded-xl" style={{ background: 'rgba(168,100,160,0.06)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#2d5f54' }}>Comment faire la paix avec soi-même selon Rogers</h4>
          <div className="space-y-4" style={{ color: '#555' }}>
            <p>Rogers ne voyait pas cela comme une technique unique, mais comme un processus continu qu'il appelait devenir une « personne pleinement fonctionnelle ». Quelques éléments centraux :</p>
            <p><strong>Abandonner les « conditions de valeur »</strong>. Remarquez les règles intérieures que vous avez intériorisées — « je ne suis acceptable que si je suis calme, généreuse, performante, facile à vivre ». Rogers voulait que les personnes distinguent qui elles sont réellement de qui elles ont appris qu'elles avaient le droit d'être. Cela commence simplement par remarquer quand on joue un rôle plutôt que de ressentir.</p>
            <p><strong>Faire confiance à sa propre expérience</strong> plus qu'au jugement extérieur. Rogers appelait cela le « processus d'évaluation organismique » — ce sens intérieur de ce qui est vrai ou nécessaire pour soi, avant de le filtrer à travers ce que les autres attendent. La plupart des gens ignorent constamment ce sens. Le retrouver, c'est se demander « que ressens-je ou que veux-je vraiment ici ? » plutôt que « que devrais-je ressentir ? ».</p>
            <p><strong>Pratiquer le regard positif inconditionnel envers soi-même</strong>. La même chaleur et la même absence de jugement que Rogers demandait aux thérapeutes d'offrir à leurs patients, il pensait que chacun devait apprendre à se les offrir — en particulier envers les parts que l'on juge honteuses : la colère, l'envie, le besoin affectif, le désir.</p>
            <p><strong>Chercher des environnements où l'on peut être congruent</strong>. Rogers pensait que cette acceptation de soi se développe souvent par la relation — être pleinement vu par une autre personne accueillante (thérapeute, ami proche) nous apprend, par l'expérience, que les parts jugées inacceptables sont supportables, et même aimables.</p>
            <p className="mt-4" style={{ fontStyle: 'italic' }}>C'est moins une liste de tâches qu'une pratique d'honnêteté envers soi-même, répétée dans le temps.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'fromm',
    emoji: '💝',
    title: 'Erich Fromm',
    subtitle: "Se préparer à l\'amour mature",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <p>Erich Fromm, dans <em>L'art d'aimer</em>, soutenait que la plupart des gens comprennent mal l'amour, le percevant comme quelque chose dans lequel on « tombe » plutôt que comme quelque chose que l'on pratique. Il distinguait l'amour immature de l'amour mature.</p>
        <div className="p-5 rounded-xl border-l-4" style={{ background: '#fff', borderColor: '#dc2626' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#dc2626' }}>Amour immature</h4>
          <p className="italic mb-2">« Je t'aime parce que j'ai besoin de toi. »</p>
          <p className="text-sm">Il est enraciné dans la dépendance — vous aimez quelqu'un parce qu'il comble un vide, apaise votre solitude, ou renforce votre estime de vous-même. Fromm y voyait une forme de fusion, où deux personnes se mêlent pour échapper à l'angoisse d'être des individus séparés. Cela ressemble souvent à quelque chose d'intense et de passionné, mais c'est fragile, possessif, et peut rapidement se transformer en ressentiment dès que l'autre cesse de répondre à vos besoins.</p>
        </div>
        <div className="p-5 rounded-xl border-l-4" style={{ background: '#fff', borderColor: '#166534' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#166534' }}>Amour mature</h4>
          <p className="italic mb-2">« J'ai besoin de toi parce que je t'aime. »</p>
          <p className="text-sm">Ici, l'amour est une capacité active — fondée sur le soin, la responsabilité, le respect et une connaissance véritable de l'autre. Fromm pensait, et c'est essentiel, que l'amour mature exige d'avoir déjà un sens de soi solide et sécure. Deux individus entiers se choisissent l'un l'autre, plutôt que deux personnes incomplètes essayant de devenir complètes par la fusion.</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'rgba(168,100,160,0.08)' }}>
          <p><strong>Pour Fromm,</strong> c'est pourquoi « trouver la bonne personne » importe moins que devenir une personne capable d'un amour mature — car l'amour immature reproduit les mêmes schémas, quel que soit le partenaire.</p>
        </div>
      </div>
    ),
  },
];

const ATTACHMENT_STYLES = [
  {
    id: 'secure',
    emoji: '🌿',
    label: 'Sécure',
    percent: '55–60 %',
    color: '#2d5f54',
    bg: 'rgba(45,95,84,0.07)',
    desc: 'À l\'aise avec l\'intimité et l\'indépendance. Communique ses besoins clairement et gère les conflits de façon constructive. Représente la base sécure vers laquelle tendre.',
  },
  {
    id: 'anxious',
    emoji: '🌊',
    label: 'Anxieux',
    percent: '~20 %',
    color: '#b45309',
    bg: 'rgba(180,83,9,0.07)',
    desc: 'Peur du rejet et de l\'abandon. Grand besoin de validation et de proximité. Tend à suranalyser les silences et les distances de l\'autre.',
  },
  {
    id: 'avoidant',
    emoji: '🌬️',
    label: 'Évitant',
    percent: '~25 %',
    color: '#64748b',
    bg: 'rgba(100,116,139,0.07)',
    desc: 'A appris à minimiser ses besoins émotionnels pour se protéger. Valorise l\'indépendance et peut se sentir étouffé·e quand l\'intimité s\'intensifie.',
  },
  {
    id: 'disorganized',
    emoji: '⚡',
    label: 'Désorganisé',
    percent: '~5 %',
    color: '#78716c',
    bg: 'rgba(120,113,108,0.07)',
    desc: 'Conflit interne entre le besoin désespéré de proximité et la peur panique de l\'autre. Souvent lié à des expériences d\'enfance complexes ou traumatiques.',
  },
];

const COMM_RULES = [
  {
    icon: '🎯',
    title: 'Spécifique',
    desc: 'Nommez un comportement précis plutôt qu\'une généralité blessante.',
    example: '« Quand tu ne m\'envoies pas de message après une soirée... » au lieu de « Tu te fiches de moi ».',
  },
  {
    icon: '💚',
    title: 'Non culpabilisant',
    desc: 'Exprimez votre ressenti sans attaquer, juger ou blâmer l\'autre.',
    example: '« Je me sens seul·e » plutôt que « Tu me rends seul·e ».',
  },
  {
    icon: '🦁',
    title: 'Assertif',
    desc: 'Assumez la légitimité de vos besoins — surtout si vous avez un profil anxieux qui craint d\'être « trop ».',
    example: '« J\'ai besoin de réassurance, c\'est un besoin valide » non pas une faiblesse.',
  },
];

const STEPS = [
  { num: '01', title: 'Faites le test', desc: '16 questions · 3 à 5 minutes · Résultat immédiat' },
  { num: '02', title: 'Session découverte', desc: 'Séance offerte de 45 min pour découvrir vos 3 actions' },
  { num: '03', title: 'Passez à l\'action', desc: 'Un plan clair et des outils pour des relations épanouissantes' },
];

import { useCmsContent } from '@/hooks/useCmsContent';

const DEFAULTS_RELATIONS = {
  hero_badge:          'Relations & Attachement',
  hero_title:          'Quel est votre style d\'attachement ?',
  hero_description:    'Un outil de découverte douce pour mieux comprendre comment vous vous connectez aux autres.',
  quiz_pill_1:         '⏱ 3 à 5 minutes',
  quiz_pill_2:         '📝 16 questions',
  quiz_pill_3:         '✨ Résultats immédiats',
  quiz_cta:            'Commencer le test →',
  result_cta_title:    'Passez à l\'étape suivante',
  result_cta_subtitle: 'Séance découverte offerte de 45 minutes avec Monica',
  result_cta_button:   'Réserver ma séance découverte gratuite →',
  booking_title:       'Choisissez votre créneau',
  booking_subtitle:    'Séance découverte offerte · 45 minutes · Sans engagement',
  theory_title:        'Les fondements théoriques',
  theory_card_1_title: '📖 ATTACHED',
  theory_card_1_text:  'Comprendre son style d\'attachement',
  theory_card_2_title: '🌿 Carl Rogers',
  theory_card_2_text:  'L\'écoute inconditionnelle',
  theory_card_3_title: '❤️ Erich Fromm',
  theory_card_3_text:  'L\'art d\'aimer',
};

export default function RelationsPage() {
  const c = useCmsContent('relations', DEFAULTS_RELATIONS);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const handleBook = () => {
    setBookingOpen(true);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const activeSource = SOURCES.find(s => s.id === activeModal);

  return (
    <div className="min-h-screen bg-[#f5f0e8]">

      {/* ══ NAV MINIMALISTE ═══════════════════════════════════════════════ */}
      <Header />

      <main className="pt-[72px]">

        {/* ══ HERO INTRO ════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-stone-900 px-6 py-12 md:py-16 md:px-10 text-center">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=85&auto=format&fit=crop"
            alt="Connexion humaine, mains tendues symbolisant le lien entre personnes"
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Relations &amp; Attachement
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-white mb-4">
              Comprendre vos liens pour les transformer
            </h1>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed">
              La façon dont nous nous connectons aux autres prend racine dans notre enfance. Découvrez votre style d'attachement et les clés pour construire des relations épanouissantes.
            </p>
          </div>
        </section>

        {/* ══ LES 4 STYLES D'ATTACHEMENT ════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Théorie de l'attachement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Les 4 styles d'attachement</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
                Notre façon d'entrer en relation à l'âge adulte reflète des modèles construits dès la petite enfance. Quel est le vôtre ?
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ATTACHMENT_STYLES.map(s => (
                <div key={s.id} className="rounded-2xl bg-white p-6 shadow-sm border-t-4" style={{ borderColor: s.color }}>
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-stone-900">{s.label}</h3>
                    <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ background: s.bg, color: s.color }}>{s.percent}</span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TEST ATTACHEMENT ══════════════════════════════════════════ */}
        <section className="bg-stone-900 px-6 py-16 md:py-24 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                Quiz · Découvrez votre profil
              </p>
            </div>
            <AttachmentTest onBook={handleBook} />
          </div>
        </section>

        {/* ══ LA DANSE ANXIEUX-ÉVITANT ═══════════════════════════════════ */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Dynamique relationnelle</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">La danse Anxieux–Évitant</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
                Le couple le plus fréquent… et le plus volatile. Comprendre ce mécanisme change tout.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="flex-1 rounded-2xl p-7 text-center" style={{ background: 'rgba(180,83,9,0.07)', border: '1px solid rgba(180,83,9,0.15)' }}>
                <div className="text-4xl mb-3">🌊</div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#b45309' }}>Le profil Anxieux</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Par peur de perdre le lien, il <strong>poursuit</strong> et demande plus d'attention (hyperactivation). Plus il ressent de distance, plus il accélère.</p>
              </div>
              <div className="flex items-center justify-center text-3xl md:text-5xl text-stone-300 font-light select-none">
                ⟷
              </div>
              <div className="flex-1 rounded-2xl p-7 text-center" style={{ background: 'rgba(29,78,216,0.07)', border: '1px solid rgba(29,78,216,0.12)' }}>
                <div className="text-4xl mb-3">🌬️</div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#1d4ed8' }}>Le profil Évitant</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Craint la dépendance, alors il <strong>fuit</strong> et se distance (désactivation). Plus l'anxieux s'approche, plus il s'éloigne.</p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'rgba(45,95,84,0.07)' }}>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong style={{ color: '#2d5f54' }}>Bonne nouvelle :</strong> ces réactions ne relèvent pas d'un manque d'amour, mais d'un <em>système biologique d'attachement activé</em>. Les comprendre permet de sortir du piège et de retrouver la connexion.
              </p>
            </div>
          </div>
        </section>

        {/* ══ LE CHANGEMENT EST POSSIBLE ════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Neuroplasticité & guérison</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">L'attachement sécurisé acquis</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
                Votre style d'attachement n'est pas une fatalité. Grâce à la neuroplasticité du cerveau, il est possible de le transformer.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-7 shadow-sm">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold mb-2 text-stone-900">La conscience de soi</h3>
                <p className="text-sm text-stone-500 leading-relaxed">Observer ses réactions sans se juger. Identifier ses déclencheurs émotionnels. Créer un espace entre le stimulus et la réponse.</p>
              </div>
              <div className="rounded-2xl bg-white p-7 shadow-sm">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-semibold mb-2 text-stone-900">Les relations correctrices</h3>
                <p className="text-sm text-stone-500 leading-relaxed">S'entourer de personnes sécures et fiables. Leur présence apaisante va progressivement « recâbler » le système nerveux vers plus de sécurité.</p>
              </div>
              <div className="rounded-2xl bg-white p-7 shadow-sm">
                <div className="text-3xl mb-3">💫</div>
                <h3 className="font-semibold mb-2 text-stone-900">La thérapie (EFT)</h3>
                <p className="text-sm text-stone-500 leading-relaxed">La Thérapie Centrée sur les Émotions (Sue Johnson) utilise la relation thérapeutique comme base de sécurité pour transformer les modèles internes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ COMMUNICATION EFFICACE ════════════════════════════════════ */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Outils pratiques</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Communiquer efficacement</h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
                Formuler ses besoins selon son style d'attachement : 3 règles pour apaiser les tensions relationnelles.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {COMM_RULES.map(r => (
                <div key={r.title} className="rounded-2xl bg-[#f5f0e8] p-7">
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="font-semibold mb-2 text-stone-900">{r.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-3">{r.desc}</p>
                  <p className="text-xs text-stone-400 italic border-l-2 border-amber-300 pl-3 leading-relaxed">{r.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AU TRAVAIL AUSSI ══════════════════════════════════════════ */}
        <section className="bg-[#f5f0e8] px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Coaching professionnel</p>
                <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl mb-4">L'attachement au travail aussi</h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Les styles d'attachement influencent notre rapport au travail, notre leadership et la sécurité psychologique en équipe.
                </p>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-2"><span style={{ color: '#2d5f54' }}>🌿</span><span><strong>Leader sécure :</strong> inspire confiance, sait déléguer, crée un environnement de sécurité psychologique.</span></li>
                  <li className="flex items-start gap-2"><span style={{ color: '#b45309' }}>🌊</span><span><strong>Collaborateur anxieux :</strong> cherche constamment la validation de sa hiérarchie, risque le burn-out par épuisement.</span></li>
                  <li className="flex items-start gap-2"><span style={{ color: '#1d4ed8' }}>🌬️</span><span><strong>Collaborateur évitant :</strong> privilégie l'autonomie au détriment du travail d'équipe et de la collaboration.</span></li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleBook}
                  className="rounded-2xl bg-[#2d5f54] px-8 py-5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition text-center block"
                >
                  <span className="text-2xl block mb-2">💼</span>
                  Explorer le coaching<br />en entreprise
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══ VOS 3 ACTIONS ════════════════════════════════════════════ */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">La méthode</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Vos 3 actions</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map(({ num, title, desc }) => (
                <div key={num} className="rounded-2xl bg-[#f5f0e8] p-7 shadow-sm">
                  <p className="mb-3 text-3xl font-serif font-light text-[#2d5f54] opacity-60">{num}</p>
                  <h3 className="mb-2 text-base font-semibold text-stone-900">{title}</h3>
                  <p className="text-sm text-stone-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ RÉSERVER — BOOKING ════════════════════════════════════════ */}
        <section
          ref={bookingRef}
          className="bg-[#f5f0e8] px-6 py-16 md:px-10 md:py-20"
          id="booking"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Agenda</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">
                Choisissez votre créneau
              </h2>
              <p className="mt-3 text-sm text-stone-500">
                Séance découverte offerte · 45 minutes · Sans engagement
              </p>
            </div>
            {bookingOpen
              ? <BookingWidget defaultType="discovery" />
              : (
                <div className="text-center">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="rounded-full bg-[#2d5f54] px-8 py-4 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition"
                  >
                    Voir les créneaux disponibles →
                  </button>
                </div>
              )
            }
          </div>
        </section>

        {/* ══ RESSOURCES THÉORIQUES ═════════════════════════════════════ */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Références</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">
                Les fondements théoriques
              </h2>
              <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
                Cliquez sur une carte pour explorer les théories qui guident l&apos;approche de Monica.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {SOURCES.map(source => (
                <button
                  key={source.id}
                  onClick={() => setActiveModal(source.id)}
                  className="rounded-2xl bg-[#f5f0e8] p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="mb-3 text-3xl">{source.emoji}</div>
                  <h3 className="mb-1 text-base font-semibold text-stone-900 group-hover:text-[#2d5f54] transition">{source.title}</h3>
                  <p className="text-xs text-stone-500">{source.subtitle}</p>
                  <p className="mt-3 text-xs font-semibold text-[#2d5f54]">En savoir plus →</p>
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ══ FOOTER MINIMAL ════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-800 bg-stone-900 px-6 py-8 md:px-10">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 text-xs text-stone-400 md:flex-row">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image src="/logo-happy-humans.jpg" alt="Happy Humans" width={28} height={28} className="rounded-full opacity-80" />
            <span className="font-serif text-base text-stone-300 font-semibold hover:text-white transition">Happy Humans</span>
          </a>
          <p>© {new Date().getFullYear()} Happy Humans — Monica Schneider</p>
          <div className="flex gap-6">
            <a href="/mentions-legales" className="hover:text-stone-200 transition">Mentions légales</a>
            <a href="/politique-confidentialite" className="hover:text-stone-200 transition">Confidentialité</a>
          </div>
        </div>
      </footer>

      {/* ══ MODAL THÉORIQUE ═══════════════════════════════════════════════ */}
      {activeModal && activeSource && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/80 p-4 pt-16 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >✕</button>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">{activeSource.emoji}</span>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">{activeSource.title}</h2>
                <p className="text-sm text-stone-500">{activeSource.subtitle}</p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-stone-700">
              {activeSource.content}
            </div>
            <div className="mt-8 border-t pt-6">
              <button
                onClick={() => { setActiveModal(null); handleBook(); }}
                className="w-full rounded-full bg-[#2d5f54] py-3 text-sm font-semibold text-white hover:bg-[#1e3a34] transition"
              >
                Réserver une séance découverte de 45 min →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
