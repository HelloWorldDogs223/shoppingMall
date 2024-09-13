'use client';

import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import Switch from '@mui/material/Switch';
import axios from 'axios';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function BasicSwitches() {
  const { accessToken } = useManagerFetch();

  const onOffClickHandler = (e: any) => {
    console.log('He');
    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/root-manager/manager-mode`,
      { isOn: e.target.value },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <label>관리자 모드 켜기 / 끄기</label>
      <Switch {...label} onChange={(e) => onOffClickHandler(e)} />
    </div>
  );
}
