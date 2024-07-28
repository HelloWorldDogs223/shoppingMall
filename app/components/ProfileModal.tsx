interface Props {
  setModal: (args: boolean) => void;
  setImg: (args: string) => void;
}

import React, { useRef } from 'react';

interface Props {
  setModal: (value: boolean) => void;
}

export default function ProfileModal({ setModal, setImg }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modalClickHandler = (e: any) => {
    e.stopPropagation();
    fileInputRef.current?.click(); // 파일 선택 창을 엽니다.
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string); // 파일 내용을 상태로 설정합니다.
      };
      reader.readAsDataURL(file); // 파일 내용을 Data URL로 읽습니다.
    }
    setModal(false);
  };

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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
