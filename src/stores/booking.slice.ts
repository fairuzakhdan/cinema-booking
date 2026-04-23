import type { PriceBreakdown } from '@/lib/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: BookingState = {
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
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setShowtime(state, action: PayloadAction<{
      movieId: string;
      movieTitle: string;
      showtimeId: string;
      showtimeDate: string;
      showtimeTime: string;
      basePrice: number;
    }>) {
      state.movieId = action.payload.movieId;
      state.movieTitle = action.payload.movieTitle;
      state.showtimeId = action.payload.showtimeId;
      state.showtimeDate = action.payload.showtimeDate;
      state.showtimeTime = action.payload.showtimeTime;
      state.basePrice = action.payload.basePrice;
      state.selectedSeats = [];
      state.timerSeconds = 300;
      state.timerActive = false;
      state.priceBreakdown = null;
    },
    toggleSeat(state, action: PayloadAction<string>) {
      const seatId = action.payload;
      const idx = state.selectedSeats.indexOf(seatId);
      if (idx === -1) {
        state.selectedSeats.push(seatId);
      } else {
        state.selectedSeats.splice(idx, 1);
      }
    },
    startTimer(state) {
      state.timerActive = true;
      state.timerSeconds = 300;
    },
    decrementTimer(state) {
      if (state.timerSeconds > 0) state.timerSeconds -= 1;
    },
    stopTimer(state) {
      state.timerActive = false;
    },
    resetBooking(state) {
      state.selectedSeats = [];
      state.timerSeconds = 300;
      state.timerActive = false;
      state.priceBreakdown = null;
    },
    setPriceBreakdown(state, action: PayloadAction<PriceBreakdown>) {
      state.priceBreakdown = action.payload;
    },
    setConfirmedBookingId(state, action: PayloadAction<string>) {
      state.confirmedBookingId = action.payload;
    },
  },
});

export const {
  setShowtime, toggleSeat, startTimer, decrementTimer,
  stopTimer, resetBooking, setPriceBreakdown, setConfirmedBookingId,
} = bookingSlice.actions;
export default bookingSlice.reducer;
