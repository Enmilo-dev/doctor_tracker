import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@doctor-tracker/shared';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isLoginPage = pathname === '/login';

  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|signout|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
