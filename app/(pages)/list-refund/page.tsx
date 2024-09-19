'use client';

import RefundList from '@/app/components/RefundList';
import { useFetch } from '@/app/hooks/useFetch';
import apiClient from '@/app/utils/axiosSetting';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState([]);

  const { accessToken } = useFetch();

  const getRefundData = async () => {
    const refundRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/product/refunds?sliceNumber=0&sliceSize=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setData(refundRes.data.refundedPurchaseItemList);
  };

  useEffect(() => {
    getRefundData();
  }, []);

  return (
    <div>
      <div>환불요청이 들어온 아이템들</div>
      {data.map((el: any) => {
        return <RefundList el={el} />;
      })}
    </div>
  );
}
