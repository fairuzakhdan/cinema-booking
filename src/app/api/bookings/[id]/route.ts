import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = req.cookies.get('sessionId')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const store = getStore();
  const session = store.sessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const booking = store.bookings.get(id);
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  if (booking.userId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
  }

  // Release seats
  const seatState = store.seatState[booking.showtimeId];
  if (seatState) {
    for (const seatId of booking.seatIds) {
      seatState[seatId] = 'available';
    }
  }

  booking.status = 'cancelled';
  store.bookings.set(id, booking);

  return NextResponse.json({ message: 'Booking cancelled', booking }, { status: 200 });
}
