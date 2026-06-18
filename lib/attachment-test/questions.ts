import type { AttachmentQuestion } from './types';

export const attachmentQuestions: AttachmentQuestion[] = [
  // ── ANXIÉTÉ (8 questions) ────────────────────────────────────────────────────
  {
    id: 1,
    text: "Quand quelqu'un que j'aime ne me répond pas rapidement, je commence à m'inquiéter de ce que cela signifie.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 2,
    text: "J'ai parfois peur que les gens importants dans ma vie finissent par me quitter.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 3,
    text: "Je ressens un grand soulagement quand une personne proche me confirme qu'elle tient à moi.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 4,
    text: "Il m'arrive de relire plusieurs fois un message pour chercher un signe de désaffection.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 5,
    text: "Je me sens généralement en sécurité dans mes relations proches, sans avoir besoin de réassurance constante.",
    dimension: 'anxiety',
    reverseScored: true,
  },
  {
    id: 6,
    text: "Lorsqu'un conflit éclate, j'ai tendance à craindre que cela annonce la fin de la relation.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 7,
    text: "Je pense souvent à ce que ressentent les autres à mon égard, même entre deux échanges.",
    dimension: 'anxiety',
    reverseScored: false,
  },
  {
    id: 8,
    text: "Quand je suis en désaccord avec quelqu'un que j'aime, je parviens à exprimer mon point de vue sans anxiété excessive.",
    dimension: 'anxiety',
    reverseScored: true,
  },
  // ── ÉVITEMENT (8 questions) ──────────────────────────────────────────────────
  {
    id: 9,
    text: "Je préfère généralement gérer mes émotions seul(e) plutôt que de les partager avec quelqu'un de proche.",
    dimension: 'avoidance',
    reverseScored: false,
  },
  {
    id: 10,
    text: "Quand une relation devient trop intense émotionnellement, j'éprouve le besoin de prendre de la distance.",
    dimension: 'avoidance',
    reverseScored: false,
  },
  {
    id: 11,
    text: "Je me sens à l'aise pour demander de l'aide à mes proches quand j'en ai besoin.",
    dimension: 'avoidance',
    reverseScored: true,
  },
  {
    id: 12,
    text: "L'idée de dépendre émotionnellement d'une autre personne me met mal à l'aise.",
    dimension: 'avoidance',
    reverseScored: false,
  },
  {
    id: 13,
    text: "Je trouve difficile de me laisser aller à la vulnérabilité, même avec des gens en qui j'ai confiance.",
    dimension: 'avoidance',
    reverseScored: false,
  },
  {
    id: 14,
    text: "J'apprécie profondément les moments d'intimité et de connexion avec mes proches.",
    dimension: 'avoidance',
    reverseScored: true,
  },
  {
    id: 15,
    text: "Lorsque quelqu'un s'approche trop vite émotionnellement, je ressens un léger malaise.",
    dimension: 'avoidance',
    reverseScored: false,
  },
  {
    id: 16,
    text: "Je peux partager mes peurs et mes doutes avec une personne de confiance sans me sentir diminué(e).",
    dimension: 'avoidance',
    reverseScored: true,
  },
];
