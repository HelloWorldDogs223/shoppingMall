'use client';

import { useFetch } from '@/app/hooks/useFetch';
import useAuthStore from '@/app/store/login';
import { Button } from '@mui/material';
import axios from 'axios';

export default function Page() {
  const { accessToken } = useFetch();
  const { clearAccessToken } = useAuthStore();

  const submitHandler = () => {
    axios.delete(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    clearAccessToken();
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <Button onClick={submitHandler}>탈퇴하기</Button>
      </form>
    </div>
  );
}
