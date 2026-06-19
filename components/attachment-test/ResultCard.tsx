'use client';

import type { AttachmentResult } from '@/lib/attachment-test/types';

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
  onBook?: () => void;
}

export function ResultCard({ result, onRestart, onBook }: ResultCardProps) {
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

      {/* Scores */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-rose-300 mb-4">Vos scores</h3>
        <ScoreBar label="Anxiété d'attachement" percent={result.anxietyPercent} color="bg-gradient-to-r from-amber-400 to-orange-400" />
        <ScoreBar label="Évitement de l'intimité" percent={result.avoidancePercent} color="bg-gradient-to-r from-sky-400 to-indigo-400" />
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

      {/* Pistes */}
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

      {/* CTA BOOKING — mis en avant */}
      <div className="bg-[#2f6b61]/80 border border-emerald-400/30 rounded-3xl p-6 md:p-8 text-center">
        <div className="text-3xl mb-3">🗓</div>
        <h3 className="text-xl font-semibold text-white mb-2">Passez à l&apos;étape suivante</h3>
        <p className="text-emerald-100 text-sm mb-5 leading-relaxed">
          Lors d&apos;une <strong>séance découverte offerte de 45 minutes</strong>, Monica vous accompagne pour identifier vos 3 actions concrètes vers des relations plus épanouissantes.
        </p>
        <button
          onClick={onBook}
          className="w-full md:w-auto rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] shadow hover:bg-emerald-50 transition"
        >
          Réserver ma séance découverte gratuite →
        </button>
      </div>

      {/* Actions secondaires */}
      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
        >
          🔄 Recommencer le test
        </button>
        <button
          onClick={handleCopy}
          className="w-full py-3.5 px-6 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
        >
          📋 Copier mes résultats
        </button>
      </div>
    </div>
  );
}
