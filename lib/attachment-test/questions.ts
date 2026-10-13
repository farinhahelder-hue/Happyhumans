import type { AttachmentQuestion } from './types';
import { TEST_ATTACHEMENT_DEFAULTS as D } from '@/lib/cms-defaults/test-attachement';

// Structure du questionnaire (dimension mesurée, sens de la notation). Le TEXTE de chaque question vient du CMS :
// valeur par défaut dans lib/cms-defaults/test-attachement.ts (question_N), modifiable dans l'admin.
export const attachmentQuestions: AttachmentQuestion[] = [
  { id: 1, text: D.question_1, dimension: 'anxiety', reverseScored: false },
  { id: 2, text: D.question_2, dimension: 'anxiety', reverseScored: false },
  { id: 3, text: D.question_3, dimension: 'anxiety', reverseScored: false },
  { id: 4, text: D.question_4, dimension: 'anxiety', reverseScored: false },
  { id: 5, text: D.question_5, dimension: 'anxiety', reverseScored: true },
  { id: 6, text: D.question_6, dimension: 'anxiety', reverseScored: false },
  { id: 7, text: D.question_7, dimension: 'anxiety', reverseScored: false },
  { id: 8, text: D.question_8, dimension: 'anxiety', reverseScored: true },
  { id: 9, text: D.question_9, dimension: 'avoidance', reverseScored: false },
  { id: 10, text: D.question_10, dimension: 'avoidance', reverseScored: false },
  { id: 11, text: D.question_11, dimension: 'avoidance', reverseScored: true },
  { id: 12, text: D.question_12, dimension: 'avoidance', reverseScored: false },
  { id: 13, text: D.question_13, dimension: 'avoidance', reverseScored: false },
  { id: 14, text: D.question_14, dimension: 'avoidance', reverseScored: true },
  { id: 15, text: D.question_15, dimension: 'avoidance', reverseScored: false },
  { id: 16, text: D.question_16, dimension: 'avoidance', reverseScored: true },
];
