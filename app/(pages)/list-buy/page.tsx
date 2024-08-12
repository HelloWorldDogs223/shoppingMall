'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const { accessToken } = useFetch();
  const [list, setList] = useState([]);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestContent, setRequestContent] = useState('');

  const getList = async () => {
    const listRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchases?sliceNumber=0&sliceSize=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setList(listRes.data.purchaseList);
  };

  const getRefund = (purchaseItemId: number) => {
    if (requestTitle === '' || requestContent === '') {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const refundRes: any = axios.post(`${process.env.SERVER_DOMAIN}/refund`, {
      purchaseItemId,
      requestTitle,
      requestContent,
    });
    if (refundRes.data.refundId) {
      alert('환불 요청이 완료되었습니다.');
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      {list.map((el: any) => {
        return (
          <>
            <div>{el.purchaseId}</div>
            <div>{el.state}</div>
            <div>{el.purchaseTitle}</div>
            <div>{el.totalPrice}</div>
            <div>{el.dateTime}</div>
            <div>
              {el.purchaseItems.map((item: any) => {
                return (
                  <>
                    <div>{item.productName}</div>
                    <div>{item.productTypeName}</div>
                    <div>{item.selectedSingleOption.optionName}</div>
                    <div>{item.selectedSingleOption.priceChangeAmount}</div>
                    <div>{item.price}</div>
                    <div>{item.discountAmount}</div>
                    <div>{item.discountRate}</div>
                    <div>{item.finalPrice}</div>
                    <div>{item.isRefund}</div>
                    <input
                      placeholder="환불 요청 제목"
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                    />
                    <textarea
                      value={requestContent}
                      placeholder="환불 요청 내용"
                      onChange={(e) => setRequestContent(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={() => getRefund(el.purchaseId)}
                    >
                      환불 요청하기
                    </Button>
                  </>
                );
              })}
            </div>
          </>
        );
      })}
    </div>
  );
}