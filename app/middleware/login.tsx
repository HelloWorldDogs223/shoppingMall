// middleware.ts
// 미들웨어에사 ㅇ청
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export async function middleware(req: NextRequest) {
  const res: any = await axios.get('https://api.group-group.com/auth/reissue');
  document.cookie = `access=${res.data.accessToken}`;

  console.log('MIDDLEWARES');
}

// 특정 경로에만 미들웨어를 적용하고 싶다면
export const config = {
  matcher: ['/protected/:path*'],
};
