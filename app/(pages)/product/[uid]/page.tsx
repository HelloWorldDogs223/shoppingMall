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
  productImageDownloadUrlList: any[];
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
import Comment from '@/app/components/Comment';

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
  const [sellerRooms, setSellerRooms] = useState<any[]>([]);
  const [buyerRooms, setBuyerRooms] = useState<any[]>([]);
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
  const [memberInfo, setMemberInfo] = useState<any>({});

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
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchases?sliceSize=99&sliceNumber=0`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    buyProductRes.data.purchaseList.forEach((el: any) => {
      el.purchaseItems.forEach((item: any) => {
        if (item.productId === productInfo?.productId) {
          setId(item.purchaseItemId);
        }
      });
    });
  };

  const getMemberInfo = async () => {
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setMemberInfo(res.data);
  };

  useEffect(() => {
    getProductById();
  }, [accessToken]);

  useEffect(() => {
    if (productInfo) {
      getComments();
      getBuyProducts();
      getMemberInfo();
    }
  }, [productInfo]);

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
    if (age === null) {
      alert('옵션을 골라주세요');
      return;
    }
    addItem({ id: productInfo?.productId, name });
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
    if (commentTitle !== '') {
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

        location.reload();
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

  const getProductStatusOn = async () => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${productInfo?.productId}/sale-state/on-sale`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('판매 중으로 변경되었습니다.');
    location.reload();
  };

  const getProductStatusOff = async () => {
    const res: any = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${productInfo?.productId}/sale-state/discontinued`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('판매 중단으로 변경되었습니다.');
    location.reload();
  };

  const deleteProduct = async () => {
    const res: any = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${productInfo?.productId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    alert('삭제되었습니다.');
    location.reload();
  };

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

  // 채팅방 생성
  const makeChatRoom = async (productId: number) => {
    getChatRoomByBuyer();
    getChatRoomBySeller();

    const room1 = buyerRooms.find((el: any) => {
      return el.product.productId === productId;
    });

    const room2 = sellerRooms.find((el: any) => {
      return el.product.productId === productId;
    });

    if (room1 || room2) {
      router.push(`/chat/${room1?.id || room2?.id}`);
      return;
    }

    try {
      const res: any = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat`,
        { productId },
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      );
      router.push(`/chat/${res.data.chatRoomId}`);
    } catch (e) {
      console.log(e);
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
                <div className="relative flex min-h-[480px] rounded-lg overflow-hidden">
                  <img
                    src={productInfo?.productImageDownloadUrlList[0] as string}
                    alt="제품 이미지"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>

                  {/* 텍스트 및 버튼 컨텐츠 */}
                  <div className="relative z-10 flex flex-col gap-6 justify-end px-4 pb-10 sm:px-10">
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl sm:leading-tight sm:tracking-[-0.033em]">
                        제품명: {productInfo?.name}
                      </h1>
                    </div>

                    {memberInfo?.id === productInfo?.sellerId && (
                      <div className="flex gap-4 mt-4">
                        <Button
                          variant="contained"
                          className="bg-green-500 text-white hover:bg-green-600 transition duration-300"
                          onClick={() => getProductStatusOn()}
                        >
                          판매중으로 변경
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                          onClick={() => getProductStatusOff()}
                        >
                          판매중단으로 변경
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-red-500 text-white hover:bg-red-600 transition duration-300"
                          onClick={() => deleteProduct()}
                        >
                          제품 삭제
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="mt-6 text-blue-600 cursor-pointer hover:underline"
                  onClick={() =>
                    router.push(
                      `/list-product-sell?member=${productInfo?.sellerId}`,
                    )
                  }
                >
                  판매자 (클릭시 판매자 상품 조회 가능)
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-between items-center mb-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">가격:</h2>
                <h3 className="text-2xl font-bold text-gray-800">
                  {productInfo?.price}원
                </h3>
              </div>
              <div className="flex gap-4 flex-wrap">
                {memberInfo?.id === productInfo?.sellerId && (
                  <Button
                    onClick={() => handleClick()}
                    variant="contained"
                    className="w-full sm:w-[200px] bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out"
                  >
                    수정하기
                  </Button>
                )}
                <Button
                  onClick={() => getCart()}
                  variant="contained"
                  className="w-full sm:w-[200px] bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
                >
                  장바구니 담기
                </Button>
                <Button
                  onClick={() => setModal(true)}
                  variant="contained"
                  className="w-full sm:w-[200px] bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
                >
                  제품 신고하기
                </Button>
                <Button
                  onClick={() => makeChatRoom(productInfo?.productId as number)}
                  variant="contained"
                  className="w-full sm:w-[200px] bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
                >
                  판매자에게 문의하기 / 구매자 문의 확인하기
                </Button>
              </div>
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
                      <MenuItem key={el.optionId} value={el.optionId}>
                        {el.optionName}
                      </MenuItem>
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
                <div className="text-[#4f7396] text-sm font-normal leading-normal pb-2">
                  {productInfo?.blockDataList?.map(
                    (item: Block, index: number) => {
                      return (
                        <div key={index}>
                          {item.blockType === 'TEXT_TYPE' ? (
                            <div>{item.contentInTextBlock}</div>
                          ) : (
                            <div>
                              <img src={item.imgDownloadUrlInImageBlock} />
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
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
            <div className="flex  gap-x-8 gap-y-6 p-4 mt-[100px] ">
              <div className="flex flex-col gap-2">
                <p className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em]">
                  {productInfo?.scoreAvg}점
                </p>
                <Rating
                  name="half-rating-read"
                  value={productInfo?.scoreAvg ?? 5}
                  precision={0.5}
                  readOnly
                />
                <p className="text-[#0e141b] text-base font-normal leading-normal">
                  {comments.length} reviews
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center p-6 bg-[#f9f9f7]">
              <form
                onSubmit={commentOnSubmitHandler}
                className="w-full max-w-[800px] bg-white shadow-lg rounded-lg p-8"
              >
                <Typography
                  component="legend"
                  className="text-xl font-semibold mb-4"
                >
                  별점
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={score}
                  onChange={(event: any, newValue: number | null) => {
                    setScore(newValue);
                  }}
                />
                <div className="flex flex-col gap-6 mt-8">
                  <label className="text-lg font-medium">타이틀</label>
                  <input
                    className="w-full border border-solid border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
                    value={commentTitle}
                    onChange={(e: any) => setCommentTitle(e.target.value)}
                  />
                  <label className="text-lg font-medium">내용</label>
                  <textarea
                    className="w-full resize-none h-[200px] border border-solid border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={commentContent}
                    onChange={(e: any) => setCommentContent(e.target.value)}
                  />
                </div>
                <input
                  type="file"
                  className="mt-6 mb-8"
                  onChange={(event: any) => {
                    setCommentImg(event.target.files[0]);
                  }}
                />
                <Button
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                  onClick={commentOnSubmitHandler}
                >
                  제출하기
                </Button>
              </form>
              <div className="relative flex flex-col w-full min-h-screen bg-[#fcfbf8] overflow-x-hidden">
                <div className="layout-container flex flex-col items-center">
                  <div className="px-6 flex flex-1 justify-center py-8">
                    <div className="layout-content-container flex flex-col max-w-[960px] w-full">
                      <h2 className="text-[#1c190d] text-[24px] font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-5">
                        Rating &amp; Reviews
                      </h2>
                      {comments.map((el: any) => {
                        return (
                          <Comment
                            key={el.id} // or any unique identifier
                            el={el}
                            setComments={setComments}
                            comments={comments}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
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
