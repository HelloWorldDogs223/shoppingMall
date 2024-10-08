import { Button, CircularProgress } from '@mui/material';
import apiClient from '../utils/axiosSetting';
import { useManagerFetch } from '../hooks/useManagerFetch';
import { useEffect, useState } from 'react';

interface ReportRecordType {
  // 조회된 제품신고 데이터 리스트
  reportId: number; // 신고 데이터 ID
  reportCreatedDate: string; // 신고 일자
  reporterId: number; // 신고자 ID
  reporterName: string; // 신고자 닉네임
  title: string; // 신고 제목
  description: string; // 신고 내용
  isProcessedComplete: boolean; // 신고 처리여부
  reportResultType:
    | 'WAITING_PROCESSED' // 처리결과 - 처리를 기다리는 중
    | 'NO_ACTION'
    | 'TARGET_BAN' // 처리결과 - 해당 리뷰/제품 벤
    | 'MEMBER_BAN'; // 처리결과 - 회원 벤
  productId: number; // 신고 제품 ID
  productName: string; // 신고 제품 이름
  sellerId: number; // 신고 제품 판매자 ID
  sellerName: string; // 신고 제품 판매자 이름
  writer: number; // 신고된 리뷰 작성자 ID
  writerName: string;
  reviewTitle: string;
}
const getReportResultText = (
  reportResultType: ReportRecordType['reportResultType'],
) => {
  switch (reportResultType) {
    case 'WAITING_PROCESSED':
      return 'Waiting for Processing';
    case 'NO_ACTION':
      return 'No Action Taken';
    case 'TARGET_BAN':
      return 'Target Banned';
    case 'MEMBER_BAN':
      return 'Member Banned';
    default:
      return '';
  }
};

export default function ReportRecordModal({ sellerId, onClose, mode }: any) {
  const { accessToken } = useManagerFetch();
  const [report, setReport] = useState<ReportRecordType[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리

  const getReportRecord = async () => {
    setLoading(true); // 데이터 요청 전 로딩 상태 활성화
    try {
      let reportRes: any;
      if (mode === 'review') {
        reportRes = await apiClient.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/writer/reports?sliceNumber=0&sliceSize=999&sell&reviewWriterId=${sellerId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } else {
        reportRes = await apiClient.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/seller/reports?sliceNumber=0&sliceSize=999&sell&productSellerId=${sellerId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }
      setReport(
        reportRes.data[
          mode === 'review' ? 'reviewReportList' : 'productReportList'
        ],
      );
    } catch (error) {
      console.error('Failed to fetch report records:', error);
    }
    setLoading(false); // 데이터 요청 후 로딩 상태 비활성화
  };

  useEffect(() => {
    getReportRecord();
  }, []);

  if (loading) {
    // 로딩 중에는 로딩 인디케이터를 보여줍니다.
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CircularProgress /> {/* 로딩 인디케이터 컴포넌트 */}
      </div>
    );
  }

  return (
    <>
      {report && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto"
          onClick={onClose}
        >
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto"
            onClick={onClose}
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              {report.map((el: ReportRecordType) => {
                return (
                  <div key={el.productId} onClick={(e) => e.stopPropagation()}>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Report Details
                      </h2>
                      <div className="mb-4">
                        <p className="text-gray-700">
                          <strong>Title:</strong> {el.title}
                        </p>
                        <p className="text-gray-700">
                          <strong>reporter:</strong> {el.reporterName} (ID:{' '}
                          {el.reportId})
                        </p>
                        <p className="text-gray-700">
                          <strong>report Date:</strong> {el.reportCreatedDate}
                        </p>
                        <p className="text-gray-700">
                          <strong>Description:</strong> {el.description}
                        </p>
                        <p className="text-gray-700">
                          <strong>Processed:</strong>{' '}
                          {el.isProcessedComplete ? 'Yes' : 'No'}
                        </p>
                        <p className="text-gray-700">
                          <strong>Result:</strong>{' '}
                          {getReportResultText(el.reportResultType)}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {el.productName ? 'Product Info:' : 'review Info'}
                        </h3>
                        <p className="text-gray-700">
                          <strong>
                            {el.productName ? 'Product Name:' : 'review Name'}
                          </strong>
                          {el.productName || el.reviewTitle}
                        </p>
                        <p className="text-gray-700">
                          <strong>
                            {el.productName ? 'Seller Name:' : 'writer Name:'}
                          </strong>
                          {el.sellerName || el.writerName} (ID:
                          {el.sellerId || el.writer})
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => onClose()}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
