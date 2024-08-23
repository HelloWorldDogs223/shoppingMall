'use client';

interface ProductType {
  reportId: number; // 신고 데이터 ID
  reportCreatedDate: string; // 신고 일자
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

import ReportRecordModal from '@/app/components/ReportRecordModal';
import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [typeSearch, setTypeSearch] = useState('');
  const [typeId, setTypeId] = useState(0);
  const [modal, setModal] = useState(false);

  const { accessToken } = useManagerFetch();

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
    setTypeSearch(productListRes.data.productTypeList[0]);
  };

  const getProducts = async () => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product-type/product-report?sliceSize=99&sliceNumber=0&productTypeId=${typeId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setProducts(res.data.productReportList);
  };

  const handleProductType = async (type: number, name: string) => {
    setTypeSearch(name);
    setTypeId(type);
  };

  const banClickHandler = (productId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/ban?productId=${productId}&isBan=${true}`,
      { productId, isBan: true },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const notBanClickHandler = (productId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/ban?productId=${productId}&isBan=${false}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const banClicUserkHandler = (memberId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/ban?memberId=${memberId}&isBan=${true}`,
      { memberId, isBan: true },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const notBanClickUserHandler = (memberId: number) => {
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/ban?memberId=${memberId}&isBan=${false}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const banStatusChangerNo = (productReportId: number) => {
    const res: any = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/report/state`,
      { productReportId, resultType: 'NO_ACTION' },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };
  const banStatusChangerTarget = (productReportId: number) => {
    const res: any = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/report/state`,
      { productReportId, resultType: 'TARGET_BAN' },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };
  const banStatusChangerUser = (productReportId: number) => {
    const res: any = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/report/state`,
      { productReportId, resultType: 'MEMBER_BAN' },
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
    <div className="space-y-6 mt-[100px]">
      <div className="flex flex-wrap gap-4">
        {productTypes.map((el: any) => {
          return (
            <div
              key={el.typeId}
              onClick={() => handleProductType(el.typeId, el.typeName)}
              className={`cursor-pointer mb-4 mr-4 p-3 rounded-lg shadow-sm transition-transform transform hover:scale-105 ${typeSearch === el.typeName ? 'bg-red-500 text-white' : 'bg-[#e8edf3] text-[#0e141b]'} `}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 items-center justify-center gap-x-2 rounded-full pl-4 pr-4">
                  <p className="text-sm font-medium leading-normal">
                    {el.typeName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((el: ProductType) => {
          return (
            <div
              key={el.productId}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-500">
                  신고 날짜: {el.reportCreatedDate}
                </div>
                <div
                  className={`text-sm font-semibold ${el.isProcessedComplete ? 'text-green-600' : 'text-red-600'}`}
                >
                  처리 여부: {el.isProcessedComplete ? '완료' : '미완료'}
                </div>
                <div className="text-lg font-bold">신고 제목: {el.title}</div>
                <div className="text-gray-700">신고 내용: {el.description}</div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div>상품 이름: {el.productName}</div>
                <div>상품 아이디: {el.productId}</div>
                <div>신고자 이름: {el.reporterName}</div>
                <div>신고자 아이디: {el.reporterId}</div>
                <div>신고 아이디: {el.reportId}</div>
                <div>판매자 이름: {el.sellerName}</div>
                <div>판매자 아이디: {el.sellerId}</div>
              </div>

              <Button variant="contained" onClick={() => setModal(true)}>
                유저의 신고 이력 보기
              </Button>

              {modal && (
                <ReportRecordModal
                  sellerId={el.sellerId}
                  mode="product"
                  onClose={() => setModal(false)}
                />
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={() => banClickHandler(el.productId)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  상품 밴 처리하기
                </Button>
                <Button
                  onClick={() => notBanClickHandler(el.productId)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  상품 밴 풀기
                </Button>
                <Button
                  onClick={() => banClicUserkHandler(el.sellerId)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  판매자 밴 처리하기
                </Button>
                <Button
                  onClick={() => notBanClickUserHandler(el.sellerId)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  판매자 밴 풀기
                </Button>

                <Button
                  onClick={() => banStatusChangerNo(el.reportId)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  밴 처리 하지 않음
                </Button>
                <Button
                  onClick={() => banStatusChangerTarget(el.reportId)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  제품 밴 처리 수행
                </Button>
                <Button
                  onClick={() => banStatusChangerUser(el.reportId)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  회원 밴 처리 수행
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
