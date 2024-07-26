// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('token');

  // 로그인 페이지와 API 경로는 인증을 확인하지 않음
  if (
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/api/public')
  ) {
    return NextResponse.next();
  }

  // 토큰이 없는 경우 로그인 페이지로 리디렉션
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 인증된 경우 요청을 계속 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로를 설정합니다.
// 여기서는 모든 경로에 대해 미들웨어를 적용합니다.
export const config = {
  matcher: '/:path*',
};
