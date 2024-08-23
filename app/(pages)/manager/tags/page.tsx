'use client';

import Tags from '@/app/components/Tags';
import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [productTypes, setProductTypes] = useState([]);

  const [add, setAdd] = useState('');

  const { accessToken } = useManagerFetch();

  const fetchData = async () => {
    const productListRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/types`,
    );
    setProductTypes(productListRes.data.productTypeList);
    location.reload();
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
        return <Tags el={el} fetchData={fetchData} />;
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
