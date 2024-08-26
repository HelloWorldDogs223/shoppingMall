import { useState } from 'react';
import { useManagerFetch } from '../hooks/useManagerFetch';
import axios from 'axios';
import { Button } from '@mui/material';

interface props {
  el: any;
  fetchData: (args: void) => void;
}

export default function Tags({ el, fetchData }: props) {
  const [edit, setEdit] = useState('');
  const { accessToken } = useManagerFetch();

  const editTags = async (tagId: number) => {
    if (edit === '') return;
    try {
      const res: any = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/type`,
        { typeName: edit, productTypeId: tagId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      fetchData();
    } catch (e: any) {
      alert('기본 타입은 수정하실 수 없습니다!');
    }
  };

  const deleteTags = async (productTypeId: number) => {
    try {
      const res: any = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/type?productTypeId=${productTypeId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (e: any) {
      alert('기본 타입은 제거하실 수 없습니다!');
    }
  };

  return (
    <div
      key={el.typeId}
      className="cursor-pointer mb-12 mr-4 shadow-lg rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
    >
      <div className="flex gap-3 p-3 items-center">
        <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-200 pl-4 pr-4">
          <p className="text-[#0e141b] text-sm font-medium leading-normal">
            <span className="mr-[1rem]">
              {el.typeName.includes('base:')
                ? el.typeName.split('base:')[1]
                : el.typeName}
            </span>
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
              <Button onClick={() => deleteTags(el.typeId)}>
                태그 삭제하기
              </Button>
            </form>
          </p>
        </div>
      </div>
    </div>
  );
}
