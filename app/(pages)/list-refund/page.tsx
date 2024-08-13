'use client';

import { useFetch } from '@/app/hooks/useFetch';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState([]);
  const { accessToken } = useFetch();

  const getRefundData = async () => {
    const refundRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/product/refunds?sliceNumber=0&sliceSize=99`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    console.log(refundRes.data);
    setData(refundRes.data.refundedPurchaseItemList);
  };

  useEffect(() => {
    getRefundData();
  }, []);

  return (
    <div>
      <div>환불요청이 들어온 아이템들</div>
      {data.map((el: any) => {
        return (
          <>
            <div>구매 ID : {el.purchaseId}</div>
            <div>구매자 ID : {el.buyerId}</div>
            <div>구매자 이름 : {el.buyerName}</div>
            <div>구매 일시 : {el.purchaseDateTime}</div>
            <div>제품명: {el.productName}</div>
            <div>제품 타입명 : {el.productTypeName}</div>
            <div>단일 옵션 : {el.selectedSingleOption.optionName}</div>
            <div>
              단일 옵션 가격 변동: {el.selectedSingleOption.priceChangeAmount}
            </div>
            <div>다중 옵션 </div>
            {el.selectedMultiOptions.map((item: any) => {
              return (
                <div>
                  <div>옵션 이름: {item.optionName}</div>
                  <div>옵션 가격 변동: {item.priceChangeAmount}</div>
                </div>
              );
            })}
            <div>원래 가격 : {el.price}</div>
            <div>할인가격: {el.discountAmount}</div>
            <div>할인율 : {el.discountRate}</div>
            <div>최종 가격 : {el.finalPrice}</div>
            <div>환불 여부 : {el.isRefund} </div>
            <div>환불 상태 : {el.refundState}</div>
          </>
        );
      })}
    </div>
  );
}
