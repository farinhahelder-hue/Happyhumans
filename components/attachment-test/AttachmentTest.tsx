'use client';

import { useState, useCallback } from 'react';
import { attachmentQuestions } from '@/lib/attachment-test/questions';
import { computeAttachmentResult } from '@/lib/attachment-test/scoring';
import type { AttachmentAnswer, AttachmentResult } from '@/lib/attachment-test/types';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultCard } from './ResultCard';

type Phase = 'intro' | 'quiz' | 'result';

interface AttachmentTestProps {
  onBook?: () => void;
}

export function AttachmentTest({ onBook }: AttachmentTestProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AttachmentAnswer[]>([]);
  const [result, setResult] = useState<AttachmentResult | null>(null);

  const total = attachmentQuestions.length;
  const currentQuestion = attachmentQuestions[currentIndex];
  const currentAnswer =
    answers.find((a) => a.questionId === currentQuestion?.id)?.value ?? null;

  const handleAnswer = useCallback(
    (value: 1 | 2 | 3 | 4 | 5) => {
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
        return [...filtered, { questionId: currentQuestion.id, value }];
      });
    },
    [currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const res = computeAttachmentResult(answers);
      setResult(res);
      setPhase('result');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('quiz_completed', { detail: { profile: res.profile } })
        );
      }
    }
  }, [currentIndex, total, answers]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const handleStart = useCallback(() => {
    setPhase('quiz');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('quiz_started'));
    }
  }, []);

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="text-center space-y-6 max-w-xl mx-auto">
        <div className="text-6xl mb-2">🪢</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Quel est votre style d&apos;attachement ?
        </h2>
        <p className="text-white/70 text-base md:text-lg leading-relaxed">
          Un outil de découverte douce pour mieux comprendre comment vous vous connectez aux autres — et à vous-même.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80">⏱ 3 à 5 minutes</span>
          <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80">📝 16 questions</span>
          <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80">✨ Résultats immédiats</span>
        </div>
        <p className="text-white/50 text-sm italic">
          Il n&apos;y a pas de bonne ou de mauvaise réponse. Répondez en suivant votre ressenti spontané.
        </p>
        <button
          onClick={handleStart}
          className="mt-4 w-full md:w-auto px-10 py-4 bg-[#2f6b61] hover:bg-[#235249] text-white font-semibold rounded-2xl text-lg transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          Commencer le test →
        </button>
      </div>
    );
  }

  // ── RÉSULTAT ───────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <ResultCard result={result} onRestart={handleRestart} onBook={onBook} />
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  const canProceed = currentAnswer !== null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ProgressBar current={currentIndex + 1} total={total} />

      <QuestionCard
        question={currentQuestion}
        value={currentAnswer}
        onChange={handleAnswer}
        index={currentIndex + 1}
        total={total}
      />

      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
          >
            ← Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
            canProceed
              ? 'bg-[#2f6b61] hover:bg-[#235249] shadow-lg'
              : 'bg-white/10 border border-white/20 opacity-50 cursor-not-allowed'
          }`}
        >
          {currentIndex === total - 1 ? 'Voir mes résultats ✨' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
