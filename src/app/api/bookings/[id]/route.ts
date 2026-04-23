import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';
import { verifyJWT } from '@/lib/server/jwt';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get('auth')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

  const store = getStore();
  const booking = store.bookings.get(id);
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  if (booking.userId !== payload.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
  }

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
