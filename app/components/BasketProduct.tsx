import { useState } from 'react';
import { useRouter } from 'next/navigation';
interface Props {
  basket: any;
  basketDeleteHandler: (args: number) => void;
}

export default function BasketProduct({ basket, basketDeleteHandler }: Props) {
  const [count, setCount] = useState<number>(0);
  const [price, setPrice] = useState<number>(basket.finalPrice);

  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-[32px]">
      <div
        onClick={() => router.push(`/product/${basket.product.productId}`)}
        className="flex justify-center"
      >
        <img
          src={basket.product.firstProductImgDownloadUrl}
          className="w-[70px] h-[70px]"
          alt="product"
        />
        <div className="flex flex-col ml-[16px]">
          <div className="w-[142px] text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
            {basket.product.name}
          </div>
          <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
            {price}
          </div>
          <div className="w-[142px] text-slate-500 text-sm font-normal font-['Work Sans'] leading-[21px]">
            {basket.singleOption.optionName} (
            {basket.singleOption.priceChangeAmount})
          </div>
          <div>
            {basket.multiOptions.map((el: any) => {
              return (
                <div>
                  <div>{el.optionName}</div>
                  <div>{el.priceChangeAmount}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          onClick={(e: any) => {
            e.stopPropagation();
            basketDeleteHandler(basket.productId);
          }}
        >
          X ( 삭제하기 )
        </div>
      </div>
    </div>
  );
}
