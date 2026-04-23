'use client';

import type { SeatStatus } from '@/lib/types';

interface SeatButtonProps {
  seatId: string;
  status: SeatStatus;
  onClick: (seatId: string) => void;
  disabled?: boolean;
}

const statusClasses: Record<SeatStatus, string> = {
  available: 'bg-[var(--color-seat-available)] border-blue-700/50 hover:bg-blue-700 hover:border-blue-500 cursor-pointer text-blue-200',
  booked: 'bg-[var(--color-seat-booked)] border-red-900/50 cursor-not-allowed text-red-900 opacity-60',
  selected: 'bg-[var(--color-seat-selected)] border-red-400 cursor-pointer text-white shadow-md shadow-red-500/30',
};

export function SeatButton({ seatId, status, onClick, disabled }: SeatButtonProps) {
  const isClickable = status !== 'booked' && !disabled;

  return (
    <button
      onClick={() => isClickable && onClick(seatId)}
      disabled={!isClickable}
      title={`Kursi ${seatId} - ${status === 'booked' ? 'Terisi' : status === 'selected' ? 'Dipilih' : 'Tersedia'}`}
      className={[
        'w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg border text-xs font-medium transition-all duration-150 flex items-center justify-center',
        statusClasses[status],
      ].join(' ')}
    >
      {seatId.slice(1)}
    </button>
  );
}
