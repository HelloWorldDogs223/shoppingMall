'use client';

import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

interface Props {
  el: any;
}
export default function RefundList({ el }: Props) {
  const [request, setRequest] = useState([]);
  const { accessToken } = useFetch();

  const getRefundRequestData = async (id: number) => {
    const refundRequetRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/purchaseItem/refunds?purchaseItemId=${id}&sliceSize=999&sliceNumber=0`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setRequest(refundRequetRes.data.refundList);
  };

  const accept = async (id: number) => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund/accept`,
      { refundId: id, responseMessage: '판매자가 환불 요청을 승인하였습니다' },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (res.data) {
      console.log('요청 승인 성공');
    }
  };

  const completeAccept = async (id: number) => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund/complete`,
      { refundId: id },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (res.data) {
      console.log('환불 승인 성공');
    }
  };

  const reject = async (id: number) => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund/reject`,
      {
        refundId: id,
        responseMessage:
          '판매자가 환불 요청을 반려하였습니다 이유는 다음과 같습니다',
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (res.data) {
      console.log('요청 반려 성공');
    }
  };

  useEffect(() => {
    getRefundRequestData(el.purchaseItemId);
  }, []);

  return (
    <>
      <div className="p-4 space-y-2 bg-white rounded-md shadow-md">
        <div className="text-lg font-semibold">구매 정보</div>
        <div className="text-gray-700">
          <span className="font-medium">구매 ID:</span> {el.purchaseId}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">구매자 ID:</span> {el.buyerId}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">구매자 이름:</span> {el.buyerName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">구매 일시:</span> {el.purchaseDateTime}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">제품명:</span> {el.productName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">제품 타입명:</span> {el.productTypeName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">단일 옵션:</span>{' '}
          {el.selectedSingleOption.optionName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">단일 옵션 가격 변동:</span>{' '}
          {el.selectedSingleOption.priceChangeAmount}원
        </div>

        <div className="mt-4 text-lg font-semibold">다중 옵션</div>
        <div className="space-y-2">
          {el.selectedMultiOptions.map((item: any, index: number) => (
            <div key={index} className="p-2 bg-gray-100 rounded-md shadow-sm">
              <div className="text-gray-800">
                <span className="font-medium">옵션 이름:</span>{' '}
                {item.optionName}
              </div>
              <div className="text-gray-800">
                <span className="font-medium">옵션 가격 변동:</span>{' '}
                {item.priceChangeAmount}원
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-lg font-semibold">가격 정보</div>
        <div className="text-gray-700">
          <span className="font-medium">원래 가격:</span> {el.price}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">할인가격:</span> {el.discountAmount}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">할인율:</span> {el.discountRate}%
        </div>
        <div className="text-gray-700">
          <span className="font-medium">최종 가격:</span> {el.finalPrice}원
        </div>
        <div className="text-gray-700">
          <span className="font-medium">환불 여부:</span>{' '}
          {el.isRefund ? '가능' : '불가능'}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">환불 상태:</span> {el.refundState}
        </div>
      </div>

      <div className="mt-8 p-4 bg-white rounded-md shadow-md space-y-4">
        <div className="text-lg font-semibold">환불 요청</div>
        {request.map((item: any, index: number) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-md shadow-inner space-y-2"
          >
            <div className="text-gray-800">
              <span className="font-medium">환불 아이디:</span> {item.refundId}
            </div>
            <div className="text-gray-800">
              <span className="font-medium">환불 가격:</span> {item.refundPrice}
              원
            </div>
            <div className="text-gray-800">
              <span className="font-medium">환불 요청 제목:</span>{' '}
              {item.requestTitle}
            </div>
            <div className="text-gray-800">
              <span className="font-medium">환불 요청 내용:</span>{' '}
              {item.requestContent}
            </div>
            <div className="text-gray-800">
              <span className="font-medium">환불 상태:</span> {item.refundState}
            </div>

            <div className="space-y-2">
              {item.refundState === 'ACCEPT' && (
                <Button
                  variant="contained"
                  className="w-full max-w-md bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                  onClick={() => completeAccept(item.refundId)}
                >
                  환불 요청 완료하기 (돌이킬 수 없습니다!)
                </Button>
              )}
              <Button
                variant="contained"
                className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => accept(item.refundId)}
              >
                환불 요청 승인하기
              </Button>
              <Button
                variant="contained"
                className="w-full max-w-md bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                onClick={() => reject(item.refundId)}
              >
                환불 요청 반려하기
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
