import { create } from 'zustand';
import type { PriceBreakdown } from '@/lib/types';

interface BookingState {
  movieId: string | null;
  movieTitle: string | null;
  showtimeId: string | null;
  showtimeDate: string | null;
  showtimeTime: string | null;
  basePrice: number;
  selectedSeats: string[];
  timerSeconds: number;
  timerActive: boolean;
  priceBreakdown: PriceBreakdown | null;
  confirmedBookingId: string | null;

  setShowtime: (params: {
    movieId: string;
    movieTitle: string;
    showtimeId: string;
    showtimeDate: string;
    showtimeTime: string;
    basePrice: number;
  }) => void;
  toggleSeat: (seatId: string) => void;
  startTimer: () => void;
  decrementTimer: () => void;
  stopTimer: () => void;
  resetBooking: () => void;
  setPriceBreakdown: (breakdown: PriceBreakdown) => void;
  setConfirmedBookingId: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  movieId: null,
  movieTitle: null,
  showtimeId: null,
  showtimeDate: null,
  showtimeTime: null,
  basePrice: 0,
  selectedSeats: [],
  timerSeconds: 300,
  timerActive: false,
  priceBreakdown: null,
  confirmedBookingId: null,

  setShowtime: (params) =>
    set({
      movieId: params.movieId,
      movieTitle: params.movieTitle,
      showtimeId: params.showtimeId,
      showtimeDate: params.showtimeDate,
      showtimeTime: params.showtimeTime,
      basePrice: params.basePrice,
      selectedSeats: [],
      timerSeconds: 300,
      timerActive: false,
      priceBreakdown: null,
    }),

  toggleSeat: (seatId) =>
    set((state) => {
      const exists = state.selectedSeats.includes(seatId);
      return {
        selectedSeats: exists
          ? state.selectedSeats.filter((s) => s !== seatId)
          : [...state.selectedSeats, seatId],
      };
    }),

  startTimer: () => set({ timerActive: true, timerSeconds: 300 }),
  decrementTimer: () =>
    set((state) => ({ timerSeconds: Math.max(0, state.timerSeconds - 1) })),
  stopTimer: () => set({ timerActive: false }),

  resetBooking: () =>
    set({
      selectedSeats: [],
      timerSeconds: 300,
      timerActive: false,
      priceBreakdown: null,
    }),

  setPriceBreakdown: (breakdown) => set({ priceBreakdown: breakdown }),
  setConfirmedBookingId: (id) => set({ confirmedBookingId: id }),
}));
