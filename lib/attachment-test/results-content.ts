import type { AttachmentProfile } from './types';
import { TEST_ATTACHEMENT_DEFAULTS as D } from '@/lib/cms-defaults/test-attachement';

type ProfileContent = {
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  growthTips: string[];
};

/** Liste saisie « une par ligne » dans le CMS → tableau. */
export const toLines = (v: string): string[] => v.split('\n').map((s) => s.trim()).filter(Boolean);

// Contenu de chaque profil : valeurs par défaut du CMS (lib/cms-defaults/test-attachement.ts).
export const profilesContent: Record<AttachmentProfile, ProfileContent> = {
  secure: {
    title: D.secure_title,
    summary: D.secure_summary,
    strengths: toLines(D.secure_strengths),
    challenges: toLines(D.secure_challenges),
    growthTips: toLines(D.secure_growth),
  },
  anxious: {
    title: D.anxious_title,
    summary: D.anxious_summary,
    strengths: toLines(D.anxious_strengths),
    challenges: toLines(D.anxious_challenges),
    growthTips: toLines(D.anxious_growth),
  },
  avoidant: {
    title: D.avoidant_title,
    summary: D.avoidant_summary,
    strengths: toLines(D.avoidant_strengths),
    challenges: toLines(D.avoidant_challenges),
    growthTips: toLines(D.avoidant_growth),
  },
  disorganized: {
    title: D.disorganized_title,
    summary: D.disorganized_summary,
    strengths: toLines(D.disorganized_strengths),
    challenges: toLines(D.disorganized_challenges),
    growthTips: toLines(D.disorganized_growth),
  },
};
