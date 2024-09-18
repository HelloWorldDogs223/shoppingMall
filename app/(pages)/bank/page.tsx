import { useFetch } from '@/app/hooks/useFetch';
import React, { useState, useEffect } from 'react';

interface FetchInterface {
  memberId: number; // 회원 ID
  accountNumber: number; // 회원의 계좌번호
}

function AccountComponent() {
  const [accountNumber, setAccountNumber] = useState('');
  const [fetchedAccount, setFetchedAccount] = useState<FetchInterface | null>(
    null,
  );
  const [error, setError] = useState('');

  const { accessToken } = useFetch();

  const handleInputChange = (e: any) => {
    setAccountNumber(e.target.value);
  };

  const validateAccountNumber = (number: any) => {
    const regex = /^[0-9-]{8,30}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateAccountNumber(accountNumber)) {
      setError('계좌번호 형식이 올바르지 않습니다.');
      return;
    }

    setError('');

    try {
      const response = await fetch('/member/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accountNumber }),
      });

      if (response.ok) {
        alert('계좌번호가 성공적으로 등록되었습니다.');
        fetchAccount();
      } else {
        alert('계좌번호 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 에러가 발생했습니다.');
    }
  };

  const fetchAccount = async () => {
    try {
      const response = await fetch('/member/account', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFetchedAccount(data);
      } else {
        alert('계좌번호 조회에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 에러가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          계좌번호 입력
        </label>
        <input
          type="text"
          value={accountNumber}
          onChange={handleInputChange}
          placeholder="계좌번호를 입력하세요"
          className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          등록하기
        </button>
      </form>

      {fetchedAccount && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">등록된 계좌정보</h2>
          <p className="text-gray-700">회원 ID: {fetchedAccount?.memberId}</p>
          <p className="text-gray-700">
            계좌번호: {fetchedAccount?.accountNumber}
          </p>
        </div>
      )}
    </div>
  );
}

export default AccountComponent;
