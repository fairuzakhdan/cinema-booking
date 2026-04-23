import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';
import { calculatePrice } from '@/lib/server/pricing';
import { validateGapRule } from '@/lib/server/gap-rule';
import { randomUUID } from 'crypto';
import type { Booking } from '@/lib/types';

function getAuthUser(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value;
  if (!sessionId) return null;
  const store = getStore();
  const session = store.sessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) return null;
  return store.users.find((u) => u.id === session.userId) ?? null;
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json() as {
      movieId?: string;
      showtimeId?: string;
      seatIds?: string[];
    };
    const { movieId, showtimeId, seatIds } = body;

    if (!movieId || !showtimeId || !seatIds || seatIds.length === 0) {
      return NextResponse.json({ error: 'movieId, showtimeId, and seatIds are required' }, { status: 400 });
    }

    const store = getStore();
    const movie = store.movies.find((m) => m.id === movieId);
    if (!movie) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });

    const showtime = movie.showtimes.find((s) => s.id === showtimeId);
    if (!showtime) return NextResponse.json({ error: 'Showtime not found' }, { status: 404 });

    const seatState = store.seatState[showtimeId];
    if (!seatState) return NextResponse.json({ error: 'Seat state not found' }, { status: 404 });

    // Check availability
    for (const seatId of seatIds) {
      if (seatState[seatId] !== 'available') {
        return NextResponse.json({ error: `Seat ${seatId} is not available` }, { status: 400 });
      }
    }

    // Validate gap rule
    const allSeatIds = Object.keys(seatState);
    const occupiedSeatIds = allSeatIds.filter((id) => seatState[id] === 'booked');
    const gapResult = validateGapRule(seatIds, occupiedSeatIds, allSeatIds);
    if (!gapResult.valid) {
      return NextResponse.json({
        error: `Pemilihan kursi melanggar aturan gap. Kursi ${gapResult.violatingSeats.join(', ')} akan terisolasi sendirian.`,
        violatingSeats: gapResult.violatingSeats,
      }, { status: 400 });
    }

    // Calculate price
    const priceBreakdown = calculatePrice(seatIds, showtime.date, showtime.time, showtime.basePrice);

    // Mark seats as booked
    for (const seatId of seatIds) {
      seatState[seatId] = 'booked';
    }

    const booking: Booking = {
      id: randomUUID(),
      userId: user.id,
      movieId,
      movieTitle: movie.title,
      showtimeId,
      showtimeDate: showtime.date,
      showtimeTime: showtime.time,
      studioId: showtime.studioId,
      seatIds,
      priceBreakdown,
      totalPrice: priceBreakdown.total,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    store.bookings.set(booking.id, booking);

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
