'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useFetch } from '@/app/hooks/useFetch';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  chatMessageId: string;
  message: string;
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

  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const connectToChatRoom = useCallback(async () => {
    try {
      const response = await axios.post<ChatRoomResponse>(
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
            recordMessage(newMessage.chatMessageId);
          },
          {
            Authorization: `Bearer ${accessToken}`,
            ChatRoomSecreteNumber: response.data.chatConnectSecretNumber,
          },
        );

        fetchLatestMessages(response.data.chatRoomId);
      });

      setStompClient(client);
    } catch (error) {
      console.error('Failed to connect to chat room:', error);
    }
  }, [accessToken, params]);

  const fetchLatestMessages = async (chatRoomId: string) => {
    try {
      const response = await axios.get<{ chatMessages: ChatMessage[] }>(
        `${API_BASE_URL}/chat/messages/latest`,
        {
          params: { chatRoomId, sliceSize: 3 },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setMessages(response.data.chatMessages.reverse());
    } catch (error) {
      console.error('Failed to fetch latest messages:', error);
    }
  };

  const recordMessage = async (chatMessageId: string) => {
    try {
      await axios.put(
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
  }, [stompClient, inputValue, params, accessToken]);

  const fetchPreviousMessages = async () => {
    if (messages.length === 0) return;
    try {
      const response = await axios.get<{ chatMessages: ChatMessage[] }>(
        `${API_BASE_URL}/chat/messages`,
        {
          params: {
            startChatMessageId: messages[0].chatMessageId,
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

  return (
    <div className="max-w-lg mx-auto border rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-100 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-1 border-gray-300 p-2 rounded mr-2"
          placeholder="메시지 입력..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          보내기
        </button>
        <button
          onClick={fetchPreviousMessages}
          className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          이전 조회
        </button>
      </div>
      <ul className="p-4 space-y-2 bg-white">
        {messages.map((item, index) => (
          <li key={index} className="bg-gray-200 rounded p-2">
            {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
