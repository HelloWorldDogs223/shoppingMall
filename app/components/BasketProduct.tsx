import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

interface Props {
  basket: any;
  basketDeleteHandler: (args: number, args2: number) => void;
}

export default function BasketProduct({ basket, basketDeleteHandler }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center mb-8 p-4 bg-white shadow rounded-lg transition duration-200 ease-in-out transform hover:scale-105">
      <img
        onClick={() => router.push(`/product/${basket.product.productId}`)}
        src={basket.product.firstProductImgDownloadUrl}
        className="w-20 h-20 object-cover cursor-pointer"
        alt="product"
      />
      <div className="flex flex-col ml-4 flex-grow">
        <div
          onClick={() => router.push(`/product/${basket.product.productId}`)}
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
        >
          {basket.product.name}
        </div>
        <div className="text-gray-500">
          ₩{basket.finalPrice.toLocaleString()}
        </div>
        <div className="text-gray-500">
          {basket.singleOption.optionName} (+₩
          {basket.singleOption.priceChangeAmount.toLocaleString()})
        </div>
        <div>
          {basket.multiOptions.map((el: any, index: number) => (
            <div key={index} className="text-gray-500">
              {el.optionName} (+₩{el.priceChangeAmount.toLocaleString()})
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={(e: any) => {
          e.stopPropagation();
          basketDeleteHandler(basket.product.productId, basket.basketItemId);
        }}
      >
        삭제하기
      </Button>
    </div>
  );
}
