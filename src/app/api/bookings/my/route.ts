import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';
import { verifyJWT } from '@/lib/server/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

  const store = getStore();
  const bookings = Array.from(store.bookings.values()).filter(
    (b) => b.userId === payload.userId
  );

  return NextResponse.json({ bookings }, { status: 200 });
}
