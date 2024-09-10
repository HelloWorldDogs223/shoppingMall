'use client';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    alert('이메일 에러 발생');
  }, []);
  return <div>!이메일 에러! 다시 시도해주세요</div>;
}
