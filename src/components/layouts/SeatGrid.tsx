'use client';

import { SeatButton } from '@/components/fragments';
import type { Seat } from '@/lib/types';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
  gapViolations?: string[];
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function getZoneLabel(row: string) {
  if (['A', 'B'].includes(row)) return 'Premium (+30%)';
  if (['G', 'H'].includes(row)) return 'Economy (-20%)';
  return null;
}

export function SeatGrid({ seats, selectedSeats, onSeatClick, gapViolations = [] }: SeatGridProps) {
  const seatMap: Record<string, Seat> = {};
  for (const seat of seats) seatMap[seat.id] = seat;

  const rows = ROWS.filter((row) => seats.some((s) => s.row === row));

  return (
    <div className="space-y-4">
      {/* Screen indicator */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent rounded-full opacity-60" />
        <p className="text-xs text-[var(--color-muted)] tracking-widest uppercase">Layar</p>
      </div>

      {/* Seat rows */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {rows.map((row) => {
            const rowSeats = seats.filter((s) => s.row === row).sort((a, b) => a.number - b.number);
            const zoneLabel = getZoneLabel(row);

            return (
              <div key={row} className="flex items-center gap-2 mb-2">
                <div className="w-8 text-center">
                  <span className="text-xs font-bold text-[var(--color-muted)]">{row}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isViolating = gapViolations.includes(seat.id);
                    const status = isSelected ? 'selected' : seat.status;
                    return (
                      <div key={seat.id} className="relative">
                        <SeatButton
                          seatId={seat.id}
                          status={status}
                          onClick={onSeatClick}
                        />
                        {isViolating && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {zoneLabel && (
                  <span className="text-xs text-[var(--color-muted)] whitespace-nowrap hidden sm:inline">
                    {zoneLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--color-border)]">
        {[
          { color: 'bg-[var(--color-seat-available)]', label: 'Tersedia' },
          { color: 'bg-[var(--color-seat-selected)]', label: 'Dipilih' },
          { color: 'bg-[var(--color-seat-booked)] opacity-60', label: 'Terisi' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span className={`w-5 h-5 rounded-t-md border border-[var(--color-border)] ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
