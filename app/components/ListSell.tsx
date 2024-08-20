'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetch } from '../hooks/useFetch';
import { Button } from '@mui/material';

export default function ListSell() {
  const params = useSearchParams();

  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState([]);

  const { accessToken } = useFetch();

  const getProductStatusOn = async (id: number) => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}/sale-state/on-sale`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const getProductStatusOff = async (id: number) => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}/sale-state/discontinued`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const deleteProduct = async (id: number) => {
    const res: any = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const getId = async () => {
    try {
      const idRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
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
            <Button
              variant="contained"
              onClick={() => getProductStatusOn(el.productId)}
            >
              판매중으로 변경
            </Button>
            <Button
              variant="contained"
              onClick={() => getProductStatusOff(el.productId)}
            >
              판매중단으로 변경
            </Button>
            <Button
              variant="contained"
              onClick={() => deleteProduct(el.productId)}
            >
              제품 삭제
            </Button>
          </div>
        );
      })}
    </div>
  );
}
