import { NextRequest, NextResponse } from 'next/server';
import { getStore, getStudioLayout } from '@/lib/server/data-store';
import type { Seat } from '@/lib/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; showtimeId: string }> }
) {
  const { id, showtimeId } = await params;
  const store = getStore();

  const movie = store.movies.find((m) => m.id === id);
  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }

  const showtime = movie.showtimes.find((s) => s.id === showtimeId);
  if (!showtime) {
    return NextResponse.json({ error: 'Showtime not found' }, { status: 404 });
  }

  const layout = getStudioLayout(showtime.studioId);
  if (!layout) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 });
  }

  const seatState = store.seatState[showtimeId] ?? {};

  const seats: Seat[] = layout.seats.map((seat) => ({
    ...seat,
    status: seatState[seat.id] ?? seat.status,
  }));

  return NextResponse.json(
    { seats, rows: layout.rows, seatsPerRow: layout.seatsPerRow, studioId: showtime.studioId },
    { status: 200 }
  );
}
