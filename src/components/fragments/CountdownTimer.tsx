'use client';

import { FiClock, FiAlertTriangle } from 'react-icons/fi';

interface CountdownTimerProps {
  seconds: number;
  isWarning: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function CountdownTimer({ seconds, isWarning }: CountdownTimerProps) {
  return (
    <div
      className={[
        'flex items-center gap-2 px-4 py-2 rounded-lg border font-mono font-semibold text-sm transition-colors',
        isWarning
          ? 'bg-red-900/30 border-red-700/50 text-[var(--color-primary)] animate-pulse-warning'
          : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]',
      ].join(' ')}
    >
      {isWarning ? <FiAlertTriangle size={16} /> : <FiClock size={16} />}
      <span>{formatTime(seconds)}</span>
    </div>
  );
}
