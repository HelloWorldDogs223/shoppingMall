'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const { error } = useFetch();
  // useEffect(() => {
  //   if (error) {
  //     router.push('/signin');
  //   }
  // }, [error, router]);

  return (
    <div className="flex flex-col justify-center px-[196px]">
      <div className="flex justify-center mb-[24px] mt-[40px]">
        <div className=" text-neutral-900 text-[22px] font-bold font-['Work Sans'] leading-7">
          Shopping Cart
        </div>
      </div>
      <div className="flex justify-between items-center mb-[32px]">
        <div className="flex justify-center">
          <img
            src="/example4.png"
            className="w-[70px] h-[70px]"
            alt="product"
          />
          <div className="flex flex-col ml-[16px]">
            <div className="w-[142px] text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              Nike Air Max 1
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              $180.00
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              Size 7.5, Color: Black
            </div>
          </div>
        </div>
        <div>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex mr-[32px] cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              -
            </div>
          </div>
          <span className="mr-[32px]">1</span>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              +
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-[32px]">
        <div className="flex justify-center">
          <img
            src="/example4.png"
            className="w-[70px] h-[70px]"
            alt="product"
          />
          <div className="flex flex-col ml-[16px]">
            <div className="w-[142px] text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              Nike Air Max 1
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              $180.00
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              Size 7.5, Color: Black
            </div>
          </div>
        </div>
        <div>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex mr-[32px] cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              -
            </div>
          </div>
          <span className="mr-[32px]">1</span>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              +
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-center">
          <img
            src="/example4.png"
            className="w-[70px] h-[70px]"
            alt="product"
          />
          <div className="flex flex-col ml-[16px]">
            <div className="w-[142px] text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              Nike Air Max 1
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              $180.00
            </div>
            <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
              Size 7.5, Color: Black
            </div>
          </div>
        </div>
        <div>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex mr-[32px] cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              -
            </div>
          </div>
          <span className="mr-[32px]">1</span>
          <div className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex cursor-pointer">
            <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
              +
            </div>
          </div>
        </div>
      </div>
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
      <div className="flex items-center justify-end mt-[36px]">
        <div className="text-center text-neutral-900 text-base font-bold font-['Work Sans'] leading-normal mr-[32px] cursor-pointer">
          Continue Shopping
        </div>
        <div className="w-[206px] h-12 px-5 bg-blue-500 rounded-xl justify-center items-center inline-flex cursor-pointer">
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
