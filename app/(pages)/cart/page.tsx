'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BasketProduct from '@/app/components/BasketProduct';
import PurchaseModal from '@/app/components/PurchaseModal';
import useCartStore from '@/app/store/cart';
import { useFetch } from '@/app/hooks/useFetch';

interface BasketItem {
  id: number;
  basketItemId: number;
  finalPrice: number;
  // Add other necessary properties
}

export default function ShoppingCartPage() {
  const router = useRouter();
  const { error, accessToken } = useFetch();
  const removeItem = useCartStore((state: any) => state.removeItem);

  const [basketInfo, setBasketInfo] = useState<BasketItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (error) {
      router.push('/signin');
    }
  }, [error, router]);

  useEffect(() => {
    const fetchBasketInfo = async () => {
      try {
        const response = await axios.get<{ basketItemDtos: BasketItem[] }>(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        setBasketInfo(response.data.basketItemDtos);
        setTotalPrice(calculateTotalPrice(response.data.basketItemDtos));
      } catch (error) {
        console.error('Failed to fetch basket info:', error);
      }
    };

    fetchBasketInfo();
  }, [accessToken]);

  const calculateTotalPrice = (items: BasketItem[]): number => {
    return items.reduce((acc, item) => acc + item.finalPrice, 0);
  };

  const handleBasketDelete = async (id: number, basketId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket?basketItemIdList=${basketId}`,
        { headers: { authorization: `Bearer ${accessToken}` } },
      );

      const updatedBasketInfo = basketInfo.filter(
        (item) => item.basketItemId !== basketId,
      );
      setBasketInfo(updatedBasketInfo);
      setTotalPrice(calculateTotalPrice(updatedBasketInfo));
      removeItem(id);
    } catch (error) {
      console.error('Failed to delete item from basket:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center px-[196px] mb-[10rem]">
      <h1 className="text-center text-neutral-900 text-[22px] font-bold font-['Work Sans'] leading-7 mb-[24px] mt-[40px]">
        Shopping Cart
      </h1>

      {basketInfo.map((item) => (
        <BasketProduct
          key={item.basketItemId}
          basket={item}
          basketDeleteHandler={handleBasketDelete}
        />
      ))}

      <div className="mt-[150px] w-full">
        <CartSummary itemCount={basketInfo.length} totalPrice={totalPrice} />
      </div>

      <div className="flex items-center justify-end mt-[36px]">
        <button
          onClick={() => router.push('/')}
          className="text-center text-neutral-900 text-base font-bold font-['Work Sans'] leading-normal mr-[32px]"
        >
          Continue Shopping
        </button>
        <button
          className="w-[206px] h-12 px-5 bg-blue-500 rounded-xl text-white text-base font-bold font-['Work Sans'] leading-normal"
          onClick={() => setIsModalOpen(true)}
        >
          Proceed to Checkout
        </button>
      </div>

      {isModalOpen && (
        <PurchaseModal basketInfo={basketInfo} setModal={setIsModalOpen} />
      )}
    </div>
  );
}

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
}

function CartSummary({ itemCount, totalPrice }: CartSummaryProps) {
  return (
    <>
      <div className="w-full py-2 flex justify-between items-start">
        <span className="text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
          Subtotal ({itemCount} items)
        </span>
        <span className="text-right text-neutral-900 text-sm font-normal font-['Work Sans'] leading-[21px]">
          ${totalPrice}
        </span>
      </div>
      <div className="w-full py-2 flex justify-between items-start">
        <span className="text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
          Estimated Tax
        </span>
        <span className="text-right text-neutral-900 text-sm font-normal font-['Work Sans'] leading-[21px]">
          To be determined
        </span>
      </div>
    </>
  );
}
