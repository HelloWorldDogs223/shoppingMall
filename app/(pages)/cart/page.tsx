'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BasketProduct from '@/app/components/BasketProduct';

export default function Page() {
  const router = useRouter();

  const [basketInfo, setBasketInfo] = useState<any>([]);

  const { error, accessToken } = useFetch();

  // useEffect(() => {
  //   if (error) {
  //     router.push('/signin');
  //   }
  // }, [error, router]);

  const basketDeleteHandler = (id: number) => {
    setBasketInfo(
      basketInfo.filter((el: any) => {
        if (el.basketItemId !== id) {
          return true;
        }
      }),
    );

    // delete에는 바디가 없다고 알려주기
    const deleteRes: any = axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    );
  };

  useEffect(() => {
    try {
      const basketRes: any = axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      console.log(basketRes.data);
      setBasketInfo(basketRes.data.basketItemDtos);
    } catch (e: any) {
      console.log(e);
    }
  }, []);

  const purchaseHandler = () => {};

  return (
    <div className="flex flex-col justify-center px-[196px]">
      <div className="flex justify-center mb-[24px] mt-[40px]">
        <div className=" text-neutral-900 text-[22px] font-bold font-['Work Sans'] leading-7">
          Shopping Cart
        </div>
      </div>
      {basketInfo.map((el: any) => {
        <BasketProduct basket={el} basketDeleteHandler={basketDeleteHandler} />;
      })}

      <div className="mt-[150px] w-full">
        <div className="w-full py-2 justify-between items-start inline-flex">
          <div className="flex-col justify-start items-start inline-flex">
            <div className="text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              Subtotal (3 items)
            </div>
          </div>
          <div className="flex-col justify-start  items-start inline-flex">
            <div className="text-right text-neutral-900 text-sm font-normal font-['Work Sans'] leading-[21px]">
              $540.00
            </div>
          </div>
        </div>
        <div className="w-full py-2 justify-between items-start inline-flex">
          <div className="flex-col justify-start items-start inline-flex">
            <div className="text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              Estimated Tax
            </div>
          </div>
          <div className="flex-col justify-start items-start inline-flex">
            <div className="text-right text-neutral-900 text-sm font-normal font-['Work Sans'] leading-[21px]">
              To be determined
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-end mt-[36px]"
        onClick={() => router.push('/')}
      >
        <div className="text-center text-neutral-900 text-base font-bold font-['Work Sans'] leading-normal mr-[32px] cursor-pointer">
          Continue Shopping
        </div>
        <div
          className="w-[206px] h-12 px-5 bg-blue-500 rounded-xl justify-center items-center inline-flex cursor-pointer"
          onClick={purchaseHandler}
        >
          <div className="flex-col justify-start items-center inline-flex">
            <div className="text-center text-white text-base font-bold font-['Work Sans'] leading-normal">
              Proceed to Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
