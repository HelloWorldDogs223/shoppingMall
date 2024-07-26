import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh');

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 인증된 사용자라면 다음으로 진행
    return NextResponse.next();
  } catch (error) {
    // 토큰이 유효하지 않다면 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// 특정 경로에만 미들웨어를 적용하고 싶다면
export const config = {
  matcher: ['/protected/:path*'],
};
