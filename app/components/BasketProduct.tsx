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

  const plusProduct = () => {
    setCount(count + 1);
    setPrice(price + basket.finalPrice);
  };

  const minusProduct = () => {
    if (count <= 1) {
      return;
    }
    setCount(count - 1);
    setPrice(price - basket.finalPrice);
  };

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
        </div>
      </div>
      <div>
        <div
          onClick={minusProduct}
          className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex mr-[32px] cursor-pointer"
        >
          <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
            -
          </div>
        </div>
        <span className="mr-[32px]">{count}</span>
        <div
          onClick={plusProduct}
          className="w-7 h-7 bg-gray-100 rounded-[14px] justify-center items-center inline-flex cursor-pointer"
        >
          <div className="text-center text-neutral-900 text-base font-medium font-['Work Sans'] leading-normal">
            +
          </div>
        </div>
        <div onClick={() => basketDeleteHandler(basket.basketItemId)}>
          X ( 삭제하기 )
        </div>
      </div>
    </div>
  );
}
