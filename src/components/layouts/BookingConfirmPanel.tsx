'use client';

import { FiFilm, FiCalendar, FiClock, FiMapPin, FiTag } from 'react-icons/fi';
import { PriceBreakdownPanel } from '@/components/fragments';
import { Button } from '@/components/elements';
import type { Booking } from '@/lib/types';

interface BookingConfirmPanelProps {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function BookingConfirmPanel({ booking, onConfirm, onCancel, loading }: BookingConfirmPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-[var(--color-text)] flex items-center gap-2">
          <FiFilm size={18} className="text-[var(--color-primary)]" />
          {booking.movieTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span>{formatDate(booking.showtimeDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock size={14} />
            <span>{booking.showtimeTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin size={14} />
            <span>Studio {booking.studioId.replace('studio-', '')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiTag size={14} />
            <span>{booking.seatIds.join(', ')}</span>
          </div>
        </div>
      </div>

      <PriceBreakdownPanel breakdown={booking.priceBreakdown} selectedSeats={booking.seatIds} />

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" fullWidth onClick={onConfirm} loading={loading}>
          Konfirmasi Pemesanan
        </Button>
      </div>
    </div>
  );
}
