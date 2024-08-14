'use client';

import axios from 'axios';
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

interface Props {
  basketInfo: any[];
  setModal: (args: boolean) => void;
}

declare global {
  interface Window {
    IMP: any;
  }
}

export default function PurchaseModal({ basketInfo, setModal }: Props) {
  const { accessToken } = useFetch();

  const [deliveryInfo, setDeliveryInfo] = useState({});

  const deleteHandler = () => {
    const list = basketInfo
      .map((el) => {
        return el.el.basketItemId;
      })
      .join(',');
    axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}?basketItemIdList=${list}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const completePurchase = (imp_uid: any, merchant_uid: any, status: any) => {
    console.log('구매완료 요청 시작');
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchase/payment`, {
        imp_uid: imp_uid,
        merchant_uid: merchant_uid,
        status: status,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setModal(false);
      })
      .finally(() => {
        deleteHandler();
        setModal(false);
      });
  };

  const requestPay = (responseData: any) => {
    console.log('결제 시작');
    const IMP = window.IMP;
    IMP.init('imp84236287');
    IMP.request_pay(
      {
        pg: 'kakaopay',
        pay_method: 'card',
        merchant_uid: responseData.purchaseUid,
        name: responseData.purchaseTitle,
        amount: responseData.totalPrice,
        buyer_email: 'gildong@gmail.com',
        buyer_name: responseData.deliveryInfo.senderName,
        buyer_tel: responseData.deliveryInfo.senderTel,
        buyer_addr: responseData.deliveryInfo.senderAddress,
        buyer_postcode: responseData.deliveryInfo.senderPostCode,
      },
      (res: any) => {
        if (res.success) {
          console.log('결제 성공');
          console.log(res);
        } else {
          console.log('결제 실패');
          console.log(res);
        }
        completePurchase(res.imp_uid, res.merchant_uid, res.status); // 구매 로직3. 서버에 구매완료 요청
      },
    );
  };

  const readyPurchase = () => {
    console.log('구매준비 요청 시작');
    const body = basketInfo.map((item: any) => ({
      basketItemId: item.basketItemId,
      expectedPrice: item.finalPrice,
    }));

    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchase`,
        {
          basketItems: body,
          deliveryInfo,
        },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      .then((res) => {
        console.log('구매준비 요청 성공');
        console.log(res);
        requestPay(res.data); // 구매 로직2. 포트원에 결제 요청
      })
      .catch((err) => {
        console.log('구매준비 요청 실패');
        console.log(err);
      });
  };

  // deliveryInfo:{senderName:"김철수", senderAddress:"서울 서초구 땡땡아파트 105동 204호", senderPostCode:"12345", senderTel:"010-0000-0000"}

  return (
    <div
      className="fixed w-screen h-screen bg-gray-500/50 top-0 left-0 z-[101] flex items-center justify-center"
      onClick={(e: any) => {
        setModal(false);
      }}
    >
      <div
        className="bg-white flex flex-col overflow-x-hidden  max-w-lg p-4 min-w-[800px]"
        onClick={(e: any) => e.stopPropagation()}
      >
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Checkout
              </h2>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-6 justify-between">
                  <p className="text-[#111418] text-base font-medium leading-normal">
                    View cart
                  </p>
                  <p className="text-[#111418] text-sm font-normal leading-normal">
                    {basketInfo.length}
                  </p>
                </div>
                <div className="rounded bg-[#dce0e5]">
                  <div
                    className="h-2 rounded bg-[#111418]"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Delivery Info
              </h2>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                    data-icon="Truck"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <input
                      placeholder="배송받는 사람"
                      className="border-red-500 border-solid border  rounded-md p-1"
                      onChange={(e: any) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          senderName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                    data-icon="Truck"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <input
                      className="border-red-500 border-solid border rounded-md p-1"
                      placeholder="배송지 우편번호"
                      onChange={(e: any) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          senderPostCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                    data-icon="Truck"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <input
                      className="border-red-500 border-solid border rounded-md p-1"
                      placeholder="받는 사람 전화번호"
                      onChange={(e: any) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          senderTel: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Shipping address
              </h2>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12"
                    data-icon="HouseSimple"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">
                      배송 주소
                    </p>
                    <input
                      className="border-red-500 border-solid border rounded-md p-1 min-w-[300px]"
                      placeholder="John Doe123 Main StSan Francisco, CA 94102"
                      onChange={(e: any) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          senderAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex px-4 py-3 mt-[1rem]">
                <button
                  onClick={readyPurchase}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#197ce6] text-white text-base font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Continue to payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
