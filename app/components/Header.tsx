'use client';
import { Button } from '@mui/material';

import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '../store/login';
import useCartStore from '../store/cart';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const params = useParams();

  const [img, setImg] = useState('');
  const [managerAccessToken, setManagerAccessToken] = useState('');

  const cartLength = useCartStore((state: any) => state.cart.length);
  const setCart = useCartStore((state: any) => state.setCart);
  const { accessToken, clearAccessToken } = useAuthStore();

  const [keyword, setKeyword] = useState(params.keyword);

  const onClickHandler = () => {
    router.push('/');
  };

  useEffect(() => {
    if (!params.keyword) {
      setKeyword('');
    } else {
      setKeyword(params.keyword);
    }
    setManagerAccessToken(localStorage.getItem('manager') as string);
  }, [params]);

  const fetchUser = async () => {
    const userInfoRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setImg(userInfoRes.data?.profileImageDownLoadUrl);
  };

  useEffect(() => {
    const asyncFunction = async () => {
      if (accessToken) {
        try {
          const basketRes = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          const resData = basketRes.data.basketItemDtos;

          setCart(
            resData.map((el: any) => {
              return { id: el.productId, name: el.name };
            }),
          );
        } catch (e) {
          console.log(e);
        }
      }
    };
    asyncFunction();
    fetchUser();
  }, [accessToken]);

  async function logout() {
    if (managerAccessToken) {
      const res: any = axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/manager/logout`,
        {
          headers: { Authorization: `Bearer ${managerAccessToken}` },
        },
      );
      localStorage.removeItem('manager');
      location.reload();
    } else {
      try {
        const res: any = await axios.get(
          'https://api.group-group.com/auth/logout',
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } catch (e) {
        console.log(e);
      } finally {
        clearAccessToken();
      }
    }
    location.reload();
  }

  const searchHandler = () => {
    router.push(`/search/${keyword}`);
  };

  return (
    <div className="pt-[65px]">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e8edf3] px-10 py-3 fixed left-0 top-0 w-full z-[101] bg-white">
        <div className="flex items-center gap-4 text-[#0e141b]">
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2
            onClick={onClickHandler}
            className="cursor-pointer text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]"
          >
            Fashion Market
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div
                className="text-[#4f7396] flex border-none bg-[#e8edf3] items-center justify-center pl-4 rounded-l-xl border-r-0"
                data-icon="MagnifyingGlass"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  className="cursor-pointer"
                  onClick={searchHandler}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <form
                onSubmit={(e: any) => {
                  e.preventDefault();
                  searchHandler();
                }}
              >
                <input
                  onChange={(e: any) => setKeyword(e.target.value)}
                  placeholder="Search"
                  value={decodeURIComponent(keyword as string)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border-none bg-[#e8edf3] focus:border-none h-full placeholder:text-[#4f7396] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </form>
            </div>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/cart')}
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#e8edf3] text-[#0e141b] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div
                className="text-[#0e141b]"
                data-icon="ShoppingBag"
                data-size="20px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
                </svg>
              </div>
              <p className="text-red-500">{cartLength}</p>
            </button>
          </div>
          <div>
            {accessToken !== null || managerAccessToken !== null ? (
              <div className="flex gap-4">
                <Button onClick={() => logout()} variant="contained">
                  SignOut
                </Button>
                <Button onClick={() => router.push('/product/new')}>
                  제품 등록하기
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/signin')}
                variant="contained"
              >
                Signin
              </Button>
            )}
          </div>
          <img
            onClick={() => {
              !managerAccessToken
                ? router.push('/user/info')
                : router.push('/manager/info');
            }}
            className="cursor-pointer bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            src={
              img ||
              'https://cdn.usegalileo.ai/stability/8a31f216-93c7-4e43-a376-51163e59cedc.png'
            }
          />
        </div>
      </header>
    </div>
  );
}
