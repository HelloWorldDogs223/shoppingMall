import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DeliveryInfo {
  senderName: string;
  senderAddress: string;
  senderPostCode: string;
  senderTel: string;
}

interface SingleOption {
  optionId: number;
  optionName: string;
  priceChangeAmount: number;
}

interface MultiOption {
  optionId: number;
  optionName: string;
  priceChangeAmount: number;
}

interface PurchaseItem {
  buyerId: number;
  deliveryInfo: DeliveryInfo;
  dateTime: string;
  purchaseItemId: number;
  productId: number;
  selectedSingleOption: SingleOption;
  selectedMultiOptions: MultiOption[];
  price: number;
  discountAmount: number;
  discountRate: number;
  finalPrice: number;
  isRefund: boolean;
}

interface PurchaseData {
  currentSliceNumber: number;
  sliceSize: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  purchaseItemList: PurchaseItem[];
  totalElements?: number;
}

const MonthlyPurchasesComponent: React.FC = () => {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [sliceNumber, setSliceNumber] = useState<number>(0);
  const [sliceSize, setSliceSize] = useState<number>(10);

  useEffect(() => {
    fetchData();
  }, [year, month, sliceNumber, sliceSize]);

  const fetchData = async () => {
    try {
      const response = await axios.get<PurchaseData>(
        '/seller/month/purchases',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            sliceNumber,
            sliceSize,
            year,
            month,
          },
        },
      );
      setPurchaseData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrevious = () => {
    if (purchaseData?.hasPrevious) {
      setSliceNumber(sliceNumber - 1);
    }
  };

  const handleNext = () => {
    if (purchaseData?.hasNext) {
      setSliceNumber(sliceNumber + 1);
    }
  };

  if (!purchaseData) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">월별 판매 기록</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
          placeholder="Year"
        />
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          min={1}
          max={12}
          className="border rounded px-2 py-1"
          placeholder="Month"
        />
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">구매자 ID</th>
            <th className="border p-2">구매일시</th>
            <th className="border p-2">상품 ID</th>
            <th className="border p-2">최종 가격</th>
            <th className="border p-2">환불 여부</th>
          </tr>
        </thead>
        <tbody>
          {purchaseData.purchaseItemList.map((item) => (
            <tr key={item.purchaseItemId}>
              <td className="border p-2">{item.buyerId}</td>
              <td className="border p-2">{item.dateTime}</td>
              <td className="border p-2">{item.productId}</td>
              <td className="border p-2">{item.finalPrice}</td>
              <td className="border p-2">{item.isRefund ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={!purchaseData.hasPrevious}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          이전
        </button>
        <span>
          Page {purchaseData.currentSliceNumber + 1} of{' '}
          {purchaseData.totalElements &&
            Math.ceil(purchaseData.totalElements / purchaseData.sliceSize)}
        </span>
        <button
          onClick={handleNext}
          disabled={!purchaseData.hasNext}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MonthlyPurchasesComponent;
