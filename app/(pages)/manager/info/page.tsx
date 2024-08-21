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
    <div className="flex justify-center items-center w-full h-screen">
      <Button
        variant="contained"
        onClick={() => router.push('/manager/create')}
      >
        관리자 계정 만들러 가기
      </Button>
    </div>
  );
}
