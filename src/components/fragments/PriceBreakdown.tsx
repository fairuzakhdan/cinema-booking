'use client';

import type { PriceBreakdown } from '@/lib/types';

interface PriceBreakdownProps {
  breakdown: PriceBreakdown;
  selectedSeats: string[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export function PriceBreakdownPanel({ breakdown, selectedSeats }: PriceBreakdownProps) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-[var(--color-text)] text-sm">Rincian Harga</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--color-muted)]">
          <span>Harga dasar</span>
          <span>{formatPrice(breakdown.basePrice)}</span>
        </div>

        {breakdown.zoneAdjustment !== 0 && (
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Penyesuaian zona</span>
            <span className={breakdown.zoneAdjustment > 0 ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}>
              {breakdown.zoneAdjustment > 0 ? '+' : ''}{formatPrice(breakdown.zoneAdjustment)}
            </span>
          </div>
        )}

        {breakdown.dayMarkup > 0 && (
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Markup akhir pekan (+20%)</span>
            <span className="text-[var(--color-warning)]">+{formatPrice(breakdown.dayMarkup)}</span>
          </div>
        )}

        {breakdown.timeMarkup > 0 && (
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Markup prime time (+15%)</span>
            <span className="text-[var(--color-warning)]">+{formatPrice(breakdown.timeMarkup)}</span>
          </div>
        )}

        <div className="flex justify-between text-[var(--color-muted)]">
          <span>Jumlah kursi</span>
          <span>{selectedSeats.length} kursi</span>
        </div>

        {breakdown.groupDiscount > 0 && (
          <div className="flex justify-between text-[var(--color-success)]">
            <span>Diskon grup (4+ kursi, -10%)</span>
            <span>-{formatPrice(breakdown.groupDiscount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--color-border)] pt-3 flex justify-between items-center">
        <span className="font-semibold text-[var(--color-text)]">Total</span>
        <span className="font-bold text-lg text-[var(--color-accent)]">{formatPrice(breakdown.total)}</span>
      </div>
    </div>
  );
}
