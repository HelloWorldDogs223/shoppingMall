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

    const refundRes: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund`,
      {
        purchaseItemId,
        requestTitle,
        requestContent,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    console.log(refundRes);

    if (refundRes.data.refundId) {
      alert('환불 요청이 완료되었습니다.');
    }
  };

  useEffect(() => {
    getList();
  }, [accessToken]);

  return (
    <div>
      {list.map((el: any) => {
        return (
          <div className="pl-[100px] flex flex-col gap-4">
            <div>구매 ID : {el.purchaseId}</div>
            <div>구매 상태 : {el.state}</div>
            <div>구매 제목 : {el.purchaseTitle}</div>
            <div>최종 가격 : {el.totalPrice}</div>
            <div>시간 : {el.dateTime}</div>
            <div>
              {el.purchaseItems.map((item: any) => {
                return (
                  <>
                    <div>제품 이름 : {item.productName}</div>
                    <div>제품 타입 : {item.productTypeName}</div>
                    <div>
                      단일 옵션 : {item.selectedSingleOption.optionName}
                    </div>
                    <div>
                      단일 옵션 가격 :{' '}
                      {item.selectedSingleOption.priceChangeAmount}
                    </div>
                    <div>가격 : {item.price}</div>
                    <div>할인 : {item.discountAmount}</div>
                    <div>할인율 : {item.discountRate}</div>
                    <div>최종 가격 : {item.finalPrice}</div>
                    <div>환불여부 : {item.isRefund}</div>
                    <div className="flex flex-col gap-4">
                      <input
                        className="w-[480px] border-solid border border-red-500"
                        placeholder="환불 요청 제목"
                        value={requestTitle}
                        onChange={(e) => setRequestTitle(e.target.value)}
                      />
                      <textarea
                        className="w-[480px] border-solid border border-red-500 resize-none"
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
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
