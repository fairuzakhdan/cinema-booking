import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isApiAuth = pathname.startsWith('/api/auth');
  if (isApiAuth) return NextResponse.next();

  const sessionId = req.cookies.get('auth')?.value;
  const isAuthPage = pathname.startsWith('/login');

  // Sudah login tapi akses /login → redirect ke /movies
  if (isAuthPage && sessionId) {
    return NextResponse.redirect(new URL('/movies', req.url));
  }

  // Belum login tapi akses halaman protected → redirect ke /login
  if (!isAuthPage && !sessionId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
