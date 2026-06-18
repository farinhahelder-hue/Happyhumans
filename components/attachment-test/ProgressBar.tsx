'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current} sur ${total}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-rose-300 font-medium">
          {current} / {total}
        </span>
        <span className="text-sm text-rose-300">{percent}%</span>
      </div>
      <div className="w-full bg-rose-100/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
