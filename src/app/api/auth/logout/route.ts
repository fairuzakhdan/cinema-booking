import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value;
  if (sessionId) {
    const store = getStore();
    store.sessions.delete(sessionId);
  }
  const res = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  res.cookies.set('sessionId', '', { maxAge: 0, path: '/' });
  return res;
}
