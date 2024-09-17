'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import { useFetch } from '../hooks/useFetch';

interface SingleOption {
  optionName: string;
  priceChangeAmount: number;
}

interface Item {
  purchaseItemId: number;
  productName: string;
  productTypeName: string;
  selectedSingleOption: SingleOption;
  price: number;
  discountAmount: number;
  discountRate: number;
  finalPrice: number;
  isRefund: boolean;
}

interface RefundInfo {
  refundPrice: number;
  refundState: string;
  responseContent: string;
}

interface BuyListProps {
  item: Item;
}

export default function BuyList({ item }: BuyListProps) {
  const [requestTitle, setRequestTitle] = useState('');
  const [requestContent, setRequestContent] = useState('');
  const [refundInfo, setRefundInfo] = useState<RefundInfo[]>([]);
  const { accessToken } = useFetch();

  useEffect(() => {
    getRefundList(item.purchaseItemId);
  }, [item.purchaseItemId]);

  const getRefundList = async (id: number) => {
    try {
      const response = await axios.get<{ refundList: RefundInfo[] }>(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/purchaseItem/refunds`,
        {
          params: { sliceNumber: 0, sliceSize: 99, purchaseItemId: id },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setRefundInfo(response.data.refundList);
    } catch (error) {
      console.error('Failed to fetch refund list:', error);
      alert('환불 목록을 불러오는데 실패했습니다.');
    }
  };

  const getRefund = async () => {
    if (!requestTitle.trim() || !requestContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/refund`,
        {
          purchaseItemId: item.purchaseItemId,
          requestTitle,
          requestContent,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.data.refundId) {
        alert('환불 요청이 완료되었습니다.');
        setRequestTitle('');
        setRequestContent('');
        getRefundList(item.purchaseItemId);
      }
    } catch (error) {
      console.error('Failed to submit refund request:', error);
      if (axios.isAxiosError(error)) {
        alert(
          `환불 요청 실패: ${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`,
        );
      } else {
        alert('환불 요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 3 } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          제품 정보
        </Typography>
        <Typography variant="body1">제품 이름: {item.productName}</Typography>
        <Typography variant="body1">
          제품 타입: {item.productTypeName}
        </Typography>
        <Typography variant="body1">
          단일 옵션: {item.selectedSingleOption.optionName}
        </Typography>
        <Typography variant="body1">
          단일 옵션 가격: {item.selectedSingleOption.priceChangeAmount}원
        </Typography>
        <Typography variant="body1">가격: {item.price}원</Typography>
        <Typography variant="body1">할인: {item.discountAmount}원</Typography>
        <Typography variant="body1">할인율: {item.discountRate}%</Typography>
        <Typography variant="body1">
          최종 상품 가격: {item.finalPrice}원
        </Typography>
        <Typography variant="body1">
          환불 여부: {item.isRefund ? '환불됨' : '안됨'}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          환불 요청
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ '& > *': { mb: 2 } }}
        >
          <TextField
            fullWidth
            label="환불 요청 제목"
            variant="outlined"
            value={requestTitle}
            onChange={(e) => setRequestTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="환불 요청 내용"
            variant="outlined"
            multiline
            rows={4}
            value={requestContent}
            onChange={(e) => setRequestContent(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={getRefund}
          >
            환불 요청하기
          </Button>
        </Box>

        {refundInfo.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              환불 정보
            </Typography>
            {refundInfo.map((info, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body1">
                  환불 가격: {info.refundPrice}원
                </Typography>
                <Typography variant="body1">
                  환불 진행 상태: {info.refundState}
                </Typography>
                <Typography variant="body1">
                  판매자 응답: {info.responseContent}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
