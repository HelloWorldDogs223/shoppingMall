'use client';

import { useFetch } from '@/app/hooks/useFetch';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/app/utils/axiosSetting';

export default function Page() {
  const { error, accessToken } = useFetch();

  const [postEmail, setPostEmail] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  const [nickname, setNickname] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [email, setEmail] = useState<string>('');
  const [editEmail, setEditEmail] = useState('');
  const [count, setCount] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown in seconds
  const [img, setImg] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [emailError, setEmailError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // HTMLInputElement로 타입 지정

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); // 파일 입력 창을 엽니다.
  };
  const router = useRouter();

  const fetchUser = async () => {
    if (!accessToken) return;

    const userInfoRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setImg(userInfoRes.data?.profileImageDownLoadUrl);
    setEmail(userInfoRes.data.email);
    setNickname(userInfoRes.data.nickName);

    if (userInfoRes.data.isBan) {
      alert('밴이 된 유저입니다.');
      router.push('/');
    }
  };

  useEffect(() => {
    if (error) {
      router.push('/signin');
    }
    fetchUser();
  }, [error, router, accessToken]);

  const emailCheckHandler = async () => {
    if (email === '') {
      setEmailError(true);
      return;
    }
    if (count) {
      alert('시간이 아직 남아있습니다.');
      return;
    }
    const res: any = await apiClient.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/email/registration/request`,
      { email: editEmail },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setCount(true);
    setCountdown(180); // Reset to 3 minutes
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (count && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCount(false);
    }
    return () => clearTimeout(timer);
  }, [count, countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const onNicknameChangeHandler = (e: any) => {
    setEditNickname(e.target.value);
  };

  const onEmailChangeHandler = (e: any) => {
    setEditEmail(e.target.value);
    setEmailError(false);
  };

  const onSubmitHandler = async () => {
    try {
      const res: any = await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/info`,
        { nickName: editNickname, profileImg: imgFile },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setNickname(editNickname);
    } catch (error) {
      console.error('Error:', error);
      alert('올바른 한글 / 영어 닉네임을 입력해주세요!');
    } finally {
      fetchUser();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string); // 파일 내용을 상태로 설정합니다.
      };
      reader.readAsDataURL(file); // 파일 내용을 Data URL로 읽습니다.
    }
  };

  return (
    <div
      className="relative flex  min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden mx-auto"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container mx-auto flex flex-col min-w-[960px] flex-1 items-center">
            <div className="flex p-4 @container justify-center">
              <div className="flex w-full flex-col gap-4 items-start">
                <div className="flex gap-4 flex-col items-start">
                  <img
                    alt="avatar"
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    src={
                      img
                        ? img
                        : 'https://cdn.usegalileo.ai/stability/77b57bfe-1501-4498-b8a4-24d719383033.png'
                    }
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      닉네임 : {nickname}
                    </p>
                    <p className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      이메일 : {email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/list-product-sell')}
                >
                  판매자 - 내 판매 제품 목록 확인하기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/withdraw')}
                >
                  회원탈퇴하기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/review')}
                >
                  내 판매 정산 보기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/list-refund-buyer')}
                >
                  구매자 - 환불 요청 목록 확인하기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/list-refund')}
                >
                  판매자 - 환불 요청 목록 확인하기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/list-buy')}
                >
                  구매 목록 확인하기
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/bank')}
                >
                  계좌 등록 및 조회
                </Button>
                <Button
                  variant="contained"
                  className="w-[480px]"
                  onClick={() => router.push('/chat')}
                >
                  채팅방 확인하기
                </Button>
                {!edit ? (
                  <button
                    onClick={() => setEdit(true)}
                    className="flex  cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em] w-full min-w-[480px] @[480px]:w-auto"
                  >
                    <span className="truncate">프로필 수정하기</span>
                  </button>
                ) : (
                  <></>
                )}
                {postEmail === false && edit === false && (
                  <Button
                    className="w-[480px] bg-red-300"
                    variant="contained"
                    onClick={() => setPostEmail(true)}
                  >
                    이메일 등록
                  </Button>
                )}
              </div>
            </div>

            {postEmail && (
              <div>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3 relative">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Email
                    </p>
                    <input
                      disabled={count ? true : false}
                      onChange={onEmailChangeHandler}
                      value={editEmail}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal"
                    />
                  </label>
                  <p
                    onClick={emailCheckHandler}
                    className="absolute right-[35px] bottom-[25px] cursor-pointer text-blue-500"
                  >
                    인증하기
                  </p>
                </div>
                <Button variant="contained" onClick={() => setPostEmail(false)}>
                  저장하고 나가기
                </Button>
              </div>
            )}

            {count && countdown > 0 && (
              <p className="text-red-500">남은 시간: {formatTime(countdown)}</p>
            )}

            {!count && countdown === 0 && (
              <p className="text-red-500">
                이메일이 만료되었습니다. 다시 인증해주세요!
              </p>
            )}

            {emailError && (
              <p className="text-red-500">이메일을 입력해주세요!</p>
            )}

            {edit ? (
              <>
                <div className="flex min-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <div className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                      Nickname 변경하기
                    </p>
                    <input
                      type="text"
                      onChange={onNicknameChangeHandler}
                      value={editNickname}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // 파일 입력을 숨깁니다.
                  />
                  <button
                    onClick={handleFileButtonClick}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 p-[15px] text-base font-normal leading-normal cursor-pointer"
                  >
                    프로필 이미지 변경하기
                  </button>
                </div>

                <div className="flex px-4 py-3">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEdit(false);
                      onSubmitHandler();
                    }}
                    disabled={count}
                    className={`flex w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 ${!count ? 'bg-[#1980e6] text-slate-50' : 'bg-gray-300 text-white'} text-base font-bold leading-normal tracking-[0.015em]`}
                  >
                    <span className="truncate">Save Changes</span>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
