'use client';

interface Block {
  index: number; // 블록 순서
  blockType: string;
  contentInTextBlock: string; // 텍스트 블록을 위한
  imgDownloadUrlInImageBlock: string;
}

interface ProductType {
  productId: number; // 제품 Id
  sellerId: number; // 판매자 Id
  productTypeId: number; // 제품타입 Id
  productImageDownloadUrlList: [];
  blockDataList: Block[];
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
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';
import { useRouter } from 'next/navigation';
import useCartStore from '@/app/store/cart';
import ReportModal from '@/app/components/ReportModal';

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

export default function Page() {
  const router = useRouter();

  const addItem = useCartStore((state: any) => state.addItem);

  const [age, setAge] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [single, setSingle] = useState([]);
  const [multi, setMulti] = useState([]);
  const [modal, setModal] = useState(false);
  const [comments, setComments] = useState([]);

  const [commentTitle, setCommentTitle] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentImg, setCommentImg] = useState(null);

  const [id, setId] = useState(0);

  const [score, setScore] = useState<number | null>(0);

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
    setSingle(productRes.data.singleOptions);
    setMulti(productRes.data.multipleOptions);
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const {
      target: { value },
    } = event;

    setSelectedOptions(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeSingle = (event: SelectChangeEvent) => {
    setAge((event.target.value as string) || '');
  };

  const getComments = async () => {
    const commentRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/reviews?sliceNumber=0&sliceSize=99&productId=${productInfo?.productId}`,
    );
    setComments(commentRes.data.reviewsList);
  };

  const getBuyProducts = async () => {
    const buyProductRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchases`,
    );

    console.log(buyProductRes.data.purchaseList);

    buyProductRes.data.purchaseList.forEach((el: any) => {
      el.purchaseItems.forEach((item: any) => {
        if (item.productId === productInfo?.productId) {
          setId(item.purchaseItemId);
        }
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getProductById(); // 첫 번째 함수 실행
      if (productInfo) {
        await getComments(); // 첫 번째 함수가 완료된 후 두 번째 함수 실행
        await getBuyProducts();
      }
    };
    fetchData();
  }, [accessToken]);

  const handleClick = () => {
    const convertToRecord = (product: ProductType): Record<string, string> => {
      return {
        productId: product.productId.toString(),
        sellerId: product.sellerId.toString(),
        productTypeId: product.productTypeId.toString(),
        productImageDownloadUrlList: JSON.stringify(
          product.productImageDownloadUrlList,
        ),
        blockDataList: JSON.stringify(product.blockDataList),
        singleOptions: JSON.stringify(product.singleOptions),
        multipleOptions: JSON.stringify(product.multipleOptions),
        name: product.name,
        price: product.price.toString(),
        discountAmount: product.discountAmount.toString(),
        discountRate: product.discountRate.toString(),
        isBan: product.isBan.toString(),
        scoreAvg: product.scoreAvg.toString(),
      };
    };

    if (!productInfo) {
      console.error('Product information is undefined');
      return;
    }

    const query = new URLSearchParams(convertToRecord(productInfo)).toString();

    router.push(`/product/edit?${query}`);
  };

  const getCart = async () => {
    addItem({ id: productInfo?.productId, name });

    if (age === null) {
      alert('옵션을 골라주세요');
      return;
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
      {
        productId: productInfo?.productId,
        singleOptionId: Number(age),
        multipleOptionId: selectedOptions,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  const commentOnSubmitHandler = async () => {
    if (commentImg !== '' && commentTitle !== '') {
      // 리뷰 데이터 개별 필드로 추가

      const reviewData = {
        title: commentTitle,
        description: commentContent,
        score,
        purchaseItemId: id,
      };

      const formData = new FormData();

      const productDataJson = new Blob([JSON.stringify(reviewData)], {
        type: 'application/json',
      });

      formData.append('reviewData', productDataJson);

      if (commentImg !== null) formData.append('reviewImage', commentImg);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } catch (error: any) {
        console.error(
          'Error uploading review:',
          error.response?.data || error.message,
        );
      }
    } else {
      alert('모두 입력해주세요!');
    }
  };

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
                      제품명 : {productInfo?.name}
                    </h1>
                  </div>
                </div>
                <div
                  onClick={() =>
                    router.push(
                      `/list-product-sell?member=${productInfo?.sellerId}`,
                    )
                  }
                >
                  판매자 : {productInfo?.sellerId}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4 justify-between w-[100px]">
              <div>
                <h2 className="text-2xl">가격</h2>
                <h3 className="text-2xl">{productInfo?.price}원</h3>
              </div>
              <Button
                onClick={() => handleClick()}
                variant="contained"
                className="w-[400px]"
              >
                수정하기
              </Button>
              <Button
                onClick={() => getCart()}
                variant="contained"
                className="w-[400px] bg-red-500 hover:bg-white hover:text-black"
              >
                장바구니 담기
              </Button>
              <Button
                onClick={() => setModal(true)}
                variant="contained"
                className="w-[400px] bg-red-500 hover:bg-white hover:text-black"
              >
                제품 신고하기
              </Button>
            </div>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Product Details
            </h2>
            <div className="flex items-center">
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">옵션</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedOptions}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {multi.map((option: any) => (
                    <MenuItem key={option.optionId} value={option.optionId}>
                      <Checkbox
                        checked={selectedOptions.indexOf(option.optionId) > -1}
                      />
                      <ListItemText
                        primary={`${option.optionName} (${option.priceChangeAmount > 0 ? '+' : ''}${option.priceChangeAmount})`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">옵션</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age || ''}
                  label="option"
                  onChange={handleChangeSingle}
                >
                  {single.map((el: any) => {
                    return (
                      <MenuItem value={el.optionId}>{el.optionName}</MenuItem>
                    );
                  })}
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
                <p className="text-[#4f7396] text-sm font-normal leading-normal pb-2">
                  {productInfo?.blockDataList?.map((item: Block) => {
                    return (
                      <div>
                        {item.blockType === 'TEXT_TYPE' ? (
                          <div>{item.contentInTextBlock}</div>
                        ) : (
                          <div>
                            <img src={item.imgDownloadUrlInImageBlock} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </p>
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
            <div className="flex  gap-x-8 gap-y-6 p-4 mt-[100px] mb-[200px]">
              <div className="flex flex-col gap-2">
                <p className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em]">
                  {productInfo?.scoreAvg}점
                </p>
                <Rating
                  name="half-rating-read"
                  defaultValue={productInfo?.scoreAvg}
                  precision={0.5}
                  readOnly
                />
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  {comments.length} reviews
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <form onSubmit={commentOnSubmitHandler}>
                <Typography component="legend">별점</Typography>
                <Rating
                  name="simple-controlled"
                  value={score}
                  onChange={(event: any, newValue: number | null) => {
                    setScore(newValue);
                  }}
                />
                <div className="flex flex-col gap-4 mt-[100px]">
                  <label>타이틀</label>
                  <input
                    className="w-[400px] border border-solid border-red-500 mb-[50px]"
                    value={commentTitle}
                    onChange={(e: any) => setCommentTitle(e.target.value)}
                  />
                  <label>내용</label>
                  <textarea
                    className="w-[600px] resize-none h-[400px] border border-solid border-red-500"
                    value={commentContent}
                    onChange={(e: any) => setCommentContent(e.target.value)}
                  />
                </div>
                <input
                  type="file"
                  onChange={(event: any) => {
                    setCommentImg(event.target.files[0]);
                  }}
                />
                <Button onClick={commentOnSubmitHandler}>제출하기</Button>
              </form>
            </div>
            <div className="relative flex size-full min-h-screen flex-col bg-[#fcfbf8] group/design-root overflow-x-hidden">
              <div className="layout-container flex h-full grow flex-col">
                <div className="px-40 flex flex-1 justify-center py-5">
                  <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    <h2 className="text-[#1c190d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                      Rating &amp; Reviews
                    </h2>

                    {comments.map((el: any) => {
                      return (
                        <div className="flex flex-col gap-8 overflow-x-hidden bg-[#fcfbf8] p-4">
                          <div className="flex flex-col gap-3 bg-[#fcfbf8]">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-[#1c190d] text-base font-medium leading-normal">
                                  이름 : {el.writerName} 아이디 : {el.writerId}
                                </p>
                                <p className="text-[#9c8d49] text-sm font-normal leading-normal">
                                  {el.title}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              <div
                                className="text-[#f3cc20]"
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
                                className="text-[#f3cc20]"
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
                                className="text-[#f3cc20]"
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
                                className="text-[#f3cc20]"
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
                                className="text-[#f3cc20]"
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
                            <img
                              src={el.reviewImageUrl}
                              className="w-[100px] h-[100px] "
                            />
                            <p className="text-[#1c190d] text-base font-normal leading-normal">
                              {el.description}
                            </p>
                            <div className="flex gap-9 text-[#9c8d49]">
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
                        </div>
                      );
                    })}

                    {/*  */}
                  </div>
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
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <ReportModal
          setModal={setModal}
          productId={productInfo?.productId as number}
        />
      )}
    </div>
  );
}
