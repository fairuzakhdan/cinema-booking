import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';
import { verifyJWT } from '@/lib/server/jwt';
import { calculatePrice } from '@/lib/server/pricing';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

  try {
    const body = await req.json() as { movieId?: string; showtimeId?: string; seatIds?: string[] };
    const { movieId, showtimeId, seatIds } = body;

    if (!movieId || !showtimeId || !seatIds || seatIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const store = getStore();
    const movie = store.movies.find((m) => m.id === movieId);
    if (!movie) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });

    const showtime = movie.showtimes.find((s) => s.id === showtimeId);
    if (!showtime) return NextResponse.json({ error: 'Showtime not found' }, { status: 404 });

    const priceBreakdown = calculatePrice(seatIds, showtime.date, showtime.time, showtime.basePrice);
    return NextResponse.json({ priceBreakdown }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
