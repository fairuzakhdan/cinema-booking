'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { Button, Spinner } from '@/components/elements';
import { CountdownTimer, PriceBreakdownPanel } from '@/components/fragments';
import { SeatGrid } from '@/components/layouts';
import { useAppDispatch, useAppSelector, toggleSeat, startTimer, resetBooking, setPriceBreakdown, setConfirmedBookingId } from '@/stores';
import { useBookingTimer } from '@/hooks/useBookingTimer';
import { validateGapRule } from '@/lib/server/gap-rule';
import type { Seat, PriceBreakdown } from '@/lib/types';

interface SeatsPageProps {
  params: Promise<{ id: string; showtimeId: string }>;
}

export default function SeatsPage({ params }: SeatsPageProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gapViolations, setGapViolations] = useState<string[]>([]);
  const [movieId, setMovieId] = useState('');
  const [showtimeId, setShowtimeId] = useState('');

  const dispatch = useAppDispatch();
  const selectedSeats = useAppSelector((state) => state.booking.selectedSeats);
  const priceBreakdown = useAppSelector((state) => state.booking.priceBreakdown);
  const movieTitle = useAppSelector((state) => state.booking.movieTitle);
  const showtimeDate = useAppSelector((state) => state.booking.showtimeDate);
  const showtimeTime = useAppSelector((state) => state.booking.showtimeTime);
  const basePrice = useAppSelector((state) => state.booking.basePrice);

  const router = useRouter();
  const { timerSeconds, isWarning } = useBookingTimer(movieId);

  useEffect(() => {
    params.then(({ id, showtimeId: stId }) => {
      setMovieId(id);
      setShowtimeId(stId);
      fetch(`/api/movies/${id}/showtimes/${stId}/seats`)
        .then((r) => r.json() as Promise<{ seats: Seat[] }>)
        .then(({ seats }) => setSeats(seats))
        .finally(() => setLoading(false));
    });
  }, [params]);

  useEffect(() => {
    dispatch(startTimer());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seats.length === 0 || selectedSeats.length === 0) {
      setGapViolations([]);
      return;
    }
    const allSeatIds = seats.map((s) => s.id);
    const occupiedIds = seats.filter((s) => s.status === 'booked').map((s) => s.id);
    const result = validateGapRule(selectedSeats, occupiedIds, allSeatIds);
    setGapViolations(result.violatingSeats);
  }, [selectedSeats, seats]);

  const fetchPrice = useCallback(async () => {
    if (selectedSeats.length === 0 || !showtimeId || !movieId) {
      dispatch(setPriceBreakdown({ basePrice, zoneAdjustment: 0, dayMarkup: 0, timeMarkup: 0, groupDiscount: 0, totalPerSeat: [], total: 0, seatCount: 0 }));
      return;
    }
    try {
      const res = await fetch('/api/bookings/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, showtimeId, seatIds: selectedSeats }),
      });
      if (res.ok) {
        const data = await res.json() as { priceBreakdown: PriceBreakdown };
        dispatch(setPriceBreakdown(data.priceBreakdown));
      }
    } catch { /* ignore preview errors */ }
  }, [selectedSeats, showtimeId, movieId, basePrice, dispatch]);

  useEffect(() => { fetchPrice(); }, [fetchPrice]);

  const handleSeatClick = (seatId: string) => {
    setError('');
    dispatch(toggleSeat(seatId));
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) { setError('Pilih minimal 1 kursi.'); return; }
    if (gapViolations.length > 0) {
      setError(`Pemilihan kursi melanggar aturan gap. Kursi ${gapViolations.join(', ')} akan terisolasi.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, showtimeId, seatIds: selectedSeats }),
      });
      const data = await res.json() as { booking?: { id: string }; error?: string };
      if (!res.ok) { setError(data.error ?? 'Gagal membuat pemesanan.'); return; }
      if (data.booking) {
        dispatch(setConfirmedBookingId(data.booking.id));
        router.push('/booking/confirm');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    dispatch(resetBooking());
    router.back();
  };

  const displayedSeats: Seat[] = seats.map((s) =>
    selectedSeats.includes(s.id) ? { ...s, status: 'selected' } : s
  );

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <FiArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="font-bold text-[var(--color-text)]">{movieTitle}</h1>
            <p className="text-xs text-[var(--color-muted)]">{showtimeDate} · {showtimeTime}</p>
          </div>
        </div>
        <CountdownTimer seconds={timerSeconds} isWarning={isWarning} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5">
          <SeatGrid
            seats={displayedSeats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            gapViolations={gapViolations}
          />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-400 flex items-start gap-2">
              <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
          {gapViolations.length > 0 && !error && (
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-4 py-3 text-sm text-yellow-400 flex items-start gap-2">
              <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              Kursi {gapViolations.join(', ')} akan terisolasi. Pilih kursi lain untuk menghindari gap.
            </div>
          )}
          {priceBreakdown && selectedSeats.length > 0 && (
            <PriceBreakdownPanel breakdown={priceBreakdown} selectedSeats={selectedSeats} />
          )}
          <Button fullWidth size="lg" onClick={handleProceed} loading={submitting} disabled={selectedSeats.length === 0 || gapViolations.length > 0}>
            Lanjutkan ({selectedSeats.length} kursi)
          </Button>
        </div>
      </div>
    </div>
  );
}
