'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFetch } from './hooks/useFetch';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import apiClient from './utils/axiosSetting';

interface ProductType {
  productId: number; // 제품ID
  sellerId: number; // 판매자ID
  sellerName: string; // 판매자명
  typeId: number; // 제품타입ID
  typeName: string; // 제품타입명
  firstProductImageUrl: string; // 첫번째 제품 이미지
  name: string; // 제품명
  price: number; // 가격
  discountAmount: number; // 할인양
  discountRate: number; // 할인율
  isBan: Boolean; // 밴여부
  scoreAvg: number; // 평점
  finalPrice: number; // 최종가격
  saleState: 'ON_SALE' | 'DISCONTINUED'; // 제품 판매여부
}

export default function Home() {
  // router
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [sliceNumber, setSliceNumber] = useState<number>(0);
  const [display, setDisplay] = useState<ProductType[]>([]);

  const observeRef = useRef<HTMLDivElement>(null); // 옵저버 ref

  // state
  const [search, setSearch] = useState('');

  useFetch();

  const getProductsFirst = async () => {
    const productRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/random?sliceNumber=${sliceNumber}&sliceSize=10`,
    );

    setSliceNumber(sliceNumber + 1);
    setProducts(productRes.data.productList);
    setDisplay(productRes.data.productList);
  };

  const getProductsLast = async () => {
    const productRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/random?sliceNumber=${sliceNumber}&sliceSize=10`,
    );

    if (productRes.data.hasNext) {
      setSliceNumber(sliceNumber + 1);
      setProducts([...products, ...productRes.data.productList]);
    }
  };

  const ioCallback = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      getProductsLast();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(ioCallback, {
      threshold: 0.9,
      root: null,
    });

    observeRef.current && observer.observe(observeRef.current);

    return () => {
      observer.disconnect();
    };
  }, [ioCallback, observeRef.current]);

  useEffect(() => {
    getProductsFirst();
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col  group/design-root overflow-x-hidden mt-[100px]"
      style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div className="relative flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10">
                  <Carousel className="w-[960px]">
                    {display?.map((item: ProductType) => (
                      <div className="w-[960px]" key={item.productId}>
                        <img
                          onClick={() =>
                            router.push(`/product/${item.productId}`)
                          }
                          src={item.firstProductImageUrl}
                          className="w-[960px] h-[480px] cursor-pointer"
                        />
                      </div>
                    ))}
                  </Carousel>
                  <h1 className=" text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] text-center">
                    최신 상품들을 살펴보세요!
                  </h1>
                  <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div
                        className="text-[#4f7396] flex border border-[#d0dbe6] bg-[#f8fafb] items-center justify-center pl-[15px] rounded-l-xl border-r-0"
                        data-icon="MagnifyingGlass"
                        data-size="20px"
                        data-weight="regular"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                      </div>
                      <form
                        onSubmit={(e: any) => {
                          e.preventDefault();
                          router.push(`/search/${search}`);
                        }}
                      >
                        <input
                          placeholder="Search for stores"
                          className="form-input flex w-full min-w-[500px] flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-full placeholder:text-[#4f7396] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                        />
                      </form>
                      <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#d0dbe6] bg-[#f8fafb] pr-[7px]">
                        <Button
                          onClick={() => router.push(`/search/${search}`)}
                          variant="contained"
                          className=" flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#348de5] text-[#f8fafb] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                        >
                          <span className="truncate">검색</span>
                        </Button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <h3 className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
              Featured Stores
            </h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {products?.map((item: ProductType, index: number) => {
                return (
                  <div key={index + 50000}>
                    <div className="flex flex-col gap-3">
                      <img
                        onClick={() =>
                          router.push(`/product/${item.productId}`)
                        }
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl cursor-pointer"
                        src={item.firstProductImageUrl}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div ref={observeRef} className="mt-[50px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
