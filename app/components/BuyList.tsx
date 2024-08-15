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
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/purchaseItem/refunds?sliceNumber=0&sliceSize=99&purchaseItemId=${id}`,
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
      <div className="p-4 space-y-2 bg-gray-50 rounded-md shadow-md">
        <div className="text-lg font-semibold">제품 정보</div>
        <div className="text-gray-700">
          <span className="font-medium">제품 이름:</span> {item.productName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">제품 타입:</span> {item.productTypeName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">단일 옵션:</span>{' '}
          {item.selectedSingleOption.optionName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">단일 옵션 가격:</span>{' '}
          {item.selectedSingleOption.priceChangeAmount}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">가격:</span> {item.price}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">할인:</span> {item.discountAmount}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">할인율:</span> {item.discountRate}%
        </div>
        <div className="text-gray-700">
          <span className="font-medium">최종 상품 가격:</span> {item.finalPrice}
          원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">환불 여부:</span>{' '}
          {item.isRefund ? '가능' : '불가능'}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-md shadow-md">
        <div className="mb-4 text-lg font-semibold">환불 요청</div>
        <div className="flex flex-col gap-4">
          <input
            className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="환불 요청 제목"
            value={requestTitle}
            onChange={(e) => setRequestTitle(e.target.value)}
          />
          <textarea
            className="w-full max-w-md p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={requestContent}
            placeholder="환불 요청 내용"
            onChange={(e) => setRequestContent(e.target.value)}
          />
          <Button
            className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            variant="contained"
            onClick={() => getRefund(item.purchaseItemId)}
          >
            환불 요청하기
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {refundInfo.map((el: any, index: number) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-md shadow-inner"
            >
              <div className="text-gray-800">
                <span className="font-medium">환불 가격:</span> {el.refundPrice}
                원
              </div>
              <div className="text-gray-800">
                <span className="font-medium">환불 진행 상태:</span>{' '}
                {el.refundState}
              </div>
              <div className="text-gray-800">
                <span className="font-medium">판매자 응답:</span>{' '}
                {el.responseContent}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
