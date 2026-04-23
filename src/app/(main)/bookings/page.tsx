'use client';

import { useEffect, useState } from 'react';
import { FiBookmark, FiRefreshCw } from 'react-icons/fi';
import { Button, Spinner } from '@/components/elements';
import { BookingCard } from '@/components/fragments';
import type { Booking } from '@/lib/types';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/my');
      const data = await res.json() as { bookings: Booking[] };
      setBookings(data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      await fetchBookings();
    } finally {
      setCancellingId(null);
    }
  };

  const active = bookings.filter((b) => b.status === 'active');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center">
            <FiBookmark size={20} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Tiket Saya</h1>
            <p className="text-sm text-[var(--color-muted)]">{active.length} tiket aktif</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchBookings} disabled={loading}>
          <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-muted)]">
          <FiBookmark size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Belum ada pemesanan</p>
          <p className="text-sm mt-1">Pesan tiket film favoritmu sekarang</p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider">Aktif</h2>
              {active.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                  cancelling={cancellingId === b.id}
                />
              ))}
            </div>
          )}
          {cancelled.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider">Dibatalkan</h2>
              {cancelled.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
