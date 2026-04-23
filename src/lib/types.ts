export type SeatStatus = 'available' | 'booked' | 'selected';
export type SeatZone = 'premium' | 'regular' | 'economy';
export type BookingStatus = 'active' | 'cancelled';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarPlaceholder: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Showtime {
  id: string;
  date: string;
  time: string;
  studioId: string;
  basePrice: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  synopsis: string;
  rating: string;
  posterPlaceholder: string;
  showtimes: Showtime[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}

export interface StudioLayout {
  rows: number;
  seatsPerRow: number;
  seats: Seat[];
}

export interface PriceBreakdown {
  basePrice: number;
  zoneAdjustment: number;
  dayMarkup: number;
  timeMarkup: number;
  groupDiscount: number;
  totalPerSeat: number[];
  total: number;
  seatCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  showtimeId: string;
  showtimeDate: string;
  showtimeTime: string;
  studioId: string;
  seatIds: string[];
  priceBreakdown: PriceBreakdown;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface ServerSession {
  sessionId: string;
  userId: string;
  expiresAt: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
