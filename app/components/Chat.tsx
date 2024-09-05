'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useFetch } from '@/app/hooks/useFetch';

export default function Page() {
  const stompClient = useRef<any>(null);

  const searchParams = useSearchParams();
  const productId = searchParams.get('productId'); // 전달된 값 읽기

  const { accessToken } = useFetch();

  const [messages, setMessages] = useState<any[]>([]);
  const [chatRoomId, setChatRoomId] = useState(1);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // 판매자 입장에서의 채팅방 조회
  const getChatRoomBySeller = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/seller/chatrooms?sliceNumber=0&sliceSize=100`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((ex) => {
        console.log(ex.response.data);
      });
  };

  // 구매자 입장에서의 채팅방 조회
  const getChatRoomByBuyer = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/buyer/chatrooms?sliceNumber=0&sliceSize=100`,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((ex) => {
        console.log(ex.response.data);
      });
  };

  // 채팅방 생성
  const makeChatRoom = async () => {
    const res: any = await axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat`,
        { productId },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        setChatRoomId(res.data.chatRoomId);
      })
      .catch((ex) => {
        console.log(ex.response.data);
      });
  };

  // 채팅방 연결 메서드
  const connect = () => {
    reqeustChatRoom();
  };

  // 채팅방 연결 과정1. 채팅방 참여요청
  const reqeustChatRoom = () => {
    console.log(chatRoomId);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat/connect/request`,
        { chatRoomId: chatRoomId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((res) => {
        console.log('1.채팅방 참여요청 성공=========');
        console.log(res.data);
        connectStomp(res); // 채팅방 연결 과정2. stomp 연결
      })
      .catch((ex) => {
        console.log('1.채팅방 참여요청 실패=========');
        console.log(ex);
      });
  };

  // 채팅방 연결 과정2. stomp 연결
  const connectStomp = (res: any) => {
    console.log('2.stomp 연결 요청=========');
    const socket = new WebSocket(
      `ws://api.group-group.com/ws` + `?requesterId=${res.data.requesterId}`,
    );
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      // 인자. stomp 연결후 실행될 콜백 메서드
      console.log('2.stomp 연결 성공=========');
      subscribeChatRoom(res); // 채팅방 연결 과정3. 채팅방 구독 요청
    });
  };

  // 채팅방 연결 과정3. 채팅방 구독 요청
  const subscribeChatRoom = (res: any) => {
    console.log('3.채팅방 구독 요청=========');

    // access 토큰의 유효시간이 지났다면 재발급 필요 (유효하지않은 토큰이 전송시 웹소켓이 끊어짐)

    const subscribeResult = stompClient.current.subscribe(
      `/sub/chat/${res.data.chatRoomId}`, // 인자1. 구독요청 주소
      (message: any) => {
        // 인자2. 구독성공시 메세지를 받을 콜백 메서드
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(newMessage);
        axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat/record`,
          { chatRoomId: chatRoomId, chatMessageId: newMessage.chatMessageId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      },
      {
        // 인자3. 구독요청 헤더
        Authorization: `Bearer ${accessToken}`,
        ChatRoomSecreteNumber: res.data.chatConnectSecretNumber,
      },
    );
    if (subscribeResult) {
      console.log('3.채팅방 구독 성공=========');
      getLatestChatMessage(res);
    }
  };

  // 채팅방 연결과정4. 최근 채팅 메세지 가져오기
  const getLatestChatMessage = (input: any) => {
    console.log('4.채팅방 초기 메세지 요청 =====================');
    return axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat/messages/latest?chatRoomId=${input.data.chatRoomId}&sliceSize=${3}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((res) => {
        console.log('4.채팅방 초기 메세지 성공 =====================');
        console.log(res.data);
        setChatRoomId(input.data.chatRoomId);
        setMessages(res.data.chatMessages.reverse());
      })
      .catch((err) => {
        console.log('4.채팅방 초기 메세지 실패 =====================');
        console.log(err);
      });
  };

  // 이전 채팅 메세지 조회하기
  const getPreviousChatMessage = () => {
    console.log('이전 채팅메세지 요청 =====================');
    console.log(chatRoomId);
    return axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat/messages?startChatMessageId=${messages[0].chatId}&chatRoomId=${chatRoomId}&sliceSize=${3}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((res) => {
        console.log('이전 채팅메세지 요청 성공 =====================');
        console.log(res.data);
        setMessages(res.data.chatMessages.reverse().concat(messages));
      })
      .catch((err) => {
        console.log('이전 채팅메세지 요청 실패 =====================');
        console.log(err);
      });
  };

  //메세지 전송
  const sendMessage = () => {
    // access 토큰의 유효시간이 지났다면 재발급 필요 (유효하지않은 토큰이 전송시 웹소켓이 끊어짐)
    if (stompClient.current && inputValue) {
      const body = {
        chatRoomId: chatRoomId,
        message: inputValue,
      };
      stompClient.current.send(
        `/pub/chat/message`,
        { Authorization: `Bearer ${accessToken}` },
        JSON.stringify(body),
      );
      setInputValue('');
    }
  };

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => disconnect();
  }, []);

  return (
    <div>
      <div>
        <ul>
          <div>
            <div>
              <h3>채팅방 조회</h3>
              <div onClick={getChatRoomBySeller}>
                판매자 입장에서의 채팅방 조회
              </div>
              <div onClick={getChatRoomByBuyer}>
                구매자 입장에서의 채팅방 조회
              </div>
            </div>
            <div>
              <h3>채팅방 생성</h3>
              <div onClick={makeChatRoom}>채팅방 생성하기</div>
            </div>
            <h3>채팅</h3>
            <div>
              <div onClick={connect}>연결하기</div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button onClick={sendMessage}>입력</button>
              <div onClick={getPreviousChatMessage}>
                {'<(클릭)이전 채팅 메세지 조회>'}
              </div>
              {messages.map((item: any, index: number) => (
                <div key={index} className="list-item">
                  {item.message}
                </div>
              ))}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
