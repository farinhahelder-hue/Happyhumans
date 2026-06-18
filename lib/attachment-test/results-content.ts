import type { AttachmentProfile } from './types';

type ProfileContent = {
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  growthTips: string[];
};

export const profilesContent: Record<AttachmentProfile, ProfileContent> = {
  secure: {
    title: 'Style sécure 💚',
    summary:
      "Vous avez tendance à vous sentir à l'aise dans les relations proches. Vous pouvez exprimer vos besoins, faire confiance aux autres et tolérer les moments d'incertitude sans perdre votre équilibre intérieur. Ce style est souvent le fruit d'expériences relationnelles chaleureuses et prévisibles.",
    strengths: [
      'Aisance à exprimer vos émotions et vos besoins',
      'Capacité à faire confiance sans sur-contrôler',
      'Stabilité émotionnelle dans les conflits',
      "Confort dans l'intimité comme dans l'autonomie",
    ],
    challenges: [
      "Parfois sous-estimer les difficultés d'attachement chez les autres",
      'Difficile de comprendre des partenaires aux styles très différents',
    ],
    growthTips: [
      "Cultivez votre curiosité pour les dynamiques d'attachement de vos proches",
      'Continuez à créer des espaces de dialogue ouverts dans vos relations',
      'Votre stabilité peut devenir une ancre précieuse pour les personnes que vous aimez',
    ],
  },
  anxious: {
    title: 'Style anxieux 💛',
    summary:
      "Vous accordez une grande importance à vos relations, parfois au point de vous préoccuper de leur solidité. Vous êtes très attentif(ve) aux signaux de l'autre et cherchez souvent une confirmation que vous êtes aimé(e). Ce style naît souvent d'une disponibilité émotionnelle inconstante dans les premières relations de votre vie.",
    strengths: [
      'Grande sensibilité émotionnelle et empathie',
      "Profond désir de connexion et d'intimité",
      'Capacité à lire les émotions des autres',
      'Engagement sincère dans vos relations',
    ],
    challenges: [
      'Besoin fréquent de réassurance qui peut peser sur les proches',
      'Tendance à interpréter le silence comme un rejet',
      "Difficulté à rester ancré(e) quand l'autre prend de la distance",
    ],
    growthTips: [
      'Apprenez à reconnaître vos déclencheurs émotionnels avant de réagir',
      "Pratiquez des activités qui renforcent votre sentiment de sécurité intérieure",
      'Communiquez vos besoins avec des "je ressens" plutôt que des reproches',
      "Une thérapie centrée sur l'attachement peut être très transformatrice",
    ],
  },
  avoidant: {
    title: 'Style évitant 🔵',
    summary:
      "Vous valorisez profondément votre autonomie et tendez à vous replier sur vous-même lorsque les émotions deviennent trop intenses. Ce n'est pas un manque d'affection, mais une façon de vous protéger apprise tôt dans votre vie. Vous pouvez avoir du mal à accueillir la vulnérabilité, la vôtre comme celle des autres.",
    strengths: [
      "Forte autonomie et capacité à gérer seul(e) les difficultés",
      'Calme apparent dans les situations de tension',
      "Clarté dans vos besoins d'espace personnel",
      "Moins susceptible d'être submergé(e) par les conflits",
    ],
    challenges: [
      "Tendance à se déconnecter émotionnellement quand l'autre s'approche trop",
      'Difficulté à exprimer les besoins affectifs',
      'Les proches peuvent se sentir tenus à distance',
    ],
    growthTips: [
      'Essayez de nommer une émotion difficile à une personne de confiance, même brièvement',
      'Observez ce qui déclenche votre réflexe de mise à distance',
      "Rappelez-vous que la vulnérabilité n'est pas une faiblesse, c'est un pont",
      "Des pratiques de pleine conscience peuvent vous aider à rester dans l'instant",
    ],
  },
  disorganized: {
    title: 'Style craintif-évitant 🌀',
    summary:
      "Vous aspirez profondément à la connexion, mais l'intimité vous semble parfois à la fois désirable et menaçante. Vous pouvez osciller entre le besoin de proximité et la peur d'être blessé(e), ce qui rend les relations complexes à naviguer. Ce style souvent lié à des expériences relationnelles imprévisibles mérite une attention bienveillante.",
    strengths: [
      'Grande profondeur émotionnelle et sensibilité',
      'Conscience aiguë de vos propres contradictions intérieures',
      'Désir authentique de relations vraies et profondes',
    ],
    challenges: [
      'Alternance entre envie de proximité et besoin de fuite',
      'Difficulté à faire confiance même quand vous le désirez',
      'Relations parfois vécues comme source de danger autant que de réconfort',
    ],
    growthTips: [
      "Un travail thérapeutique dédié (EMDR, thérapie d'attachement) peut être très aidant",
      'Commencez petit : une micro-vulnérabilité à la fois',
      'La régulation du système nerveux (respiration, mouvement) peut stabiliser les pics émotionnels',
      'Vous méritez des relations sûres — cherchez des personnes constantes et patientes',
    ],
  },
};
