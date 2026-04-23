import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const store = getStore();
  const session = store.sessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const bookings = Array.from(store.bookings.values()).filter(
    (b) => b.userId === session.userId
  );

  return NextResponse.json({ bookings }, { status: 200 });
}
