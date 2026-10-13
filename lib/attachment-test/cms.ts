import type { AttachmentQuestion, AttachmentResult } from './types';
import { attachmentQuestions } from './questions';
import { toLines } from './results-content';

/**
 * Textes du test d'attachement saisis dans le CMS (page « Test d'attachement ») : le code ne garde que la structure
 * (dimension mesurée, sens de la notation) ; chaque texte vient de c (valeurs par défaut :
 * lib/cms-defaults/test-attachement.ts).
 */
type Content = Record<string, string>;

/** Questions avec leur texte du CMS (question_1 … question_16). */
export function questionsFromCms(c: Content): AttachmentQuestion[] {
  return attachmentQuestions.map((q) => ({ ...q, text: c[`question_${q.id}`] || q.text }));
}

const lines = (value: string | undefined, fallback: string[]): string[] => {
  const list = toLines(value ?? '');
  return list.length > 0 ? list : fallback;
};

/** Résultat avec les textes du profil saisis dans le CMS (titre, description, listes « une par ligne », avertissement). */
export function resultFromCms(result: AttachmentResult, c: Content): AttachmentResult {
  const p = result.profile;
  return {
    ...result,
    title: c[`${p}_title`] || result.title,
    summary: c[`${p}_summary`] || result.summary,
    strengths: lines(c[`${p}_strengths`], result.strengths),
    challenges: lines(c[`${p}_challenges`], result.challenges),
    growthTips: lines(c[`${p}_growth`], result.growthTips),
    disclaimer: c.disclaimer || result.disclaimer,
  };
}
