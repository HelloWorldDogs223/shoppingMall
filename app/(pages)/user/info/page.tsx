'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Page() {
  const [edit, setEdit] = useState(false);

  useFetch();

  return (
    <div
      className="relative flex  min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden mx-auto"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container mx-auto flex flex-col min-w-[960px] flex-1 items-center">
            <div className="flex p-4 @container justify-center">
              <div className="flex w-full flex-col gap-4 items-start">
                <div className="flex gap-4 flex-col items-start">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{
                      backgroundImage:
                        'url("https://cdn.usegalileo.ai/stability/77b57bfe-1501-4498-b8a4-24d719383033.png")',
                    }}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      Jane Doe
                    </p>
                    <p className="text-[#4e7397] text-base font-normal leading-normal">
                      @jane_doe
                    </p>
                  </div>
                </div>
                {!edit ? (
                  <button
                    onClick={() => setEdit(true)}
                    className="flex  cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em] w-full min-w-[480px] @[480px]:w-auto"
                  >
                    <span className="truncate">Edit profile</span>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {edit ? (
              <>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Nickname
                    </p>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal" />
                  </label>
                </div>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Profile Image
                    </p>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal" />
                  </label>
                </div>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Bio
                    </p>
                    <textarea className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] min-h-36 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal"></textarea>
                  </label>
                </div>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Contact Details
                    </p>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal" />
                  </label>
                </div>
                <div className="flex px-4 py-3">
                  <Button
                    variant="contained"
                    onClick={() => setEdit(false)}
                    className="flex w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#1980e6] text-slate-50 text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Save Changes</span>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
