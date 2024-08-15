'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetch } from '../hooks/useFetch';

export default function ListSell() {
  const params = useSearchParams();

  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState([]);

  const { accessToken } = useFetch();

  const getId = async () => {
    try {
      const idRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      );
      setUserId(idRes.data.id);
    } catch (error) {
      console.error('Failed to fetch user ID:', error);
    }
  };

  const getProductList = async (sellerId: string) => {
    try {
      const productRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/seller/products?sliceSize=999&sliceNumber=0&sellerId=${sellerId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setProducts(productRes.data.productList);
    } catch (error) {
      console.error('Failed to fetch product list:', error);
    }
  };

  useEffect(() => {
    const sellerIdFromParams = params.get('member');

    if (sellerIdFromParams) {
      getProductList(sellerIdFromParams);
    } else {
      getId().then(() => {
        if (userId) {
          getProductList(userId);
        }
      });
    }
  }, [userId, params]);

  return (
    <div>
      {products.map((el: any, index: number) => {
        return (
          <div key={index}>
            <div> 제품 타입명 : {el.typeName}</div>
            <div>
              <img src={el.firstProductImageUrl} alt={el.name} />
            </div>
            <div>제품명: {el.name}</div>
            <div>제품가격: {el.price}원</div>
            <div>할인양 : {el.discountAmount}원</div>
            <div>할인율 : {el.discountRate}%</div>
            <div>평점 : {el.scoreAvg}점</div>
            <div>최종가 : {el.finalPrice}원</div>
          </div>
        );
      })}
    </div>
  );
}
