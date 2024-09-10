'use client';

import { Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/signup/request`,
      {
        email,
        nickName: nickname,
        password,
      },
    );
    router.push('/close');
  };

  return (
    <div className="flex flex-col mt-[50px] p-[15px] items-center justify-center mb-[50px]">
      <div className="text-[30px] mb-[30px]">회원가입하기</div>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-[20px] flex flex-col">
          <label>이메일 (이메일 형식 example@example.com)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-solid border-b-2 w-[400px] rounded-lg"
          />
        </div>
        <div className="mb-[20px] flex flex-col">
          <label>닉네임 (3자이상 30자이하)</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="p-2 border border-solid border-b-2 w-[400px] rounded-lg"
          />
        </div>
        <div className="mb-[50px] flex flex-col justify-center items-center">
          <label>
            <p>
              비밀번호 : 길이가 8자에서 15자 사이여야 하고, 적어도 하나의 알파벳
              문자
            </p>
            <p>
              하나의 숫자, 하나의 특수 문자가 포함된 비밀번호를 확인하는 데
              사용됩니다.
            </p>
          </label>
          <input
            className="p-2 border border-solid border-b-2 w-[400px] rounded-lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="w-[396px] rounded-lg"
          variant="contained"
        >
          가입하기
        </Button>
      </form>
    </div>
  );
}
