'use client';

import axios from 'axios';
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

interface Props {
  setModal: (args: boolean) => void;
  productId: number;
  review?: boolean;
  reviewId?: number;
}

declare global {
  interface Window {
    IMP: any;
  }
}

export default function ReportModal({
  setModal,
  productId,
  review,
  reviewId,
}: Props) {
  const { accessToken } = useFetch();

  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const reportHandler = () => {
    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/report`,
      { productId, reportTitle, reportDescription },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  const reviewReportHandler = () => {
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/report`, {
      reportTitle,
      reportDescription,
      reviewId,
    });
  };

  return (
    <div
      className="fixed w-screen h-screen bg-gray-500/50 top-0 left-0 z-[101] flex items-center justify-center"
      onClick={(e: any) => {
        setModal(false);
      }}
    >
      <div
        className="bg-white flex flex-col overflow-x-hidden  max-w-lg p-4 min-w-[800px]"
        onClick={(e: any) => e.stopPropagation()}
      >
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Report
              </h2>
              <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col justify-center">
                    <input
                      placeholder="신고 제목"
                      className="border-red-500 border-solid border  rounded-md p-1 w-[500px] mb-[1rem]"
                      onChange={(e: any) => setReportTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="신고 내용"
                      className="border-red-500 border-solid border  rounded-md p-1 resize-none h-[250px]"
                      onChange={(e: any) =>
                        setReportDescription(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex px-4 py-3 mt-[1rem]">
                <button
                  onClick={!review ? reportHandler : reviewReportHandler}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#197ce6] text-white text-base font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Continue to Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
