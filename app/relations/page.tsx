'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RESOURCES = [
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

const STEPS = [
  { number: '01', title: 'Faites le test', description: "Identifiez votre style d'attachement en 16 questions (5 min, gratuit)." },
  { number: '02', title: 'Recevez vos 3 actions', description: 'Monica vous identifie 3 actions concrètes et personnalisées vers des relations plus épanouissantes.' },
  { number: '03', title: "Passez à l'action", description: 'Repartez avec un plan clair, des outils pratiques et la clarté pour transformer vos relations dès maintenant.' },
];

export default function RelationsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const activeResource = RESOURCES.find(r => r.id === activeModal);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F8F6F2' }}>
      <Header />

      {/* HERO */}
      <section className="px-4 py-20 md:py-32 text-center"
        style={{ background: 'linear-gradient(160deg, #fdf6ee 0%, #f5e8f5 50%, #ede8fa 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Comprendre pour transformer
          </h1>
          <p className="text-lg md:text-xl" style={{ color: '#666' }}>
            Des clés concrètes pour nourrir vos relations — avec les autres, et avec vous-même.
          </p>
        </div>
      </section>

      {/* 3 ACTIONS */}
      <section className="px-4 py-16 md:py-24" style={{ background: 'linear-gradient(160deg, #fdf6ee 0%, #f5e8f5 50%, #ede8fa 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Vos 3 actions vers des relations plus épanouissantes
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: '#666' }}>
            Lors d'une séance offerte de 30 minutes, Monica vous accompagne pour identifier les 3 actions concrètes les plus impactantes pour transformer vos relations dès maintenant.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ background: '#a864a0', color: '#fff' }}>{step.number}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: '#666' }}>{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/booking" className="inline-block px-10 py-4 font-semibold rounded-2xl text-lg transition-all shadow-lg"
              style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
              Réserver ma séance offerte
            </a>
          </div>
        </div>
      </section>

      {/* RESSOURCES */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Ressources
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {RESOURCES.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setActiveModal(resource.id)}
                className="text-left rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <div className="text-5xl mb-4">{resource.emoji}</div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>{resource.title}</h2>
                <p className="text-sm" style={{ color: '#666' }}>{resource.subtitle}</p>
                <div className="mt-4 flex items-center gap-2" style={{ color: '#a864a0' }}>
                  <span className="text-sm font-medium">Lire</span><span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXERCICES */}
      <section className="px-4 py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #f5e8f5 0%, #ede8fa 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Exercices à faire chez soi
          </h2>
          
          <div className="space-y-8">
            <div className="p-6 rounded-xl" style={{ background: '#fff' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#a864a0' }}>Questions de réflexion</h3>
              <ul className="space-y-3" style={{ color: '#555', lineHeight: 1.8 }}>
                <li>Quels sont les modèles d'attachement que j'ai intériorisés dans mon enfance ?</li>
                <li>Quelles « conditions de valeur » est-ce que je me fixe pour me sentir acceptable ?</li>
                <li>Est-ce que je cherche l'amour pour combler un vide ou pour partager une plénitude ?</li>
                <li>Quelles parts de moi est-ce que je cache par peur du jugement ?</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl" style={{ background: '#fff' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#a864a0' }}>Exercices à faire dans le monde</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚶</div>
                  <h4 className="font-semibold mb-2">Marcher en flottant</h4>
                  <p className="text-sm" style={{ color: '#666' }}>Une promenade consciente, sans destination, pour contacter vos sensations.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">💕</div>
                  <h4 className="font-semibold mb-2">S'emmener à des dates</h4>
                  <p className="text-sm" style={{ color: '#666' }}>Passez du temps avec vous-même comme vous le feriez avec quelqu'un que vous aimez.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="font-semibold mb-2">Faire ce qu'on a vraiment envie</h4>
                  <p className="text-sm" style={{ color: '#666' }}>Pleurer, rire, demander de l'aide — faites-le quand même.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="seance-offerte" className="px-4 py-20 md:py-24" style={{ background: '#fff' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Prête à transformer vos relations ?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#666' }}>
            Lors d'une séance offerte de 30 minutes, Monica vous accompagne pour identifier les axes concrets de transformation dans vos relations.
          </p>
          <a href="/booking" className="inline-block px-10 py-4 font-semibold rounded-2xl text-lg transition-all shadow-lg"
            style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
            Réserver ma séance offerte
          </a>
        </div>
      </section>

      <Footer />

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setActiveModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8" style={{ background: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(0,0,0,0.05)', color: '#666' }}>×</button>
            {activeResource && (
              <>
                <div className="text-4xl mb-4">{activeResource.emoji}</div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>{activeResource.title}</h2>
                <p className="text-lg mb-6" style={{ color: '#a864a0' }}>{activeResource.subtitle}</p>
                <div className="border-t pt-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>{activeResource.content}</div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
