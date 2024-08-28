import { create } from 'zustand';

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

interface AlarmStore {
  alarms: AlarmType[];
  addAlarm: (alarm: AlarmType) => void;
  removeAlarm: (alarmId: number) => void;
  clearAlarms: () => void;
  setAlarms: (alarms: AlarmType[]) => void;
}

const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],
  addAlarm: (alarm: AlarmType) =>
    set((state) => ({
      alarms: [...state.alarms, alarm],
    })),
  removeAlarm: (alarmId: number) =>
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.alarmId !== alarmId),
    })),
  clearAlarms: () => set({ alarms: [] }),
  setAlarms: (alarms: AlarmType[]) => set({ alarms }),
}));

export default useAlarmStore;
