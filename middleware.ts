// middleware.ts
import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refresh');

  // 로그인 페이지와 홈 경로는 인증을 확인하지 않음
  if (url.pathname.startsWith('/signin') || url.pathname.startsWith('/')) {
    return NextResponse.next();
  }

  // accessToken이 없는 경우 refresh로 요청
  if (!token) {
    if (refreshToken) {
      try {
        const res: any = await axios.get(
          'https://api.group-group.com/auth/reissue',
          { withCredentials: true },
        );
        document.cookie = `accessToken=${res.data.accessToken}`;
      } catch (e) {
        // refresh 토큰이 만료거나 올바르지 않은 경우
        url.pathname = '/signin';
        console.log(e);
      }
    } else {
      // refresh 토큰이 아예 없는 경우
      url.pathname = '/signin';
    }
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
