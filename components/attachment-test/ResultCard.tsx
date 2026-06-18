'use client';

import type { AttachmentResult } from '@/lib/attachment-test/types';
import Link from 'next/link';

interface ScoreBarProps {
  label: string;
  percent: number;
  color: string;
}

function ScoreBar({ label, percent, color }: ScoreBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-bold text-white">{percent}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: AttachmentResult;
  onRestart: () => void;
}

export function ResultCard({ result, onRestart }: ResultCardProps) {
  const handleCopy = () => {
    const text = `Mon style d'attachement : ${result.title}\nAnxiété : ${result.anxietyPercent}% | Évitement : ${result.avoidancePercent}%`;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header profil */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{result.title}</h2>
        <p className="text-white/80 text-base md:text-lg leading-relaxed">{result.summary}</p>
      </div>

      {/* Scores visuels */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-rose-300 mb-4">Vos scores</h3>
        <ScoreBar
          label="Anxiété d'attachement"
          percent={result.anxietyPercent}
          color="bg-gradient-to-r from-amber-400 to-orange-400"
        />
        <ScoreBar
          label="Évitement de l'intimité"
          percent={result.avoidancePercent}
          color="bg-gradient-to-r from-sky-400 to-indigo-400"
        />
      </div>

      {/* Forces */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-300 mb-4">✨ Vos forces relationnelles</h3>
        <ul className="space-y-2">
          {result.strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-white/80 text-sm">
              <span className="text-emerald-400 mt-0.5 shrink-0">▸</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Défis */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4">⚡ Points de vigilance</h3>
        <ul className="space-y-2">
          {result.challenges.map((c, i) => (
            <li key={i} className="flex gap-3 text-white/80 text-sm">
              <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Conseils */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-pink-300 mb-4">🌱 Pistes de croissance</h3>
        <ul className="space-y-2">
          {result.growthTips.map((t, i) => (
            <li key={i} className="flex gap-3 text-white/80 text-sm">
              <span className="text-pink-400 mt-0.5 shrink-0">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4">
        <p className="text-amber-200/80 text-xs leading-relaxed">
          <span className="font-semibold">⚠️ À noter : </span>
          {result.disclaimer}
        </p>
      </div>

      {/* CTA */}
      <div className="grid gap-3 md:grid-cols-3">
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          🔄 Recommencer
        </button>
        <button
          onClick={handleCopy}
          className="w-full py-4 px-6 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          📋 Copier mes résultats
        </button>
        <Link
          href="/relations"
          className="w-full py-4 px-6 rounded-2xl bg-rose-500 border border-rose-400 text-white font-medium text-center hover:bg-rose-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          💌 En savoir plus
        </Link>
      </div>
    </div>
  );
}
