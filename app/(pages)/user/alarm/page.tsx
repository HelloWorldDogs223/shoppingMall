'use client';

import { useFetch } from '@/app/hooks/useFetch';
import useAlarmStore from '@/app/store/alarm';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface AlarmType {
  alarmId: number;
  listenerId: number;
  alarmType:
    | 'MEMBER_BAN'
    | 'REVIEW_BAN'
    | 'PRODUCT_BAN'
    | 'REFUND_REQUEST'
    | 'TYPE_DELETE'
    | 'TYPE_UPDATE';
  content: string;
  targetRefundId: number;
  targetReviewId: number;
  targetProductId: number;
  isChecked: boolean;
}

export default function AlarmPage() {
  const router = useRouter();
  const { accessToken, error } = useFetch();
  const alarms = useAlarmStore((state) => state.alarms);
  const removeAlarm = useAlarmStore((state) => state.removeAlarm);

  useEffect(() => {
    if (error) router.push('/');
  }, [error, router]);

  const goToAlarm = useCallback(
    (alarm: AlarmType) => {
      switch (alarm.alarmType) {
        case 'MEMBER_BAN':
        case 'PRODUCT_BAN':
          // Handle these cases if needed
          break;
        case 'REFUND_REQUEST':
          router.push('/list-refund');
          break;
        case 'TYPE_DELETE':
        case 'TYPE_UPDATE':
          router.push(`/product/${alarm.targetRefundId}`);
          break;
      }
    },
    [router],
  );

  const handleAlarmDelete = useCallback(
    async (alarmId: number) => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/alarm/${alarmId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        removeAlarm(alarmId);
      } catch (error) {
        console.error('Failed to delete alarm:', error);
        // Handle error (e.g., show error message to user)
      }
    },
    [accessToken, removeAlarm],
  );

  return (
    <Grid container spacing={2}>
      {alarms.map((alarm: AlarmType) => (
        <Grid item xs={12} key={alarm.alarmId}>
          <AlarmCard
            alarm={alarm}
            onAlarmClick={goToAlarm}
            onDeleteClick={handleAlarmDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}

interface AlarmCardProps {
  alarm: AlarmType;
  onAlarmClick: (alarm: AlarmType) => void;
  onDeleteClick: (alarmId: number) => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onAlarmClick,
  onDeleteClick,
}) => (
  <Card onClick={() => onAlarmClick(alarm)} style={{ cursor: 'pointer' }}>
    <CardContent>
      <Typography variant="h6">알림 내용</Typography>
      <Typography variant="body2" color="textSecondary">
        {alarm.content}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(alarm.alarmId);
        }}
        style={{ marginTop: '10px' }}
      >
        알림 삭제하기
      </Button>
    </CardContent>
  </Card>
);
