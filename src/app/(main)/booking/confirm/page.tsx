'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Button, Spinner } from '@/components/elements';
import { BookingConfirmPanel } from '@/components/layouts';
import { useAppDispatch, useAppSelector, resetBooking } from '@/stores';
import type { Booking } from '@/lib/types';

export default function BookingConfirmPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const confirmedBookingId = useAppSelector((state) => state.booking.confirmedBookingId);
  const movieId = useAppSelector((state) => state.booking.movieId);

  useEffect(() => {
    if (!confirmedBookingId) {
      router.replace('/movies');
      return;
    }
    fetch('/api/bookings/my')
      .then((r) => r.json() as Promise<{ bookings: Booking[] }>)
      .then(({ bookings }) => {
        const found = bookings.find((b) => b.id === confirmedBookingId);
        if (found) setBooking(found);
        else router.replace('/movies');
      })
      .finally(() => setLoading(false));
  }, [confirmedBookingId, router]);

  const handleConfirm = () => {
    setConfirmed(true);
    dispatch(resetBooking());
    router.push('/bookings');
  };

  const handleCancel = async () => {
    if (!booking) return;
    await fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' });
    dispatch(resetBooking());
    router.push(movieId ? `/movies/${movieId}` : '/movies');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!booking) return null;

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
          <FiCheckCircle size={32} className="text-[var(--color-success)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Pemesanan Berhasil!</h2>
        <p className="text-[var(--color-muted)] text-sm">Tiket kamu sudah tersimpan di halaman Tiket Saya.</p>
        <Button onClick={() => router.push('/bookings')}>Lihat Tiket Saya</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <FiArrowLeft size={16} />
        </Button>
        <h1 className="font-bold text-[var(--color-text)] text-lg">Konfirmasi Pemesanan</h1>
      </div>
      <BookingConfirmPanel booking={booking} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}
