'use client';

import { FiCalendar, FiClock, FiMapPin, FiTag, FiTrash2 } from 'react-icons/fi';
import { Badge } from '@/components/elements';
import { Button } from '@/components/elements';
import type { Booking } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export function BookingCard({ booking, onCancel, cancelling }: BookingCardProps) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[var(--color-text)]">{booking.movieTitle}</h3>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">#{booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge variant={booking.status === 'active' ? 'success' : 'danger'}>
          {booking.status === 'active' ? 'Aktif' : 'Dibatalkan'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--color-muted)]">
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

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
        <span className="font-bold text-[var(--color-accent)]">{formatPrice(booking.totalPrice)}</span>
        {booking.status === 'active' && onCancel && (
          <Button
            variant="danger"
            size="sm"
            loading={cancelling}
            onClick={() => onCancel(booking.id)}
          >
            <FiTrash2 size={14} />
            Batalkan
          </Button>
        )}
      </div>
    </div>
  );
}
