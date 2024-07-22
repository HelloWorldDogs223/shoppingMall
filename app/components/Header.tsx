'use client';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const onClickHandler = () => {
    router.push('/signin');
  };

  return (
    <div className="relative mb-[100px] ">
      <div className="fixed top-0 left-0 z-[101] w-full flex justify-between px-10 py-3 border-b border-gray-200 border-solid items-center bg-gray-100">
        <div className="text-neutral-900 text-lg font-bold ">
          <h1 className="cursor-pointer">
            <Link href="/">JY Shopping Mall</Link>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex relative mr-[32px]">
            <input
              className="w-[300px] h-[40px] border-solid border-gray-600 border rounded-md px-[50px]"
              placeholder="검색어를 입력하세요."
            />
            <svg
              className="absolute left-[10px] top-[10px] cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                id="Vector - 0"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5306 18.4694L14.8366 13.7762C17.6629 10.383 17.3204 5.36693 14.0591 2.38935C10.7978 -0.588237 5.77134 -0.474001 2.64867 2.64867C-0.474001 5.77134 -0.588237 10.7978 2.38935 14.0591C5.36693 17.3204 10.383 17.6629 13.7762 14.8366L18.4694 19.5306C18.7624 19.8237 19.2376 19.8237 19.5306 19.5306C19.8237 19.2376 19.8237 18.7624 19.5306 18.4694ZM1.75 8.5C1.75 4.77208 4.77208 1.75 8.5 1.75C12.2279 1.75 15.25 4.77208 15.25 8.5C15.25 12.2279 12.2279 15.25 8.5 15.25C4.77379 15.2459 1.75413 12.2262 1.75 8.5Z"
                fill="#637587"
              />
            </svg>
          </div>
          <Button
            onClick={onClickHandler}
            variant="contained"
            className="w-[94px] h-10 px-4 bg-blue-500 rounded-xl justify-center items-center inline-flex cursor-pointer mr-[32px]"
          >
            <div className="flex-col justify-start items-center inline-flex">
              <div className="text-center text-white text-sm font-bold font-['Work Sans'] leading-[21px]">
                Sign in
              </div>
            </div>
          </Button>
          <div className="w-[84px] h-10 px-4 bg-gray-200 rounded-xl justify-center items-center inline-flex cursor-pointer mr-[32px]">
            <div className="flex-col justify-start items-center inline-flex">
              <div className="text-center text-neutral-900 text-sm font-bold font-['Work Sans'] leading-[21px]">
                Help
              </div>
            </div>
          </div>
          <Link href="/cart">
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
            >
              <path
                id="Vector - 0"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.875 0.125H2.125C1.43464 0.125 0.875 0.684644 0.875 1.375V12.625C0.875 13.3154 1.43464 13.875 2.125 13.875H15.875C16.5654 13.875 17.125 13.3154 17.125 12.625V1.375C17.125 0.684644 16.5654 0.125 15.875 0.125ZM15.875 12.625H2.125V1.375H15.875V12.625ZM12.75 3.875C12.75 5.94607 11.0711 7.625 9 7.625C6.92893 7.625 5.25 5.94607 5.25 3.875C5.25 3.52982 5.52982 3.25 5.875 3.25C6.22018 3.25 6.5 3.52982 6.5 3.875C6.5 5.25571 7.61929 6.375 9 6.375C10.3807 6.375 11.5 5.25571 11.5 3.875C11.5 3.52982 11.7798 3.25 12.125 3.25C12.4702 3.25 12.75 3.52982 12.75 3.875Z"
                fill="#121417"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
