'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative flex justify-center items-center size-full min-h-screen flex-col bg-[#f8fcf8] group/design-root overflow-x-hidden">
      <div className="layout-container flex  grow flex-col h-full justify-center items-center">
        <div className="px-40 flex flex-1 justify-center py-5 h-full items-center">
          <div className="layout-content-container flex flex-col w-[512px]  py-5 max-w-[960px] flex-1 h-full ">
            <h3 className="text-[#0e1b0f] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5 h-full">
              Welcome
            </h3>
            <p className="text-[#0e1b0f] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Your email address has been verified.
            </p>
            <div className="flex px-4 py-3">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#17cf20] text-[#0e1b0f] text-base font-bold leading-normal tracking-[0.015em]">
                <span
                  className="truncate"
                  onClick={() => router.push('/user/info')}
                >
                  Continue to your dashboard
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
