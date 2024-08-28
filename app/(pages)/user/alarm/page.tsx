'use client';

import useAlarmStore from '@/app/store/alarm';
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

  return (
    <div>
      {alarms.map((el: AlarmType) => {
        return (
          <div onClick={() => goToAlarm(el)}>
            <div>알림 내용 : {el.content}</div>
          </div>
        );
      })}
    </div>
  );
}
