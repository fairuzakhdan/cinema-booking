'use client';

import { FiCalendar, FiClock } from 'react-icons/fi';
import { Button } from '@/components/elements';
import type { Showtime } from '@/lib/types';

interface ShowtimeCardProps {
  showtime: Showtime;
  movieId: string;
  movieTitle: string;
  onSelect: (showtime: Showtime) => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export function ShowtimeCard({ showtime, onSelect }: ShowtimeCardProps) {
  const date = new Date(showtime.date);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const [hours] = showtime.time.split(':').map(Number);
  const isPrime = hours !== undefined && hours >= 17 && hours <= 21;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--color-primary)]/40 transition-colors">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <FiCalendar size={14} />
          <span>{formatDate(showtime.date)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[var(--color-text)] font-semibold text-lg">
            <FiClock size={16} className="text-[var(--color-accent)]" />
            {showtime.time}
          </div>
          <div className="flex gap-1.5">
            {isWeekend && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                Weekend
              </span>
            )}
            {isPrime && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                Prime Time
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)]">Studio {showtime.studioId.replace('studio-', '')}</p>
      </div>

      <div className="flex flex-col sm:items-end gap-2">
        <p className="text-[var(--color-accent)] font-semibold">{formatPrice(showtime.basePrice)}</p>
        <Button size="sm" onClick={() => onSelect(showtime)}>
          Pilih Kursi
        </Button>
      </div>
    </div>
  );
}
