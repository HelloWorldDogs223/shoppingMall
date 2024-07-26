import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

// 모든 경로에 대해 미들웨어 적용
export const config = {
  matcher: ['/((?!login|_next/static|favicon.ico).*)'],
};
