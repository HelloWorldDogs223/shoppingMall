'use client';

import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [productTypes, setProductTypes] = useState([]);
  const [edit, setEdit] = useState('');
  const [add, setAdd] = useState('');

  const { accessToken } = useManagerFetch();

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
  };

  const editTags = (tagId: number) => {
    if (edit === '') return;
    const res: any = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/type`,
      { typeName: edit, productTypeId: tagId },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    fetchData();
  };

  const addTags = () => {
    if (add === '') return;
    const res: any = axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/type`,
      { typeName: add },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {productTypes.map((el: any) => {
        return (
          <div
            key={el.typeId}
            className="cursor-pointer mb-12 mr-4 shadow-lg rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
          >
            <div className="flex gap-3 p-3 items-center">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-200 pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  <span className="mr-[1rem]"> {el.typeName}</span>
                  <form
                    onSubmit={() => editTags(el.typeId)}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      value={edit}
                      onChange={(e) => setEdit(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      placeholder="Edit tag"
                    />
                    <Button
                      onClick={() => editTags(el.typeId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                      태그 수정하기
                    </Button>
                  </form>
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-8">
        <form onSubmit={addTags} className="flex items-center gap-3">
          <input
            value={add}
            onChange={(e) => setAdd(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Add new tag"
          />
          <Button
            onClick={() => addTags()}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            새로 태그 생성하기
          </Button>
        </form>
      </div>
    </div>
  );
}
