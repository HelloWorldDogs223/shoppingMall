'use client';

import Card from '@/app/components/Card';
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function Page() {
  const [prodcutList, setProductList] = useState([]);

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductList(productListRes.data.productTypeList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fafb] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <a
                className="text-[#4f7396] text-base font-medium leading-normal"
                href="#"
              >
                Home
              </a>
              <span className="text-[#4f7396] text-base font-medium leading-normal">
                /
              </span>
              <a
                className="text-[#4f7396] text-base font-medium leading-normal"
                href="#"
              >
                Women
              </a>
              <span className="text-[#4f7396] text-base font-medium leading-normal">
                /
              </span>
              <span className="text-[#0e141b] text-base font-medium leading-normal">
                Clothing
              </span>
            </div>

            {prodcutList.map((el: any) => {
              return (
                <>
                  <div className="flex gap-3 p-3 overflow-x-hidden">
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                      <p className="text-[#0e141b] text-sm font-medium leading-normal">
                        {el.typeName}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
