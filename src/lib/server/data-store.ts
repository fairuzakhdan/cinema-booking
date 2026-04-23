import type { Movie, UserWithPassword, Booking, StudioLayout } from '@/lib/types';
import moviesData from '@/data/movies.json';
import usersData from '@/data/users.json';
import seatsData from '@/data/seats.json';

interface SeatStateMap {
  [showtimeId: string]: {
    [seatId: string]: 'available' | 'booked';
  };
}

interface ServerStore {
  users: UserWithPassword[];
  movies: Movie[];
  seatState: SeatStateMap;
  bookings: Map<string, Booking>;
}

declare global {
  // eslint-disable-next-line no-var
  var __cinemaStore: ServerStore | undefined;
}

function initSeatState(): SeatStateMap {
  const state: SeatStateMap = {};
  const studios = seatsData as Record<string, StudioLayout>;
  const movies = moviesData as Movie[];
  for (const movie of movies) {
    for (const showtime of movie.showtimes) {
      const studio = studios[showtime.studioId];
      if (!studio) continue;
      state[showtime.id] = {};
      for (const seat of studio.seats) {
        state[showtime.id][seat.id] = seat.status as 'available' | 'booked';
      }
    }
  }
  return state;
}

export function getStore(): ServerStore {
  if (!globalThis.__cinemaStore) {
    globalThis.__cinemaStore = {
      users: usersData as UserWithPassword[],
      movies: moviesData as Movie[],
      seatState: initSeatState(),
      bookings: new Map(),
    };
  }
  return globalThis.__cinemaStore;
}

export function getStudioLayout(studioId: string): StudioLayout | null {
  const studios = seatsData as Record<string, StudioLayout>;
  return studios[studioId] ?? null;
}
