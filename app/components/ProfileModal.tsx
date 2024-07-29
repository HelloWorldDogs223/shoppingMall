'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

interface Props {
  setModal: (value: boolean) => void;
  nickname: string;
  setImg: (args: string) => void;
  setImgFile: (args: File) => void;
  imgFile: File | null;
}

export default function ProfileModal({
  setModal,
  setImg,
  nickname,
  setImgFile,
  imgFile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { error, accessToken } = useFetch();

  const modalClickHandler = (e: any) => {
    e.stopPropagation();
    fileInputRef.current?.click(); // 파일 선택 창을 엽니다.
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!imgFile) {
      console.error('No file selected');
      return;
    }
    setModal(false);
  };

  useEffect(() => {
    if (imgFile) {
      // 파일이 선택된 후 폼을 자동으로 제출합니다.
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }, [imgFile]);

  return (
    <div>
      <div className="fixed w-full h-full left-0 top-0 bg-gray-500/50 z-[101]"></div>
      <div
        className="fixed inset-0 flex justify-center items-center z-[102]"
        onClick={() => setModal(false)}
      >
        <div
          onClick={(e: any) => e.stopPropagation()}
          className="flex flex-col justify-center items-center rounded-xl w-[500px] h-[500px] bg-white"
        >
          <p onClick={modalClickHandler} className="mb-[100px] cursor-pointer">
            프로필 이미지 변경하기
          </p>
          <p
            className="cursor-pointer"
            onClick={() => {
              setImg('');
              setModal(false);
            }}
          >
            프로필 이미지 삭제하기
          </p>
          <form ref={formRef} onSubmit={handleSubmit}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button type="submit" style={{ display: 'none' }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
