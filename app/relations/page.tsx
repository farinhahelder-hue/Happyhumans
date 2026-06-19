'use client';
import { useState, useRef } from 'react';
import BookingWidget from '@/components/BookingWidget';
import { AttachmentTest } from '@/components/attachment-test/AttachmentTest';

SOURCES = [
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
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#7c3d8f' }}>Comment ces styles se forment dans l'enfance</h4>
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
    subtitle: "Déconstruire l'amour conditionnel pour enfin s'aimer",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: '#7c3d8f' }}>Le concept de Carl Rogers sur l'amour inconditionnel</h4>
          <div className="space-y-4">
            <p>L'idée de Carl Rogers repose sur son concept de « regard positif inconditionnel » — accepter une autre personne pleinement, sans jugement ni condition, telle qu'elle est. Son intuition était que nous ne pouvons offrir ce type de regard à quelqu'un d'autre que dans la mesure où nous avons appris à nous l'offrir à nous-mêmes.</p>
            <p>Rogers pensait que la plupart d'entre nous grandissons en intériorisant une acceptation conditionnelle : un amour qui dépendait du fait d'être gentil, performant, séduisant ou conciliant. Avec le temps, nous construisons un « concept de soi » façonné par ce que nous pensons avoir le droit d'être, et nous cachons ou rejetons les parts de nous-mêmes qui n'ont pas obtenu l'approbation — la colère, le besoin affectif, la peur, l'ambition, la sexualité.</p>
            <p>Le problème, c'est que lorsque nous n'avons pas accepté ces parts en nous-mêmes, nous ne pouvons inconsciemment pas les tolérer chez un partenaire non plus. Nous devenons anxieux, contrôlants ou critiques quand notre partenaire montre les qualités mêmes que nous avons réprimées en nous. Nous avons aussi du mal à croire que nous sommes véritablement aimés, car nous ne croyons pas être acceptables tels que nous sommes — alors nous jouons un rôle, nous cherchons à plaire, ou nous restons sur nos gardes.</p>
            <p>Pour Rogers, une vraie intimité exige la <strong>congruence</strong> : être authentique plutôt que de jouer un rôle. Et la congruence n'est possible qu'une fois que l'on a fait la paix avec l'étendue entière de qui l'on est — pas la version épurée et « acceptable ».</p>
          </div>
        </div>
        <div className="p-6 rounded-xl" style={{ background: 'rgba(168,100,160,0.06)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#7c3d8f' }}>Comment faire la paix avec soi-même selon Rogers</h4>
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
    subtitle: "Se préparer à l'amour mature",
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

const ST

const STEPS = [
  { num: '01', title: 'Faites le test', desc: '16 questions · 3 à 5 minutes · Résultat immédiat' },
  { num: '02', title: 'Session découverte', desc: 'Séance offerte de 45 min pour découvrir vos 3 actions' },
  { num: '03', title: 'Passez à l'action', desc: 'Un plan clair et des outils pour des relations épanouissantes' },
]

export default function RelationsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBook = () => {
    setBookingOpen(true)
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const activeSource = SOURCES.find(s => s.id === activeModal)

  return (
    <div className="min-h-screen bg-[#f7f4ef]">

      {/* ══ NAV MINIMALISTE ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur-sm md:px-10">
        <a href="/" className="text-lg font-serif font-semibold text-stone-900 hover:text-[#2f6b61] transition">
          ← Happy Humans
        </a>
        <button
          onClick={handleBook}
          className="rounded-full bg-[#2f6b61] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#235249] transition"
        >
          Réserver une séance
        </button>
      </header>

      <main>

        {/* ══ TEST ATTACHEMENT — EN HAUT ════════════════════════════════ */}
        <section className="bg-stone-900 px-6 py-16 md:py-24 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                Relations &amp; Attachement · Happy Humans
              </p>
            </div>
            <AttachmentTest onBook={handleBook} />
          </div>
        </section>

        {/* ══ VOS 3 ACTIONS ════════════════════════════════════════════ */}
        <section className="bg-[#f7f4ef] px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">La méthode</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Vos 3 actions</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map(({ num, title, desc }) => (
                <div key={num} className="rounded-2xl bg-white p-7 shadow-sm">
                  <p className="mb-3 text-3xl font-serif font-light text-[#2f6b61] opacity-60">{num}</p>
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
          className="bg-white px-6 py-16 md:px-10 md:py-20"
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
                    className="rounded-full bg-[#2f6b61] px-8 py-4 text-sm font-semibold text-white shadow hover:bg-[#235249] transition"
                  >
                    Voir les créneaux disponibles →
                  </button>
                </div>
              )
            }
          </div>
        </section>

        {/* ══ RESSOURCES THÉORIQUES ═════════════════════════════════════ */}
        <section className="bg-[#f7f4ef] px-6 py-16 md:px-10 md:py-20">
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
                  className="rounded-2xl bg-white p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="mb-3 text-3xl">{source.emoji}</div>
                  <h3 className="mb-1 text-base font-semibold text-stone-900 group-hover:text-[#2f6b61] transition">{source.title}</h3>
                  <p className="text-xs text-stone-500">{source.subtitle}</p>
                  <p className="mt-3 text-xs font-semibold text-[#2f6b61]">En savoir plus →</p>
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ══ FOOTER MINIMAL ════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-800 bg-stone-900 px-6 py-8 md:px-10">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 text-xs text-stone-400 md:flex-row">
          <a href="/" className="font-serif text-base text-stone-300 font-semibold hover:text-white transition">Happy Humans</a>
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
                onClick={() => { setActiveModal(null); handleBook() }}
                className="w-full rounded-full bg-[#2f6b61] py-3 text-sm font-semibold text-white hover:bg-[#235249] transition"
              >
                Réserver une séance découverte de 45 min →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
