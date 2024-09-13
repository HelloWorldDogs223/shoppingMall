'use client';

import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  const { accessToken } = useManagerFetch();

  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen gap-4">
      <Button
        variant="contained"
        onClick={() => router.push('/manager/create')}
      >
        관리자 계정 만들러 가기
      </Button>
      <Button variant="contained" onClick={() => router.push('/manager/tags')}>
        태그 추가/수정/삭제하러 가기
      </Button>
      <Button
        variant="contained"
        onClick={() => router.push('/manager/ban-list')}
      >
        제품 신고 리스트
      </Button>
      <Button
        variant="contained"
        onClick={() => router.push('/manager/ban-review-list')}
      >
        리뷰 신고 리스트
      </Button>
      <Button
        variant="contained"
        onClick={() => router.push('/manager/on-off')}
      >
        관리자모드 ON / OFF
      </Button>
    </div>
  );
}
