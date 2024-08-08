'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const params = useParams();
  useEffect(() => {
    const productRes: any = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/searchWord=${params.keyword}&sliceSize=10&sliceNumber=2&filterType=HIGH_PRICE`,
    );
    console.log(productRes.data);
  }, []);
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      "앗, 검색 키워드를 입력해주세요!"
    </div>
  );
}
