'use client';

interface DataType {
  id: number; // 채팅방 ID
  unreadMessageCount: number; // 읽지 않은 메세지 개수
  buyer: {
    // 채팅방에 참여중인 예비 구매자
    id: number; // 예비 구매자 ID
    nickName: string; // 예비 구매자 닉네임
    profileImageDownLoadUrl: string; // 예비 구매자 프로필 이미지
  };
  seller: {
    // 채팅방에 참여중인 판매자
    id: number; // 판매자 ID
    nickName: string; // 판매자  닉네임
    profileImageDownLoadUrl: string; // 판매자  프로필 이미지
  };
  product: {
    // 판매제품
    productId: number; // 제품ID
    sellerId: number; // 판매자ID
    sellerName: string; // 판매자명
    typeId: number; // 제품타입ID
    typeName: string; // 제품타입명
    firstProductImageUrl: string; // 첫번째 제품 이미지
    name: string; // 제품명
    price: number; // 가격
    discountAmount: number; // 할인양
    discountRate: number; // 할인율
    isBan: Boolean; // 밴여부
    scoreAvg: number; // 평점
    finalPrice: number; // 최종가격
    saleState: 'ON_SALE' | 'DISCONTINUED'; // 제품 판매여부
  };
}

import { useRouter } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const { accessToken } = useFetch();

  const router = useRouter();

  const [sellerRooms, setSellerRooms] = useState<DataType[]>([]);
  const [buyerRooms, setBuyerRooms] = useState<DataType[]>([]);

  // 판매자 입장에서의 채팅방 조회

  const getChatRoomBySeller = async () => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/seller/chatrooms?sliceNumber=0&sliceSize=100`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );
    setSellerRooms(res.data.chatRoomList);
  };

  // 구매자 입장에서의 채팅방 조회
  const getChatRoomByBuyer = async () => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/buyer/chatrooms?sliceNumber=0&sliceSize=100`,
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      },
    );
    setBuyerRooms(res.data.chatRoomList);
  };

  useEffect(() => {
    getChatRoomByBuyer();
    getChatRoomBySeller();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-6">
        구매자 채팅방 목록
      </h1>
      <div className="space-y-4">
        {buyerRooms.map((el: DataType) => (
          <div
            key={el.id}
            className="flex items-center p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
            onClick={() =>
              router.push(`/chat/${el.id}?productId=${el.product.productId}`)
            }
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full"
                src={el.buyer.profileImageDownLoadUrl}
                alt="구매자 프로필 이미지"
              />
              <div className="text-lg font-medium">{el.buyer.nickName}</div>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-4">
              <div className="text-lg font-medium">{el.seller.nickName}</div>
              <img
                className="w-10 h-10 rounded-full"
                src={el.seller.profileImageDownLoadUrl}
                alt="판매자 프로필 이미지"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/product/${el.product.productId}`);
              }}
              className="flex items-center space-x-2"
            >
              <img
                className="w-20 h-20 object-cover rounded-md"
                src={el.product.firstProductImageUrl}
                alt="상품 이미지"
              />
              <div className="text-lg font-semibold">
                {el.product.finalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-center my-6">
        판매자 채팅방 목록
      </h1>
      <div className="space-y-4">
        {sellerRooms.map((el: DataType) => (
          <div
            key={el.id}
            className="flex items-center p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full"
                src={el.buyer.profileImageDownLoadUrl}
                alt="구매자 프로필 이미지"
              />
              <div className="text-lg font-medium">{el.buyer.nickName}</div>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-4">
              <div className="text-lg font-medium">{el.seller.nickName}</div>
              <img
                className="w-10 h-10 rounded-full"
                src={el.seller.profileImageDownLoadUrl}
                alt="판매자 프로필 이미지"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/product/${el.product.productId}`);
              }}
              className="flex items-center space-x-2"
            >
              <img
                className="w-20 h-20 object-cover rounded-md"
                src={el.product.firstProductImageUrl}
                alt="상품 이미지"
              />
              <div className="text-lg font-semibold">
                {el.product.finalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
