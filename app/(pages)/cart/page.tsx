'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BasketProduct from '@/app/components/BasketProduct';
import PurchaseModal from '@/app/components/PurchaseModal';
import useCartStore from '@/app/store/cart';

export default function Page() {
  const router = useRouter();

  const [basketInfo, setBasketInfo] = useState<any>([]);
  const [modal, setModal] = useState(false);

  const { error, accessToken } = useFetch();

  const removeItem = useCartStore((state: any) => state.removeItem);

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (error) {
      router.push('/signin');
    }
  }, [error, router]);

  const basketDeleteHandler = async (id: number, basketId: number) => {
    try {
      const deleteRes: any = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket?basketItemIdList=${basketId}`,
        { headers: { authorization: `Bearer ${accessToken}` } },
      );

      // API 요청 성공 후에만 상태 업데이트
      setBasketInfo(
        basketInfo.filter((el: any) => el.basketItemId !== basketId),
      );
      removeItem(id);
    } catch (error) {
      console.error('Failed to delete item from basket:', error);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const basketRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        setBasketInfo(basketRes.data.basketItemDtos);
        setPrice(
          basketInfo.reduce((acc: any, cur: any) => {
            return acc + cur.finalPrice;
          }),
        );
      } catch (e) {
        console.log(e);
      }
    };

    asyncFunction();
  }, [accessToken]);

  const purchaseHandler = () => {
    setModal(true);
  };

  return (
    <div>
      <div className="flex flex-col justify-center px-[196px] mb-[10rem]">
        <div className="flex justify-center mb-[24px] mt-[40px]">
          <div className=" text-neutral-900 text-[22px] font-bold font-['Work Sans'] leading-7">
            Shopping Cart
          </div>
        </div>

        {basketInfo.map((el: any) => {
          return (
            <BasketProduct
              basket={el}
              basketDeleteHandler={basketDeleteHandler}
            />
          );
        })}

        <div className="mt-[150px] w-full">
          <div className="w-full py-2 justify-between items-start inline-flex">
            <div className="flex-col justify-start items-start inline-flex">
              <div className="text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
                Subtotal ({basketInfo.length} items)
              </div>
            </div>
            <div className="flex-col justify-start  items-start inline-flex">
              <div className="text-right text-neutral-900 text-sm font-normal font-['Work Sans'] leading-[21px]">
                ${price}
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
        <div className="flex items-center justify-end mt-[36px]">
          <div
            onClick={() => router.push('/')}
            className="text-center text-neutral-900 text-base font-bold font-['Work Sans'] leading-normal mr-[32px] cursor-pointer"
          >
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
      {modal && <PurchaseModal basketInfo={basketInfo} setModal={setModal} />}
    </div>
  );
}
