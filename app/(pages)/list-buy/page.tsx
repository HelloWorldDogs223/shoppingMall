'use client';

import BuyList from '@/app/components/BuyList';
import { useFetch } from '@/app/hooks/useFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const { accessToken } = useFetch();
  const [list, setList] = useState([]);

  const getList = async () => {
    const listRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchases?sliceNumber=0&sliceSize=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setList(listRes.data.purchaseList);
  };

  useEffect(() => {
    getList();
  }, [accessToken]);

  return (
    <div className="flex flex-col gap-8">
      {list.map((el: any) => {
        return (
          <div className="pl-[100px] flex flex-col gap-4 pt-[100px]">
            <div>구매 ID : {el.purchaseId}</div>
            <div>구매 상태 : {el.state}</div>
            <div>구매 제목 : {el.purchaseTitle}</div>
            <div>최종 구매 가격 : {el.totalPrice}</div>
            <div>시간 : {el.dateTime}</div>
            <div>
              {el.purchaseItems.map((item: any) => {
                return <BuyList item={item} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
