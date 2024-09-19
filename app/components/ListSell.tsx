'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetch } from '../hooks/useFetch';
import { Button } from '@mui/material';
import apiClient from '../utils/axiosSetting';

export default function ListSell() {
  const params = useSearchParams();

  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState([]);

  const { accessToken } = useFetch();

  const getProductStatusOn = async (id: number) => {
    const res: any = await apiClient.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}/sale-state/on-sale`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('판매 중으로 변경되었습니다.');
    location.reload();
  };

  const getProductStatusOff = async (id: number) => {
    const res: any = await apiClient.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}/sale-state/discontinued`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('판매 중단으로 변경되었습니다.');
    location.reload();
  };

  const deleteProduct = async (id: number) => {
    const res: any = await apiClient.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('삭제되었습니다.');
    location.reload();
  };

  const getId = async () => {
    try {
      const idRes = await apiClient.get(
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
      const productRes = await apiClient.get(
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
      <div className="relative flex size-full min-h-screen flex-col bg-[#f8f8fc] group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0e0e1b] tracking-light text-[32px] font-bold leading-tight min-w-72">
                  Products
                </p>
              </div>
              {products.map((el: any, index: number) => {
                return (
                  <div
                    key={el.productId}
                    className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4"
                  >
                    <div className="flex flex-col gap-3 pb-3">
                      <img
                        src={el.firstProductImageUrl}
                        alt={el.name}
                        className="w-[100px] h-[100px]"
                      />
                      <div>
                        <p className="text-[#0e0e1b] text-base font-medium leading-normal">
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
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
