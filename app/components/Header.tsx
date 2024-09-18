'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@mui/material';

import useAuthStore from '../store/login';
import useCartStore from '../store/cart';
import useAlarmStore from '../store/alarm';

export default function Home() {
  const router = useRouter();
  const params = useParams();

  const [img, setImg] = useState('');
  const [managerAccessToken, setManagerAccessToken] = useState<string | null>(
    null,
  );
  const [keyword, setKeyword] = useState<string>('');
  const [alarm, setAlarm] = useState<any[]>([]);

  const { accessToken, clearAccessToken } = useAuthStore();
  const setAlarmMethod = useAlarmStore((state) => state.setAlarms);
  const cartLength = useCartStore((state: any) => state.cart.length);
  const setCart = useCartStore((state: any) => state.setCart);

  const onClickHandler = useCallback(() => {
    router.push('/');
  }, [router]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setImg(response.data?.profileImageDownLoadUrl);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken]);

  const getAlarms = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/alarms?sliceSize=99&sliceNumber=0`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setAlarm(response.data.alarmList);
      setAlarmMethod(response.data.alarmList);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, setAlarmMethod]);

  const logout = useCallback(async () => {
    try {
      if (managerAccessToken) {
        await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/manager/logout`,
          {
            headers: { Authorization: `Bearer ${managerAccessToken}` },
          },
        );
        localStorage.removeItem('manager');
      } else {
        await axios.get('https://api.group-group.com/auth/logout', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        clearAccessToken();
      }
    } catch (error) {
      console.error(error);
    } finally {
      location.reload();
    }
  }, [accessToken, clearAccessToken, managerAccessToken]);

  const searchHandler = useCallback(() => {
    router.push(`/search/${keyword}`);
  }, [router, keyword]);

  useEffect(() => {
    setKeyword((params.keyword as string) || '');
    setManagerAccessToken(localStorage.getItem('manager') || null);
  }, [params]);

  useEffect(() => {
    const initialize = async () => {
      if (accessToken) {
        try {
          const basketResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          const resData = basketResponse.data.basketItemDtos;
          setCart(
            resData.map((item: any) => ({
              id: item.productId,
              name: item.name,
            })),
          );
        } catch (error) {
          console.error(error);
        }
        fetchUser();
        getAlarms();
      }
    };
    initialize();
  }, [accessToken, fetchUser, getAlarms, setCart]);

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
          <div className="flex items-center justify-end gap-4">
            {alarm.length > 0 ? (
              <svg
                onClick={() => {
                  router.push('/user/alarm');
                }}
                className="cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
              >
                <circle cx="29.5" cy="16.5039" r="2.5" fill="#EF4444" />
                <path
                  d="M22.9876 13C24.4351 13 25.7878 13.4069 26.9353 14.1145C26.5934 14.4798 26.329 14.9182 26.1682 15.4038C25.2457 14.8301 24.1554 14.4996 22.9876 14.4996C19.663 14.4996 16.98 17.1731 16.9795 20.498V24.9064L15.6337 27.9997H30.3502L28.9958 24.9074L28.9959 20.5108L28.9921 20.2857C28.9884 20.1773 28.9818 20.0698 28.9725 19.963C29.1435 19.9886 29.3185 20.0019 29.4966 20.0019C29.8347 20.0019 30.1616 19.9541 30.4709 19.8649C30.4816 19.9914 30.4892 20.1188 30.4936 20.2471L30.4978 20.498V24.5938L31.8797 27.749C31.9489 27.9069 31.9846 28.0773 31.9846 28.2497C31.9846 28.9398 31.4241 29.4993 30.7329 29.4993L25.9917 29.5008C25.9917 31.1572 24.6467 32.5 22.9876 32.5C21.3878 32.5 20.08 31.2514 19.9887 29.677L19.9831 29.4985L15.252 29.4993C15.0804 29.4993 14.9107 29.4641 14.7533 29.3959C14.1193 29.1209 13.8285 28.3848 14.1039 27.7518L15.4775 24.5948V20.4979C15.4781 16.3442 18.8341 13 22.9876 13ZM24.4892 29.4985L21.4856 29.5008C21.4856 30.329 22.1581 31.0004 22.9876 31.0004C23.7684 31.0004 24.41 30.4057 24.4828 29.6452L24.4892 29.4985Z"
                  fill="#242424"
                />
              </svg>
            ) : (
              <svg
                className="cursor-pointer"
                onClick={() => {
                  router.push('/user/alarm');
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
              >
                <g clipPath="url(#clip0_7761_149442)">
                  <path
                    d="M23.0001 12.9961C27.05 12.9961 30.3568 16.1908 30.4959 20.2451L30.5001 20.4961V24.5931L31.8801 27.7491C31.9492 27.907 31.9848 28.0775 31.9848 28.2499C31.9848 28.9402 31.4252 29.4999 30.7348 29.4999L26.0001 29.5014C26.0001 31.1582 24.657 32.5014 23.0001 32.5014C21.4024 32.5014 20.0965 31.2524 20.0052 29.6776L19.9997 29.4991L15.275 29.4999C15.1036 29.4999 14.9341 29.4646 14.777 29.3964C14.1438 29.1213 13.8534 28.3851 14.1285 27.7519L15.5001 24.594V20.496C15.5007 16.3412 18.8522 12.9961 23.0001 12.9961ZM24.4997 29.4991L21.5001 29.5014C21.5001 30.3298 22.1717 31.0014 23.0001 31.0014C23.7798 31.0014 24.4206 30.4065 24.4932 29.6458L24.4997 29.4991ZM23.0001 14.4961C19.6799 14.4961 17.0006 17.1703 17.0001 20.4961V24.9057L15.6561 27.9999H30.3526L29.0001 24.9067L29.0002 20.5089L28.9965 20.2837C28.8854 17.0503 26.2417 14.4961 23.0001 14.4961Z"
                    fill="#242424"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7761_149442">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(13 13)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}
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
        </div>
      </header>
    </div>
  );
}
