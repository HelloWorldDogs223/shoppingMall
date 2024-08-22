'use client';

interface ProductType {
  reportId: number; // 신고 데이터 ID
  reportCreatedDate: string; // 신고 일자
  reporterId: number; // 신고자 ID
  reporterName: string; // 신고자 이름
  title: string; // 신고 제목
  description: string; // 신고 내용
  isProcessedComplete: boolean; // 신고 처리여부
  reviewId: number; // 신고된 리뷰 ID
  reviewTitle: string; // 신고된 리뷰 제목
  writer: number; // 신고된 리뷰 작성자 ID
  writerName: string;
}

import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [typeSearch, setTypeSearch] = useState('');
  const [typeId, setTypeId] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const { accessToken } = useManagerFetch();

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
    setTypeSearch(productListRes.data.productTypeList[0]);
  };

  const handleProductType = async (type: number, name: string) => {
    setTypeSearch(name);
    setTypeId(type);
  };

  const getProducts = async () => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product-type/review-report?sliceSize=99&sliceNumber=0&productTypeId=${typeId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setProducts(res.data.reviewReportList);
  };

  const banClickHandler = (reviewId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/ban?reviewId=${reviewId}&isBan=${true}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const notBanClickHandler = (reviewId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/ban?reviewId=${reviewId}&isBan=${true}`,
      {},
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
      <div className="flex flex-wrap">
        {productTypes?.map((el: any) => {
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
      </div>
      <hr />
      {products?.map((el: ProductType) => {
        return (
          <div key={el.reportId}>
            <div>{el.reportCreatedDate}</div>
            <div>처리 여부 : {el.isProcessedComplete}</div>
            <div>신고 제목 : {el.title}</div>
            <div>신고 내용 : {el.description}</div>
            <div>신고자 이름 : {el.reporterName}</div>
            <div>신고자 아이디 : {el.reporterId}</div>
            <div>신고 아이디 : {el.reportId}</div>
            <div>작성자 이름: {el.writerName}</div>
            <div>작성자 아이디: {el.writer}</div>
            <Button onClick={() => banClickHandler(el.reviewId)}>
              밴 처리하기
            </Button>
            <Button onClick={() => notBanClickHandler(el.reviewId)}>
              밴 풀기
            </Button>
          </div>
        );
      })}
    </div>
  );
}
