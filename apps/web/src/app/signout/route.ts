import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@doctor-tracker/shared';
import { safeRedirect } from '@/lib/redirect';

export function GET(request: NextRequest) {
  const next = safeRedirect(request.nextUrl.searchParams.get('next'));
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', next);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
