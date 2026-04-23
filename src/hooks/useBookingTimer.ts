'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, decrementTimer, resetBooking, stopTimer } from '@/stores';

export function useBookingTimer(movieId: string | null) {
  const dispatch = useAppDispatch();
  const timerActive = useAppSelector((state) => state.booking.timerActive);
  const timerSeconds = useAppSelector((state) => state.booking.timerSeconds);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!timerActive) return;

    intervalRef.current = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, dispatch]);

  useEffect(() => {
    if (timerActive && timerSeconds === 0) {
      dispatch(stopTimer());
      dispatch(resetBooking());
      router.push(movieId ? `/movies/${movieId}` : '/movies');
    }
  }, [timerSeconds, timerActive, movieId, router, dispatch]);

  return { timerSeconds, isWarning: timerSeconds <= 60 && timerActive };
}
