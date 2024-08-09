'use client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CONDITION = [
  { ko: '가격 오름차순', en: 'LOW_PRICE' },
  { ko: '가격 내림차순', en: 'HIGH_PRICE' },
  { ko: '최신순', en: 'LATEST' },
  { ko: '오래된 순', en: 'OLDEST' },
  { ko: '평점 높은 순', en: 'HIGH_SCORE' },
  { ko: '평점 낮은 순', en: 'LOW_SCORE' },
];

export default function Page() {
  const params = useParams();
  const [productTypes, setProductTypes] = useState([]);
  const [productSearchList, setProductSearchList] = useState([]);
  const [productList, setProductList] = useState<any>([]);
  const [typeSearch, setTypeSearch] = useState('전체');
  const router = useRouter();

  const [searchCondition, setSearchCondition] = useState({
    ko: '가격 오름차순',
    en: 'LOW_PRICE',
  });

  useEffect(() => {
    fetchData();
    fetchProductListData();
  }, []);

  function getCommonElements(A: any[], B: any[]) {
    return A.filter(function (element: any) {
      return B.some((bElement) => bElement.productId === element.productId);
    });
  }

  const conditionHandler = async (el: any) => {
    setSearchCondition(el);
    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products?searchWord=${params.keyword}&sliceSize=200&sliceNumber=0&filterType=${el.en}`,
    );
    if (productRes.data) {
      console.log(productList);
      console.log(productRes.data.productList);

      setProductList(
        getCommonElements(productRes.data.productList, productList),
      );
    }
  };

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
  };

  const fetchProductListData = async () => {
    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products?searchWord=${params.keyword}&sliceSize=30&sliceNumber=0&filterType=${searchCondition.en}`,
    );
    if (productRes.data) {
      setProductList(productRes.data.productList);
      setProductSearchList(productRes.data.productList);
    }
  };

  const handleProductType = async (type: number, name: string) => {
    setTypeSearch(name);

    if (type === 0) {
      fetchProductListData();
      return;
    }

    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/${type}/products?sliceSize=30&sliceNumber=0&filterType=${searchCondition.en}`,
    );
    setProductList(
      getCommonElements(productSearchList, productRes.data.productList),
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {CONDITION.map((el: any, idx: number) => {
                    return (
                      <div
                        onClick={() => conditionHandler(el)}
                        key={idx + 1231230}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer  ${searchCondition.ko === el.ko ? 'bg-[#f0f0f4]' : 'bg-white'}`}
                      >
                        <div
                          className="text-[#111118]"
                          data-icon="GenderFemale"
                          data-size="24px"
                          data-weight="fill"
                        ></div>
                        <p className="text-[#111118] text-sm font-medium leading-normal">
                          {el.ko}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111118] tracking-light text-[32px] font-bold leading-tight min-w-72">
                검색 결과
              </p>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <div className="flex flex-wrap">
                <div
                  onClick={() => handleProductType(0, '전체')}
                  className="cursor-pointer mb-[3rem] mr-[1rem]"
                >
                  <div className="flex gap-3 p-3 overflow-x-hidden">
                    <div
                      className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full ${typeSearch === '전체' ? 'bg-red-500' : 'bg-[#e8edf3]'}  pl-4 pr-4`}
                    >
                      <p className="text-[#0e141b] text-sm font-medium leading-normal">
                        전체
                      </p>
                    </div>
                  </div>
                </div>
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
              </div>
            </div>

            {productList.map((el: any) => {
              return (
                <div
                  key={el.productId}
                  className="flex items-center gap-4 bg-white px-4 py-3 justify-between cursor-pointer mb-[1rem]"
                  onClick={() => router.push(`/product/${el.productId}`)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={el.firstProductImageUrl}
                      className="w-[100px] h-[100px]"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111118] text-base font-medium leading-normal line-clamp-1">
                        상품명 : {el.name}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        타입 : {el.typeName}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        가격 : {el.finalPrice}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        판매자 : {el.sellerName}
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
  );
}
