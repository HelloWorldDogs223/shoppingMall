'use client';

interface ProductType {
  reportId: number; // 신고 데이터 ID
  reportCreatedDate: Date; // 신고 일자
  reporterId: number; // 신고자 ID
  reporterName: string; // 신고자 닉네임
  title: string; // 신고 제목
  description: string; // 신고 내용
  isProcessedComplete: boolean; // 신고 처리여부
  productId: number; // 신고 제품 ID
  productName: string; // 신고 제품 이름
  sellerId: number; // 신고 제품 판매자 ID
  sellerName: string; // 신고 제품 판매자 이름
}

import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [typeSearch, setTypeSearch] = useState('');

  const { accessToken } = useManagerFetch();

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
    setTypeSearch(productListRes.data.productTypeList[0]);
  };

  const getProducts = async (type?: number) => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product-type/product-report?sliceSize=99&sliceNumber=0&productTypeId=${type || typeSearch}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setProducts(res.data.productReportList);
  };

  const handleProductType = async (type: number, name: string) => {
    setTypeSearch(name);
  };

  const banClickHandler = (productId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/ban`,
      { productId, isBan: true },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const notBanClickHandler = (productId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/ban`,
      { productId, isBan: false },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (typeSearch) getProducts();
  }, [typeSearch]);

  return (
    <div>
      {productTypes.map((el: any) => {
        return (
          <div
            key={el.typeId}
            onClick={() => handleProductType(el.typeId, el.typeName)}
            className="cursor-pointer mb-[3rem] mr-[1rem]"
          >
            <div className="flex gap-3 p-3 overflow-x-hidden">
              <div
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full ${typeSearch === el.typeName ? 'bg-red-500' : 'bg-[#e8edf3]'}  pl-4 pr-4`}
              >
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  {el.typeName}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {products.map((el: ProductType) => {
        return (
          <div key={el.productId}>
            <div>{el.reportCreatedDate.getDate()}</div>
            <div>처리 여부 : {el.isProcessedComplete}</div>
            <div>신고 제목 : {el.title}</div>
            <div>신고 내용 : {el.description}</div>
            <div>상품 이름 : {el.productName}</div>
            <div>상품 아이디 : {el.productId}</div>
            <div>신고자 이름 : {el.reporterName}</div>
            <div>신고자 아이디 : {el.reporterId}</div>
            <div>신고 아이디 : {el.reportId}</div>
            <div>판매자 이름: {el.sellerName}</div>
            <div>판매자 아이디: {el.sellerId}</div>
            <Button onClick={() => banClickHandler(el.productId)}>
              밴 처리하기
            </Button>
            <Button onClick={() => notBanClickHandler(el.productId)}>
              밴 풀기
            </Button>
          </div>
        );
      })}
    </div>
  );
}
