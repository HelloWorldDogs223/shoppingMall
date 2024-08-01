'use client';

interface ProductType {
  productId: number; // 제품 Id
  sellerId: number; // 판매자 Id
  productTypeId: number; // 제품타입 Id
  productImageDownloadUrlList: [];
  blockDataList: {
    // 블록 데이터 리스트
    index: number; // 블록 순서
    blockType: string;
    contentInTextBlock: string; // 텍스트 블록을 위한
    imgDownloadUrlInImageBlock: String;
  };
  singleOptions: // 단일옵션 리스트
  {
    optionName: string; // 옵션명
    priceChangeAmount: number; // 옵션에 의한 가격변동값
  };

  multipleOptions: // 다중옵션 리스트
  {
    optionName: string; // 옵션명
    priceChangeAmount: number; // 옵션에 의한 가격변동값
  };

  name: string; // 제품 이름
  price: number; // 제품 가격
  discountAmount: number; // 할인 양
  discountRate: number; // 할인 퍼센테이지
  isBan: Boolean; // 벤 여부
  scoreAvg: number; // 제품 평점
}

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['tv', '3구 콘센트', '케이블', '스위치 케이스', '플러그'];

export default function Page() {
  const [age, setAge] = useState('선택');
  const [personName, setPersonName] = useState<string[]>([]);
  const params = useParams();

  const { accessToken } = useFetch();

  const [productInfo, setProductInfo] = useState<ProductType>();

  const getProductById = async () => {
    const productRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${params.uid}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setProductInfo(productRes.data);
  };

  const handleChangeMultiple = (
    event: SelectChangeEvent<typeof personName>,
  ) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  useEffect(() => {
    getProductById();
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fafb] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/10eb26d3-ae55-41eb-a6d5-c2ac6f1dea78.png")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      {productInfo?.name}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <h2>가격</h2>
            <h3>{productInfo?.price}</h3>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Product Details
            </h2>
            <div className="flex">
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChangeMultiple}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={personName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col p-4 gap-3">
              <details className="flex flex-col rounded-xl border border-[#d0dbe6] bg-[#f8fafb] px-[15px] py-[7px] group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#0e141b] text-sm font-medium leading-normal">
                    Product Information
                  </p>
                  <div
                    className="text-[#0e141b] group-open:rotate-180"
                    data-icon="CaretDown"
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
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#4f7396] text-sm font-normal leading-normal pb-2"></p>
              </details>
              <details className="flex flex-col rounded-xl border border-[#d0dbe6] bg-[#f8fafb] px-[15px] py-[7px] group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#0e141b] text-sm font-medium leading-normal">
                    Material
                  </p>
                  <div
                    className="text-[#0e141b] group-open:rotate-180"
                    data-icon="CaretDown"
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
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#4f7396] text-sm font-normal leading-normal pb-2"></p>
              </details>
              <details className="flex flex-col rounded-xl border border-[#d0dbe6] bg-[#f8fafb] px-[15px] py-[7px] group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#0e141b] text-sm font-medium leading-normal">
                    Shipping Information
                  </p>
                  <div
                    className="text-[#0e141b] group-open:rotate-180"
                    data-icon="CaretDown"
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
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#4f7396] text-sm font-normal leading-normal pb-2"></p>
              </details>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-6 p-4 mt-[100px]">
              <div className="flex flex-col gap-2">
                <p className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em]">
                  4.5
                </p>
                <div className="flex gap-0.5">
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="18px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="18px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="18px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="18px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="18px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  2,000 reviews
                </p>
              </div>
              <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  5
                </p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#d0dbe6]">
                  <div
                    className="rounded-full bg-[#348de5]"
                    style={{ width: '35%' }}
                  ></div>
                </div>
                <p className="text-[#4f7396] text-sm font-normal leading-normal text-right">
                  35%
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  4
                </p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#d0dbe6]">
                  <div
                    className="rounded-full bg-[#348de5]"
                    style={{ width: '25%' }}
                  ></div>
                </div>
                <p className="text-[#4f7396] text-sm font-normal leading-normal text-right">
                  25%
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  3
                </p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#d0dbe6]">
                  <div
                    className="rounded-full bg-[#348de5]"
                    style={{ width: '18%' }}
                  ></div>
                </div>
                <p className="text-[#4f7396] text-sm font-normal leading-normal text-right">
                  18%
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  2
                </p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#d0dbe6]">
                  <div
                    className="rounded-full bg-[#348de5]"
                    style={{ width: '12%' }}
                  ></div>
                </div>
                <p className="text-[#4f7396] text-sm font-normal leading-normal text-right">
                  12%
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  1
                </p>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#d0dbe6]">
                  <div
                    className="rounded-full bg-[#348de5]"
                    style={{ width: '10%' }}
                  ></div>
                </div>
                <p className="text-[#4f7396] text-sm font-normal leading-normal text-right">
                  10%
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8 overflow-x-hidden bg-[#f8fafb] p-4">
              <div className="flex flex-col gap-3 bg-[#f8fafb]">
                <div className="flex-1">
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Stacy
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    October 29, 2023
                  </p>
                </div>
                <div className="flex gap-0.5">
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  This is a wonderful lightweight top... but it runs very small
                </p>
                <div className="flex gap-9 text-[#4f7396]">
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsUp"
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
                        <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                      </svg>
                    </div>
                    <p className="text-inherit">2</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsDown"
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
                        <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-[#f8fafb]">
                <div className="flex-1">
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Melissa
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    November 18. 2023
                  </p>
                </div>
                <div className="flex gap-0.5">
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  Form fitting in a flattering way. Fabric has a great feel. It
                  is a bit sheer, so choose undergarments carefully. This can be
                  a warm fall layer or a simple summer top
                </p>
                <div className="flex gap-9 text-[#4f7396]">
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsUp"
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
                        <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                      </svg>
                    </div>
                    <p className="text-inherit">1</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsDown"
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
                        <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-[#f8fafb]">
                <div className="flex-1">
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Josh
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    October 24, 2023
                  </p>
                </div>
                <div className="flex gap-0.5">
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                  <div
                    className="text-[#348de5]"
                    data-icon="Star"
                    data-size="20px"
                    data-weight="fill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  Fabulous, light weight, lux fabric. I love the style and fit.
                  The estimated retail is way too high though,
                </p>
                <div className="flex gap-9 text-[#4f7396]">
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsUp"
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
                        <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                      </svg>
                    </div>
                    <p className="text-inherit">1</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div
                      className="text-inherit"
                      data-icon="ThumbsDown"
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
                        <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Description
            </h2>
            <p className="text-[#0e141b] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Crafted from a blend of lustrous 100% grade-6a mulberry silk and
              premium grade-a-16-gauge cashmere, this featherlight knit is a
              luxurious upgrade for beloved wardrobe staple
            </p>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Details
            </h2>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe6] py-5">
                <p className="text-[#4f7396] text-sm font-normal leading-normal">
                  100% silk 100% cashmere
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  Fit: Slim
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe6] py-5">
                <p className="text-[#4f7396] text-sm font-normal leading-normal">
                  Dry clean only
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  Model is 5'9" with 32" bust, 24" waist, 34" hips and wearing a
                  size XS
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe6] py-5">
                <p className="text-[#4f7396] text-sm font-normal leading-normal">
                  Imported
                </p>
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  Style: #001C01
                </p>
              </div>
            </div>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              You May Also Like
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/0334aa5f-397a-44b2-af8c-493f1d4492ed.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/d56e711b-ba26-482e-92ea-747df5f63cc2.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/071d839d-27c7-475c-be07-24099683802e.png")',
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/b3e2f555-6734-4d88-8498-782c5f222f27.png")',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
