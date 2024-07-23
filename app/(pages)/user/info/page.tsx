'use client';

import Card from '@/app/components/Card';
import { Button } from '@mui/material';

export default function Page() {
  return (
    <div className="px-[196px] h-full pb-[100px]">
      <div className="flex items-center">
        <img
          src="/example6.jpg"
          className="w-[80px] h-[80px] rounded-full mr-[12px]"
          alt="avatar"
        />
        <div className="flex justify-between w-full">
          <div className="flex flex-col ">
            <span>핼렌</span>
            <span>UI/UX</span>
            <span>샌프란시스코</span>
          </div>
          <div>
            <Button
              className="w-[120px] h-[50px] mr-[16px]"
              variant="contained"
            >
              프로필 편집
            </Button>
            <Button
              className="w-[120px] h-[50px] bg-red-600  hover:bg-black"
              variant="contained"
            >
              회원 탈퇴
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-[100px] mb-[100px] text-[30px] font-bold">
        장바구니
      </div>
      <div className="flex flex-wrap">
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
      </div>
      <div className="mt-[100px] mb-[100px] text-[30px] font-bold">찜 목록</div>
      <div className="flex flex-wrap">
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img
          className="w-[200px] h-[200px] mr-[16px] mb-[16px]"
          src="/example4.png"
        />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
        <img className="w-[200px] h-[200px] mr-[16px]" src="/example4.png" />
      </div>
    </div>
  );
}
