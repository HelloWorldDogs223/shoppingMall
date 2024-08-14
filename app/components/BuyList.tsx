'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Button } from '@mui/material';

export default function BuyList({ item }: any) {
  const [requestTitle, setRequestTitle] = useState('');
  const [requestContent, setRequestContent] = useState('');
  const { accessToken } = useFetch();
  const [refundInfo, setRefundInfo] = useState([]);

  const getRefundList = async (id: number) => {
    const refundRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refunds?sliceNumber=0&sliceSize=99&purchaseItemId=${id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setRefundInfo(refundRes.data.refundList);
  };

  const getRefund = async (purchaseItemId: number) => {
    if (requestTitle === '' || requestContent === '') {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const refundRes: any = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund`,
      {
        purchaseItemId,
        requestTitle,
        requestContent,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (refundRes.data.refundId) {
      alert('환불 요청이 완료되었습니다.');
    }
  };

  useEffect(() => {
    getRefundList(item.purchaseItemId);
  }, []);

  return (
    <>
      <div>제품 이름 : {item.productName}</div>
      <div>제품 타입 : {item.productTypeName}</div>
      <div>단일 옵션 : {item.selectedSingleOption.optionName}</div>
      <div>단일 옵션 가격 : {item.selectedSingleOption.priceChangeAmount}</div>
      <div>가격 : {item.price}</div>
      <div>할인 : {item.discountAmount}</div>
      <div>할인율 : {item.discountRate}</div>
      <div>최종 상품 가격 : {item.finalPrice}</div>
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
          className="w-[480px]"
          variant="contained"
          onClick={() => getRefund(item.purchaseItemId)}
        >
          환불 요청하기
        </Button>
        <div>
          {refundInfo.map((el: any) => {
            return (
              <>
                <div>환불 가격 : {el.refundPrice}</div>
                <div>환불 진행 상태 : {el.refundState}</div>
                <div>판매자 응답 : {el.responseContent}</div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
