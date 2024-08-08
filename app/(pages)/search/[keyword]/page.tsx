'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const params = useParams();
  const [productTypes, setProductTypes] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchProductListData();
  }, []);

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
  };

  const fetchProductListData = async () => {
    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products?searchWord=${params.keyword}&sliceSize=20&sliceNumber=2&filterType=HIGH_PRICE`,
    );
    console.log(productRes);
    if (productRes.data) setProductList(productRes.data.productList);
  };

  const handleProductType = (type: number) => {
    const productRes: any = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/${type}/products?sliceSize=20&sliceNumber=2&filterType=HIGH_PRICE`,
    );
  };

  useEffect(() => {
    console.log(productList);
  }, [productList]);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f0f4]">
                    <div
                      className="text-[#111118]"
                      data-icon="GenderFemale"
                      data-size="24px"
                      data-weight="fill"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,144a40,40,0,1,1,40-40A40,40,0,0,1,128,144ZM216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H200A16,16,0,0,1,216,40ZM136,176V159.42a56,56,0,1,0-16,0V176H96a8,8,0,0,0,0,16h24v16a8,8,0,0,0,16,0V192h24a8,8,0,0,0,0-16Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Women
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="text-[#111118]"
                      data-icon="GenderMale"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,32H168a8,8,0,0,0,0,16h28.69L154.62,90.07a80,80,0,1,0,11.31,11.31L208,59.32V88a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32ZM149.24,197.29a64,64,0,1,1,0-90.53A64.1,64.1,0,0,1,149.24,197.29Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Men
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="text-[#111118]"
                      data-icon="House"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Home
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="text-[#111118]"
                      data-icon="Diamond"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Jewelry
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="text-[#111118]"
                      data-icon="Palette"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89Zm13,93.71A15.89,15.89,0,0,1,198.21,160H152a32,32,0,0,0-32,32,16,16,0,0,1-21.31,15.07C62.49,194.3,40,164,40,128a88,88,0,0,1,87.09-88h.9a88.35,88.35,0,0,1,88,87.25A88.86,88.86,0,0,1,213.81,147.6ZM140,76a12,12,0,1,1-12-12A12,12,0,0,1,140,76ZM96,100A12,12,0,1,1,84,88,12,12,0,0,1,96,100Zm0,56a12,12,0,1,1-12-12A12,12,0,0,1,96,156Zm88-56a12,12,0,1,1-12-12A12,12,0,0,1,184,100Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Beauty
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="text-[#111118]"
                      data-icon="Tag"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111118] text-sm font-medium leading-normal">
                      Sale
                    </p>
                  </div>
                </div>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1919e6] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">New Arrival</span>
              </button>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111118] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Women's clothing
              </p>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <div className="flex flex-wrap">
                {productTypes.map((el: any) => {
                  return (
                    <div>
                      <div
                        className="flex gap-3 p-3 overflow-x-hidden"
                        onClick={() => handleProductType(el.typeId)}
                      >
                        <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
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
                <div className="flex items-center gap-4 bg-white px-4 py-3 justify-between">
                  <div className="flex items-center gap-4">
                    <img src={el.firstProductImageUrl} />
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111118] text-base font-medium leading-normal line-clamp-1">
                        {el.name}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        {el.typeName}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        {el.finalPrice}
                      </p>
                      <p className="text-[#636388] text-sm font-normal leading-normal line-clamp-2">
                        {el.sellerName}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f0f0f4] text-[#111118] text-sm font-medium leading-normal w-fit">
                      <span className="truncate">Add to cart</span>
                    </button>
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
