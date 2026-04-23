import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { username?: string; password?: string };
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const store = getStore();
    const user = store.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const sessionId = randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
    store.sessions.set(sessionId, { sessionId, userId: user.id, expiresAt });

    const { password: _pw, ...safeUser } = user;

    const res = NextResponse.json({ user: safeUser }, { status: 200 });
    res.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
