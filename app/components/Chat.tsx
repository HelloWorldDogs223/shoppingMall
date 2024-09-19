'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useFetch } from '@/app/hooks/useFetch';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/axiosSetting';

interface ChatMessage {
  chatId: string; // 채팅 메세지 ID
  chatRoomId: number; // 채팅방 ID
  writerId: number; // 작성자 ID
  message: string; // 메세지 내용
  createDate?: Date;
}

interface ChatRoomResponse {
  requesterId: string;
  chatRoomId: string;
  chatConnectSecretNumber: string;
}

export default function ChatRoom({ params }: { params: string }) {
  const { accessToken } = useFetch();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const connectToChatRoom = useCallback(async () => {
    try {
      const response = await apiClient.post<ChatRoomResponse>(
        `${API_BASE_URL}/chat/connect/request`,
        { chatRoomId: params },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const socket = new WebSocket(
        `wss://api.group-group.com/ws?requesterId=${response.data.requesterId}`,
      );
      const client = Stomp.over(socket);

      client.connect({}, () => {
        client.subscribe(
          `/sub/chat/${response.data.chatRoomId}`,
          (message) => {
            const newMessage: ChatMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            recordMessage(newMessage.chatId);
          },
          {
            Authorization: `Bearer ${accessToken}`,
            ChatRoomSecreteNumber: response.data.chatConnectSecretNumber,
          },
        );

        fetchLatestMessages(response.data.chatRoomId);
      });

      setStompClient(client);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to connect to chat room:', error);
      setError('채팅방 연결에 실패했습니다. 다시 시도해 주세요.');
      setIsLoading(false);
    }
  }, [accessToken, params]);

  const fetchLatestMessages = async (chatRoomId: string) => {
    try {
      const response = await apiClient.get<{ chatMessages: ChatMessage[] }>(
        `${API_BASE_URL}/chat/messages/latest`,
        {
          params: { chatRoomId, sliceSize: 3 },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setMessages(response.data.chatMessages.reverse());
    } catch (error) {
      console.error('Failed to fetch latest messages:', error);
      setError('최근 메시지를 불러오는 데 실패했습니다.');
    }
  };

  const recordMessage = async (chatMessageId: string) => {
    try {
      await apiClient.put(
        `${API_BASE_URL}/chat/record`,
        { chatRoomId: params, chatMessageId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (error) {
      console.error('Failed to record message:', error);
    }
  };

  const sendMessage = useCallback(() => {
    if (stompClient && inputValue.trim()) {
      const body = { chatRoomId: params, message: inputValue };
      try {
        stompClient.send(
          '/pub/chat/message',
          { Authorization: `Bearer ${accessToken}` },
          JSON.stringify(body),
        );
        setInputValue('');
      } catch (e) {
        router.push('/check');
        console.log(e);
      }
    }
  }, [stompClient, inputValue, params, accessToken, router]);

  const fetchPreviousMessages = async () => {
    if (messages.length === 0) return;
    try {
      const response = await apiClient.get<{ chatMessages: ChatMessage[] }>(
        `${API_BASE_URL}/chat/messages`,
        {
          params: {
            startChatMessageId: messages[0].chatId,
            chatRoomId: params,
            sliceSize: 99,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setMessages((prevMessages) => [
        ...response.data.chatMessages.reverse(),
        ...prevMessages,
      ]);
    } catch (error) {
      console.error('Failed to fetch previous messages:', error);
      setError('이전 메시지를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    connectToChatRoom();
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [connectToChatRoom]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md"
          role="alert"
        >
          <strong className="font-bold">오류 발생!</strong>
          <span className="block mt-1">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col bg-gray-100 shadow-xl rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">채팅방</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <button
          onClick={fetchPreviousMessages}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          이전 메시지 불러오기
        </button>
        <ul className="space-y-3">
          {messages.map((item, index) => (
            <li
              key={index}
              className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <p className="text-gray-800">{item.message}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            placeholder="메시지를 입력하세요..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-r-full transition duration-300 ease-in-out"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
