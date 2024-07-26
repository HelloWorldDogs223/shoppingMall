'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getCookie(name: string) {
  let cookieArr = document.cookie.split(';');
  console.log(cookieArr);

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split('=');

    /* 이름의 앞뒤 공백을 제거하고 쿠키 이름과 비교 */
    if (name == cookiePair[0].trim()) {
      /* 쿠키의 값을 반환 */
      return decodeURIComponent(cookiePair[1]);
    }
  }
  /* 이름에 해당하는 쿠키가 없으면 null 반환 */
  return null;
}

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (getCookie('refresh')) alert('hegehehe');
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fafb] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/example2.png")',
                  }}
                >
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] text-center">
                    Discover the latest fashion trends
                  </h1>
                  <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div
                        className="text-[#4f7396] flex border border-[#d0dbe6] bg-[#f8fafb] items-center justify-center pl-[15px] rounded-l-xl border-r-0"
                        data-icon="MagnifyingGlass"
                        data-size="20px"
                        data-weight="regular"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                      </div>
                      <input
                        placeholder="Search for stores"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe6] bg-[#f8fafb] focus:border-[#d0dbe6] h-full placeholder:text-[#4f7396] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                      <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#d0dbe6] bg-[#f8fafb] pr-[7px]">
                        <Button
                          onClick={() => router.push('/list')}
                          variant="contained"
                          className=" flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#348de5] text-[#f8fafb] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                        >
                          <span className="truncate">눌러보세요</span>
                        </Button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/stability/d68c25bc-d94b-40c9-b9ae-340cc1d12997.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/stability/c1e9756b-74ea-422f-9aca-209bb668b6c3.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/294c44d3-cec9-498c-b438-bfebe847c92b.png")',
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
              Featured Stores
            </h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/adf52f89-2889-4232-879c-8b279bb7df1a.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/ae3ecbe8-50d3-4053-a2a6-f53686454a9c.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/61d37e15-dbbc-459b-a8c7-b194e74615d1.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/3ed077e6-18da-4b47-ac9e-8449c386edef.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/0da04058-22ff-4fa8-a901-acbabff7afa0.png")',
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
              Latest Deals
            </h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/20b70f4b-01bb-49b4-ada2-16fd71f4b747.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Men's Fashion
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 50% off
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/stability/1be2dfdf-5efb-4fb8-b0a0-b224e5766f7d.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Women's Fashion
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 40% off
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/3e4e65ba-dded-427a-85d8-35dd4dd88ee9.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Kids' Fashion
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 60% off
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/128f526e-7bac-4a19-9b89-3f8b61ce7bb9.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Home Decor
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 30% off
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/stability/bca8239d-243b-4579-b61b-158e4389ac85.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Electronics
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 20% off
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/23868830-8272-4a5c-b1ea-4433c6f96872.png")',
                  }}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Sports Gear
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    Up to 70% off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
