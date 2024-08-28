'use client';

import useAlarmStore from '@/app/store/alarm';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AlarmType {
  alarmId: number; // 알림 ID
  listenerId: number; // 알림 대상 회원 ID
  alarmType:
    | 'MEMBER_BAN'
    | 'REVIEW_BAN'
    | 'PRODUCT_BAN'
    | 'REFUND_REQUEST'
    | 'TYPE_DELETE'
    | 'TYPE_UPDATE';
  content: string; // 알림 내용
  targetRefundId: number; // 알림이 가리키는 환불 ID
  targetReviewId: number; // 알림이 가리키는 리뷰 ID
  targetProductId: number; // 알림이 가리키는 제품 ID
  isChecked: boolean; // 알림 확인 여부
}

export default function page() {
  const router = useRouter();

  const alarms = useAlarmStore((state) => state.alarms);
  const removeAlarm = useAlarmStore((state) => state.removeAlarm);

  const goToAlarm = (alarm: AlarmType) => {
    switch (alarm.alarmType) {
      case 'MEMBER_BAN':
        return;
      case 'PRODUCT_BAN':
        return;
      case 'REFUND_REQUEST':
        router.push('/list-refund');
      case 'TYPE_DELETE' || 'TYPE_UPDATE':
        router.push(`/product/${alarm.targetRefundId}`);
    }
  };

  const alarmDelete = (alarmId: number) => {
    const res = axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/alarm/${alarmId}`,
    );
    removeAlarm(alarmId);
  };

  return (
    <Grid container spacing={2}>
      {alarms.map((el: any) => (
        <Grid item xs={12} key={el.alarmId}>
          <Card onClick={() => goToAlarm(el)} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">알림 내용</Typography>
              <Typography variant="body2" color="textSecondary">
                {el.content}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 막기
                  alarmDelete(el.alarmId);
                }}
                style={{ marginTop: '10px' }}
              >
                알림 삭제하기
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
