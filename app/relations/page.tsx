'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCmsContent } from '@/hooks/useCmsContent';

const DEFAULTS = {
  hero_image:   '',
  page_title:   'Des relations saines et epanouissantes',
  intro_text:   "Explorez des ressources, decouvrez votre style d'attachement et reservez votre seance offerte pour identifier vos 3 actions cles.",
  cta_title:    'Vos 3 actions vers des relations plus epanouissantes',
  cta_subtitle: "Lors d'une seance offerte de 45 minutes, Monica vous accompagne pour identifier les 3 actions concretes les plus impactantes pour transformer vos relations des maintenant.",
};

type Resource = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
};

const RESOURCES: Resource[] = [
  {
    id: 'attached',
    emoji: '📖',
    title: 'ATTACHED',
    subtitle: "Comprendre son style d'attachement",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <p>Le livre ATTACHED applique la theorie de l'attachement, developpee a l'origine par John Bowlby et Mary Ainsworth, aux relations amoureuses adultes. Les auteurs montrent que la facon dont nous nous lions a un partenaire suit des schemas precis, determines par notre histoire emotionnelle precoce.</p>
        <p>Ils identifient <strong>trois styles principaux</strong> : secur, anxieux et evitant.</p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Style secur :</strong> permet une intimite confiante et stable.</li>
          <li><strong>Style anxieux :</strong> genere une peur constante de l'abandon, un besoin de reassertance et une hypervigilance aux signaux de l'autre.</li>
          <li><strong>Style evitant :</strong> pousse a fuir la proximite, a valoriser l'independance a l'exces et a se sentir "etouffe" des que la relation devient serieuse.</li>
        </ul>
        <p>Le livre propose des tests pour identifier son propre style, ainsi que celui de son partenaire, et des strategies concretes pour mieux communiquer ses besoins.</p>
        <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(168,100,160,0.08)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#7c3d8f' }}>Comment ces styles se forment dans l'enfance</h4>
          <div className="space-y-4" style={{ color: '#555' }}>
            <p>Selon Bowlby, le nourrisson a un besoin biologique de proximite avec une figure d'attachement pour assurer sa survie. La facon dont ce parent repond faconne un modele inconscient de ce a quoi s'attendre des relations.</p>
            <p><strong>Attachement secur :</strong> le parent est globalement disponible et rekuffrant — l'enfant apprend que ses besoins seront entendus.</p>
            <p><strong>Attachement anxieux :</strong> les responses parentales sont incoherentes — l'enfant apprend a surveiller constamment la disponibilite de l'autre.</p>
            <p><strong>Attachement evitant :</strong> le parent est distant et peu expressif — l'enfant apprend a minimiser ses besoins et a compter sur lui-meme.</p>
            <p className="mt-4" style={{ fontStyle: 'italic' }}>Ces modeles, formes avant l'age de deux ans, continuent a orienter inconsciemment nos relations adultes.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'rogers',
    emoji: '🪞',
    title: 'Carl Rogers',
    subtitle: "Deconstruire l'amour conditionnel pour enfin s'aimer",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: '#7c3d8f' }}>Le concept de Carl Rogers sur l'amour inconditionnel</h4>
          <div className="space-y-4">
            <p>L'idee de Carl Rogers repose sur son concept de « regard positif inconditionnel » — accepter une autre personne pleinement, sans jugement ni condition, telle qu'elle est. Son intuition etait que nous ne pouvons offrir ce type de regard a quelqu'un d'autre que dans la mesure ou nous avons appris a nous l'offrir a nous-memes.</p>
            <p>Rogers pensait que la plupart d'entre nous grandissons en interiorisant une acceptation conditionnelle : un amour qui dependait du fait d'etre gentil, performant, seduisant ou conciliant. Avec le temps, nous construisons un « concept de soi » faconne par ce que nous pensons avoir le droit d'etre, et nous cachons ou rejetons les parts de nous-memes qui n'ont pas obtenu l'approbation.</p>
            <p>Le probleme : lorsque nous n'avons pas accepte ces parts en nous-memes, nous ne pouvons inconsciemment pas les tolerer chez un partenaire. Nous devenons anxieux, controllants ou critiques quand notre partenaire montre les qualites memes que nous avons repressees en nous.</p>
            <p>Pour Rogers, une vraie intimite exige la <strong>congruence</strong> : etre authentique plutot que de jouer un role. Et la congruence n'est possible qu'une fois que l'on a fait la paix avec l'etendue entiere de qui l'on est.</p>
          </div>
        </div>
        <div className="p-6 rounded-xl" style={{ background: 'rgba(168,100,160,0.06)' }}>
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#7c3d8f' }}>Comment faire la paix avec soi-meme selon Rogers</h4>
          <div className="space-y-4" style={{ color: '#555' }}>
            <p>Rogers ne voyait pas cela comme une technique unique, mais comme un processus continu qu'il appelait devenir une « personne pleinement fonctionnelle ». Quelques elements centraux :</p>
            <p><strong>Abandonner les « conditions de valeur »</strong> — Remarquez les regles interieures que vous avez interiorisees. Distinguez qui vous etes reellement de qui vous avez appris que vous aviez le droit d'etre.</p>
            <p><strong>Faire confiance a sa propre experience</strong> — Rogers appelait cela le « processus d'evaluation organismique » : ce sens interieur de ce qui est vrai ou necessaire pour soi, avant de le filtrer a travers ce que les autres attendent.</p>
            <p><strong>Pratiquer le regard positif inconditionnel envers soi-meme</strong> — La meme chaleur que Rogers demandait aux therapeutes d'offrir, il pensait que chacun devait apprendre a se l'offrir — en particulier envers les parts jugees honteuses.</p>
            <p><strong>Chercher des environnements ou l'on peut etre congruent</strong> — Etre pleinement vu par une autre personne accueillante nous apprend, par l'experience, que les parts jugees inacceptables sont supportables, et meme aimables.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'fromm',
    emoji: '💝',
    title: 'Erich Fromm',
    subtitle: "Se preparer a l'amour mature",
    content: (
      <div className="space-y-6" style={{ color: '#444', lineHeight: 1.8 }}>
        <p>Erich Fromm, dans <em>L'art d'aimer</em>, soutenait que la plupart des gens comprennent mal l'amour, le percevant comme quelque chose dans lequel on « tombe » plutot que comme quelque chose que l'on pratique. Il distinguait l'amour immature de l'amour mature.</p>
        <div className="p-5 rounded-xl border-l-4" style={{ background: '#fff', borderColor: '#dc2626' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#dc2626' }}>Amour immature</h4>
          <p className="italic mb-2">« Je t'aime parce que j'ai besoin de toi. »</p>
          <p className="text-sm">Il est enracine dans la dependance — vous aimez quelqu'un parce qu'il comble un vide, apaise votre solitude, ou renforce votre estime de vous-meme. Fromm y voyait une forme de fusion, ou deux personnes se melent pour echapper a l'angoisse d'etre des individus separes. C'est intense et passionne, mais fragile et possessif.</p>
        </div>
        <div className="p-5 rounded-xl border-l-4" style={{ background: '#fff', borderColor: '#166534' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#166534' }}>Amour mature</h4>
          <p className="italic mb-2">« J'ai besoin de toi parce que je t'aime. »</p>
          <p className="text-sm">Ici, l'amour est une capacite active — fondee sur le soin, la responsabilite, le respect et une connaissance veritable de l'autre. Fromm pensait que l'amour mature exige d'avoir deja un sens de soi solide et secur. Deux individus entiers se choisissent l'un l'autre.</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'rgba(168,100,160,0.08)' }}>
          <p><strong>Pour Fromm,</strong> « trouver la bonne personne » importe moins que devenir une personne capable d'un amour mature — car l'amour immature reproduit les memes schemas, quel que soit le partenaire.</p>
        </div>
      </div>
    ),
  },
];

const STEPS = [
  { number: '01', title: 'Faites le test',       description: "Identifiez votre style d'attachement en 16 questions (5 min, gratuit)." },
  { number: '02', title: 'Session decouverte', description: 'Monica vous identifie 3 actions concretes et personnalisees vers des relations plus epanouissantes.' },
  { number: '03', title: "Passez a l'action",     description: 'Repartez avec un plan clair, des outils pratiques et la clarte pour transformer vos relations des maintenant.' },
];

const exercices = (
  <div className="space-y-8">
    <div className="p-6 rounded-xl" style={{ background: '#fff' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#a864a0' }}>Questions de reflexion</h3>
      <ul className="space-y-3" style={{ color: '#555', lineHeight: 1.8 }}>
        <li>Quels sont les modeles d'attachement que j'ai interiorises dans mon enfance ?</li>
        <li>Quelles « conditions de valeur » est-ce que je me fixe pour me sentir acceptable ?</li>
        <li>Est-ce que je cherche l'amour pour combler un vide ou pour partager une plenitude ?</li>
        <li>Quelles parts de moi est-ce que je cache par peur du jugement ?</li>
      </ul>
    </div>
    <div className="p-6 rounded-xl" style={{ background: '#fff' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#a864a0' }}>Exercices a faire dans le monde</h3>
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🚶</div>
          <h4 className="font-semibold mb-2">Marcher en flottant</h4>
          <p className="text-sm" style={{ color: '#666' }}>Une promenade consciente, sans destination, pour contacter vos sensations.</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">💕</div>
          <h4 className="font-semibold mb-2">S'emmener a des dates</h4>
          <p className="text-sm" style={{ color: '#666' }}>Passez du temps avec vous-meme comme vous le feriez avec quelqu'un que vous aimez.</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">✨</div>
          <h4 className="font-semibold mb-2">Faire ce qu'on a vraiment envie</h4>
          <p className="text-sm" style={{ color: '#666' }}>Pleurer, rire, demander de l'aide — faites-le quand meme.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function RelationsPage() {
  const c = useCmsContent('relations', DEFAULTS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const activeResource = RESOURCES.find(r => r.id === activeModal);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F8F6F2', color: '#2C2C2C' }}>
      <Header />

      <section className="relative px-4 py-20 md:py-32 text-center overflow-hidden"
        style={{ background: c.hero_image ? 'none' : 'linear-gradient(160deg, #fdf6ee 0%, #f5e8f5 50%, #ede8fa 100%)' }}>
        {c.hero_image && <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            {c.page_title || 'RESSOURCES'}
          </h1>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24" style={{ background: 'linear-gradient(160deg, #fdf6ee 0%, #f5e8f5 50%, #ede8fa 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Vos 3 actions vers des relations plus epanouissantes
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: '#666' }}>
            Lors d'une seance offerte de 45 minutes, Monica vous accompagne pour identifier les 3 actions concretes les plus impactantes pour transformer vos relations des maintenant.
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
            <a href="/contact" className="inline-block px-10 py-4 font-semibold rounded-2xl text-lg transition-all shadow-lg"
              style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
              Reserver ma seance offerte
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
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

      <section className="px-4 py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #f5e8f5 0%, #ede8fa 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Exercices a faire chez soi
          </h2>
          {exercices}
        </div>
      </section>

      <section id="seance-offerte" className="px-4 py-20 md:py-24" style={{ background: '#fff' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}>
            Prete a transformer vos relations ?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#666' }}>
            Lors d'une seance offerte de 45 minutes, Monica vous accompagne pour identifier les axes concrets de transformation dans vos relations.
          </p>
          <a href="/contact" className="inline-block px-10 py-4 font-semibold rounded-2xl text-lg transition-all shadow-lg"
            style={{ background: '#a864a0', color: '#fff', boxShadow: '0 8px 24px rgba(168,100,160,0.35)' }}>
            Reserver ma seance offerte
          </a>
        </div>
      </section>

      <Footer />

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setActiveModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8" style={{ background: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(0,0,0,0.05)', color: '#666' }}>x</button>
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
