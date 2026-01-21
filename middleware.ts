import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth/edge-jwt';

const ADMIN_LOGIN_PATH = '/admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminSection = pathname.startsWith('/admin');

  if (!isAdminSection) {
    return NextResponse.next();
  }

  const isLoginPath = pathname.startsWith(ADMIN_LOGIN_PATH);
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return isLoginPath ? NextResponse.next() : redirectToLogin(request);
  }

  try {
    const payload = await verifyAdminToken(token);

    if (payload.type !== 'admin') {
      return redirectToLogin(request);
    }

    if (isLoginPath) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
