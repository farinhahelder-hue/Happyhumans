'use client';

import type { AttachmentQuestion } from '@/lib/attachment-test/types';

const LIKERT_LABELS: Record<number, string> = {
  1: 'Pas du tout',
  2: 'Plutôt non',
  3: 'Neutre',
  4: 'Plutôt oui',
  5: 'Tout à fait',
};

interface QuestionCardProps {
  question: AttachmentQuestion;
  value: number | null;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  index: number;
  total: number;
}

export function QuestionCard({
  question,
  value,
  onChange,
  index,
  total,
}: QuestionCardProps) {
  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-white/20"
      role="group"
      aria-labelledby={`question-${question.id}-label`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-rose-300 mb-3">
        Question {index} sur {total}
      </p>

      <p
        id={`question-${question.id}-label`}
        className="text-lg md:text-xl font-medium text-white leading-relaxed mb-8"
      >
        {question.text}
      </p>

      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {([1, 2, 3, 4, 5] as const).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            aria-label={`${v} — ${LIKERT_LABELS[v]}`}
            className={`
              flex flex-col items-center gap-1 p-3 md:p-4 rounded-2xl border-2 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2
              ${
                value === v
                  ? 'bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/30 scale-105'
                  : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40 active:scale-95'
              }
            `}
          >
            <span className="text-xl md:text-2xl font-bold text-white">{v}</span>
            <span className="text-[10px] md:text-xs text-white/70 text-center leading-tight">
              {LIKERT_LABELS[v]}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-white/40 mt-4">
        1 = Pas du tout d'accord · 5 = Tout à fait d'accord
      </p>
    </div>
  );
}
