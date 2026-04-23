'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/stores/booking.store';

export function useBookingTimer(movieId: string | null) {
  const { timerActive, timerSeconds, decrementTimer, resetBooking, stopTimer } = useBookingStore();
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!timerActive) return;

    intervalRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, decrementTimer]);

  useEffect(() => {
    if (timerActive && timerSeconds === 0) {
      stopTimer();
      resetBooking();
      if (movieId) {
        router.push(`/movies/${movieId}`);
      } else {
        router.push('/movies');
      }
    }
  }, [timerSeconds, timerActive, movieId, router, resetBooking, stopTimer]);

  return { timerSeconds, isWarning: timerSeconds <= 60 && timerActive };
}
