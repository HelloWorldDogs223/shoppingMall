'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SalesSummary {
  year: number;
  month: number;
  revenuePrice: number;
  refundPrice: number;
}

const MonthlySalesSummaryComponent: React.FC = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const fetchData = async () => {
    try {
      const response = await axios.get<SalesSummary>(
        '/seller/month/purchases/price',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            year,
            month,
          },
        },
      );
      setSalesSummary(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (!salesSummary) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">월별 판매액 및 환불액 요약</h1>
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
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          조회
        </button>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {salesSummary.year}년 {salesSummary.month}월 판매 요약
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold text-green-800">총 판매액</h3>
            <p className="text-2xl text-green-600">
              {formatCurrency(salesSummary.revenuePrice)}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold text-red-800">총 환불액</h3>
            <p className="text-2xl text-red-600">
              {formatCurrency(salesSummary.refundPrice)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">순 수익</h3>
          <p className="text-2xl">
            {formatCurrency(
              salesSummary.revenuePrice - salesSummary.refundPrice,
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesSummaryComponent;
