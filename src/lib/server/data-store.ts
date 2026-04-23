import type { Movie, UserWithPassword, Seat, Booking, ServerSession, StudioLayout } from '@/lib/types';
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
  sessions: Map<string, ServerSession>;
  bookings: Map<string, Booking>;
}

let store: ServerStore | null = null;

function initSeatState(): SeatStateMap {
  const state: SeatStateMap = {};
  const studios = seatsData as Record<string, StudioLayout>;

  // For each movie showtime, clone the studio's initial seat state
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
  if (!store) {
    store = {
      users: usersData as UserWithPassword[],
      movies: moviesData as Movie[],
      seatState: initSeatState(),
      sessions: new Map(),
      bookings: new Map(),
    };
  }
  return store;
}

export function getStudioLayout(studioId: string): StudioLayout | null {
  const studios = seatsData as Record<string, StudioLayout>;
  return studios[studioId] ?? null;
}
