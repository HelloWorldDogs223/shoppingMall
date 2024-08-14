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

      <div className="mt-[100px]">
        {request.map((item: any) => {
          return (
            <>
              <div>환불 아이디 : {item.refundId}</div>
              <div>환불 가격 : {item.refundPrice}</div>
              <div>환불 요청 제목 : {item.requestTitle}</div>
              <div>환불 요청 글 : {item.requestContent}</div>
              <div> 환불 상태 : {item.refundState}</div>
              <div>
                {item.refundState === 'ACCEPT' ? (
                  <>
                    <Button
                      variant="contained"
                      className="w-[400px]"
                      onClick={() => completeAccept(item.refundId)}
                    >
                      환불 요청 완료하기 ( 돌이킬 수 없습니다! )
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                <Button
                  variant="contained"
                  className="w-[400px]"
                  onClick={() => accept(item.refundId)}
                >
                  환불 요청 승인하기
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  className="w-[400px]"
                  onClick={() => reject(item.refundId)}
                >
                  환불 요청 반려하기
                </Button>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
