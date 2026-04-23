import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value;
  if (!sessionId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const store = getStore();
  const session = store.sessions.get(sessionId);

  if (!session || session.expiresAt < Date.now()) {
    if (session) store.sessions.delete(sessionId);
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const user = store.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  const { password: _pw, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 200 });
}
