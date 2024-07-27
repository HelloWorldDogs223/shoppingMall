import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refresh');

  // 로그인 페이지와 홈 경로는 인증을 확인하지 않음
  if (url.pathname.startsWith('/signin') || url.pathname === '/') {
    return NextResponse.next();
  }

  // accessToken이 없는 경우 refresh로 요청
  if (!token) {
    if (refreshToken) {
      try {
        const res: any = await axios.get(
          'https://api.group-group.com/auth/reissue',
          {
            withCredentials: true,
            headers: { Cookie: `refresh=${refreshToken.value}` },
          },
        );

        console.log(res);

        const response = NextResponse.next();
        localStorage.setItem('accessToken', res.data.accessToken);

        return response;
      } catch (e) {
        console.error('Error refreshing token:', e);
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }
    } else {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  // 인증된 경우 요청을 계속 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로를 설정합니다.
// 여기서는 모든 경로에 대해 미들웨어를 적용합니다.
export const config = {
  matcher: ['/wishlist', '/user/info', '/cart'],
};
