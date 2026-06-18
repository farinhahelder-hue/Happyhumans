import type { AttachmentAnswer, AttachmentProfile, AttachmentResult } from './types';
import { attachmentQuestions } from './questions';
import { profilesContent } from './results-content';

const MIN_SCORE = 8;
const MAX_SCORE = 40;
const HIGH_THRESHOLD = 24;

function computeRawScore(
  answers: AttachmentAnswer[],
  dimension: 'anxiety' | 'avoidance'
): number {
  const questions = attachmentQuestions.filter((q) => q.dimension === dimension);
  return questions.reduce((sum, q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    if (!answer) return sum;
    const scored = q.reverseScored ? 6 - answer.value : answer.value;
    return sum + scored;
  }, 0);
}

function toPercent(score: number): number {
  return Math.round(((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100);
}

function detectProfile(
  anxietyScore: number,
  avoidanceScore: number
): AttachmentProfile {
  const highAnxiety = anxietyScore > HIGH_THRESHOLD;
  const highAvoidance = avoidanceScore > HIGH_THRESHOLD;
  if (!highAnxiety && !highAvoidance) return 'secure';
  if (highAnxiety && !highAvoidance) return 'anxious';
  if (!highAnxiety && highAvoidance) return 'avoidant';
  return 'disorganized';
}

export function computeAttachmentResult(
  answers: AttachmentAnswer[]
): AttachmentResult {
  const anxietyScore = computeRawScore(answers, 'anxiety');
  const avoidanceScore = computeRawScore(answers, 'avoidance');
  const anxietyPercent = toPercent(anxietyScore);
  const avoidancePercent = toPercent(avoidanceScore);
  const profile = detectProfile(anxietyScore, avoidanceScore);
  const content = profilesContent[profile];

  return {
    profile,
    anxietyScore,
    avoidanceScore,
    anxietyPercent,
    avoidancePercent,
    ...content,
    disclaimer:
      "Ce test est un outil de découverte personnelle et ne constitue en aucun cas un diagnostic médical ou psychologique. Les résultats reflètent des tendances générales et peuvent varier selon le contexte de votre vie. Pour un accompagnement approfondi, nous vous recommandons de consulter un professionnel de santé mentale.",
  };
}
