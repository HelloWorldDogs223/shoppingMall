'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();

  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState([]);

  const getId = async () => {
    const idRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
    );
    setUserId(idRes.data.id);
  };

  const getProductList = async () => {
    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/seller/products?sliceSize=999&sliceNumber=0&sellerId=${params.get('member') ?? userId}`,
    );
    setProducts(productRes.data.productList);
  };

  useEffect(() => {
    getId();
    getProductList();
  }, []);

  return (
    <div>
      {products.map((el: any) => {
        return (
          <>
            <div> 제품 타입명 : {el.typeName}</div>
            <div>
              <img src={el.firstProductImageUrl} />
            </div>
            <div>제품명: {el.name}</div>
            <div>제품가격: {el.price}</div>
            <div>할인양 : {el.discountAmount}</div>
            <div>할인율 : {el.discountRate}</div>
            <div>평점 : {el.scoreAvg}</div>
            <div>최종가 : {el.finalPrice}</div>
          </>
        );
      })}
    </div>
  );
}
