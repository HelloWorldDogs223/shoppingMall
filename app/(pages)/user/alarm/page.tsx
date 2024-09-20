'use client';

import { useFetch } from '@/app/hooks/useFetch';
import useAlarmStore from '@/app/store/alarm';
import apiClient from '@/app/utils/axiosSetting';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import { Notifications, Delete } from '@mui/icons-material';
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
          // 필요한 경우 처리 로직 추가
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
        await apiClient.delete(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/alarm/${alarmId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        removeAlarm(alarmId);
      } catch (error) {
        console.error('Failed to delete alarm:', error);
      }
    },
    [accessToken, removeAlarm],
  );

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          알림 목록
        </Typography>
      </Grid>
      {alarms.map((alarm: AlarmType) => (
        <Grid item xs={12} sm={6} md={4} key={alarm.alarmId}>
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
  <Card
    onClick={() => onAlarmClick(alarm)}
    style={{
      cursor: 'pointer',
      position: 'relative',
      backgroundColor: alarm.isChecked ? '#f5f5f5' : '#fff',
    }}
    elevation={3}
  >
    <CardContent>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Badge
            color="secondary"
            variant="dot"
            invisible={alarm.isChecked}
            overlap="circular"
          >
            <Avatar>
              <Notifications />
            </Avatar>
          </Badge>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" gutterBottom>
            {alarm.content}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(alarm.alarmId);
            }}
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
