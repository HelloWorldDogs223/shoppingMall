'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

export default function Page() {
  const [password, setPassword] = useState('');
  const { accessToken } = useFetch();

  const submitHandler = () => {
    axios.delete(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`, {
      data: {
        password,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>탈퇴를 위해 비밀번호를 입력하세요</div>
        <div>주의! 회원탈퇴를 되돌릴 수 없습니다</div>
        <input
          type="password"
          className="w-[400px] h-[50px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={submitHandler}>탈퇴하기</Button>
      </form>
    </div>
  );
}
