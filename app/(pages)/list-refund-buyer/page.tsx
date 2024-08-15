'use client';

import { useFetch } from '@/app/hooks/useFetch';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState([]);
  const { accessToken } = useFetch();

  const getRefundData = async () => {
    const refundRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/purchase/refunds?sliceNumber=0&sliceSize=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setData(refundRes.data.refundedPurchaseItemList);
  };

  useEffect(() => {
    getRefundData();
  }, []);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-lg space-y-6">
      <div className="text-2xl font-bold mb-4">환불 요청한 아이템들</div>
      {data.map((el: any, index: number) => (
        <div
          key={index}
          className="p-4 bg-white rounded-md shadow-md space-y-4"
        >
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
            <span className="font-medium">구매 일시:</span>{' '}
            {el.purchaseDateTime}
          </div>

          <div className="mt-4 text-lg font-semibold">제품 정보</div>
          <div className="text-gray-700">
            <span className="font-medium">제품명:</span> {el.productName}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">제품 타입명:</span>{' '}
            {el.productTypeName}
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
            {el.selectedMultiOptions.map((item: any, idx: number) => (
              <div key={idx} className="p-2 bg-gray-100 rounded-md">
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

          <div className="mt-4 text-lg font-semibold">환불 정보</div>
          <div className="text-gray-700">
            <span className="font-medium">환불 여부:</span>{' '}
            {el.isRefund ? '가능' : '불가능'}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">환불 상태:</span> {el.refundState}
          </div>
        </div>
      ))}
    </div>
  );
}
