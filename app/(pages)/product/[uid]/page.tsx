'use client';

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
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';
import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import useCartStore from '@/app/store/cart';
import ReportModal from '@/app/components/ReportModal';
import Comment from '@/app/components/Comment';
import apiClient from '@/app/utils/axiosSetting';

interface Block {
  index: number;
  blockType: string;
  contentInTextBlock: string;
  imgDownloadUrlInImageBlock: string;
}

interface ProductType {
  productId: number;
  sellerId: number;
  productTypeId: number;
  productImageDownloadUrlList: any[];
  blockDataList: Block[];
  singleOptions: {
    optionName: string;
    priceChangeAmount: number;
  }[];
  multipleOptions: {
    optionName: string;
    priceChangeAmount: number;
  }[];
  name: string;
  price: number;
  discountAmount: number;
  discountRate: number;
  isBan: boolean;
  scoreAvg: number;
}

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
  const { uid } = useParams();

  const addItem = useCartStore((state: any) => state.addItem);

  const [selectedSingleOption, setSelectedSingleOption] = useState<
    string | null
  >(null);
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<
    string[]
  >([]);

  const [singleOptions, setSingleOptions] = useState([]);
  const [multipleOptions, setMultipleOptions] = useState([]);
  const [sellerRooms, setSellerRooms] = useState<any[]>([]);
  const [buyerRooms, setBuyerRooms] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [comments, setComments] = useState([]);

  const [commentTitle, setCommentTitle] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentImg, setCommentImg] = useState<File | null>(null);

  const [purchaseItemId, setPurchaseItemId] = useState(0);
  const [score, setScore] = useState<number | null>(0);

  const { accessToken: fetchAccessToken } = useFetch();
  const { accessToken: managerAccessToken } = useManagerFetch();

  const [productInfo, setProductInfo] = useState<ProductType>();
  const [memberInfo, setMemberInfo] = useState<any>({});

  const getProductById = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      const productData = response.data;
      setProductInfo(productData);
      setSingleOptions(productData.singleOptions);
      setMultipleOptions(productData.multipleOptions);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleMultipleOptionsChange = (
    event: SelectChangeEvent<typeof selectedMultipleOptions>,
  ) => {
    const { value } = event.target;
    setSelectedMultipleOptions(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSingleOptionChange = (event: SelectChangeEvent) => {
    setSelectedSingleOption(event.target.value as string);
  };

  const getComments = async () => {
    if (!productInfo) return;
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/reviews?sliceNumber=0&sliceSize=99&productId=${productInfo.productId}`,
      );
      setComments(response.data.reviewsList);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const getPurchaseItems = async () => {
    if (!productInfo) return;
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/purchases?sliceSize=99&sliceNumber=0`,
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      response.data.purchaseList.forEach((purchase: any) => {
        purchase.purchaseItems.forEach((item: any) => {
          if (item.productId === productInfo.productId) {
            setPurchaseItemId(item.purchaseItemId);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching purchase items:', error);
    }
  };

  const getMemberInfo = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      setMemberInfo(response.data);
    } catch (error) {
      console.error('Error fetching member info:', error);
    }
  };

  useEffect(() => {
    getProductById();
  }, []);

  useEffect(() => {
    if (productInfo) {
      getComments();
      getPurchaseItems();
      getMemberInfo();
    }
  }, [productInfo]);

  const handleEditClick = () => {
    if (!productInfo) {
      console.error('Product information is undefined');
      return;
    }

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

    const query = new URLSearchParams(convertToRecord(productInfo)).toString();
    router.push(`/product/edit?${query}`);
  };

  const addToCart = async () => {
    if (!selectedSingleOption) {
      alert('옵션을 골라주세요');
      return;
    }
    if (!productInfo) {
      console.error('Product information is undefined');
      return;
    }
    addItem({ id: productInfo.productId, name: productInfo.name });

    try {
      await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/basket`,
        {
          productId: productInfo.productId,
          singleOptionId: Number(selectedSingleOption),
          multipleOptionId: selectedMultipleOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const submitComment = async () => {
    if (!commentTitle || !commentContent || !score) {
      alert('모두 입력해주세요!');
      return;
    }

    const reviewData = {
      title: commentTitle,
      description: commentContent,
      score,
      purchaseItemId,
    };

    const formData = new FormData();
    formData.append(
      'reviewData',
      new Blob([JSON.stringify(reviewData)], { type: 'application/json' }),
    );
    if (commentImg) formData.append('reviewImage', commentImg);

    try {
      await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      getComments();
      setCommentTitle('');
      setCommentContent('');
      setCommentImg(null);
      setScore(0);
    } catch (error) {
      console.error('Error uploading review:', error);
    }
  };

  const changeProductStatus = async (status: 'on-sale' | 'discontinued') => {
    if (!productInfo) return;
    try {
      await apiClient.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${productInfo.productId}/sale-state/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      alert(
        status === 'on-sale'
          ? '판매 중으로 변경되었습니다.'
          : '판매 중단으로 변경되었습니다.',
      );
      setProductInfo({ ...productInfo, isBan: status !== 'on-sale' });
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const deleteProduct = async () => {
    if (!productInfo) return;
    try {
      await apiClient.delete(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product/${productInfo.productId}`,
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      alert('삭제되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getChatRooms = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        apiClient.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/buyer/chatrooms?sliceNumber=0&sliceSize=100`,
          {
            headers: {
              Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
            },
          },
        ),
        apiClient.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/seller/chatrooms?sliceNumber=0&sliceSize=100`,
          {
            headers: {
              Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
            },
          },
        ),
      ]);
      setBuyerRooms(buyerRes.data.chatRoomList);
      setSellerRooms(sellerRes.data.chatRoomList);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const createOrNavigateToChatRoom = async (productId: number) => {
    await getChatRooms();

    const existingRoom =
      buyerRooms.find((room: any) => room.product.productId === productId) ||
      sellerRooms.find((room: any) => room.product.productId === productId);

    if (existingRoom) {
      router.push(`/chat/${existingRoom.id}`);
      return;
    }

    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/chat`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${fetchAccessToken || managerAccessToken}`,
          },
        },
      );
      router.push(`/chat/${response.data.chatRoomId}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f8fafb] overflow-x-hidden">
      <div className="layout-container flex h-full flex-col">
        <div className="flex flex-1 justify-center py-5 px-6">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div className="relative flex min-h-[480px] rounded-lg overflow-hidden">
                  <img
                    src={
                      productInfo?.productImageDownloadUrlList?.[0] as string
                    }
                    alt="제품 이미지"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
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
                          onClick={() => changeProductStatus('on-sale')}
                        >
                          판매중으로 변경
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                          onClick={() => changeProductStatus('discontinued')}
                        >
                          판매중단으로 변경
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-red-500 text-white hover:bg-red-600 transition duration-300"
                          onClick={deleteProduct}
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
                    onClick={handleEditClick}
                    variant="contained"
                    className="w-full sm:w-[200px] bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out"
                  >
                    수정하기
                  </Button>
                )}
                <Button
                  onClick={addToCart}
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
                  onClick={() =>
                    createOrNavigateToChatRoom(productInfo?.productId as number)
                  }
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
                <InputLabel id="multiple-options-label">옵션</InputLabel>
                <Select
                  labelId="multiple-options-label"
                  id="multiple-options"
                  multiple
                  value={selectedMultipleOptions}
                  onChange={handleMultipleOptionsChange}
                  input={<OutlinedInput label="옵션" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {multipleOptions.map((option: any) => (
                    <MenuItem key={option.optionId} value={option.optionId}>
                      <Checkbox
                        checked={
                          selectedMultipleOptions.indexOf(option.optionId) > -1
                        }
                      />
                      <ListItemText
                        primary={`${option.optionName} (${option.priceChangeAmount > 0 ? '+' : ''}${option.priceChangeAmount})`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="single-option-label">옵션</InputLabel>
                <Select
                  labelId="single-option-label"
                  id="single-option"
                  value={selectedSingleOption || ''}
                  label="옵션"
                  onChange={handleSingleOptionChange}
                >
                  {singleOptions.map((option: any) => (
                    <MenuItem key={option.optionId} value={option.optionId}>
                      {option.optionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col p-4 gap-3">
              <details className="flex flex-col rounded-xl border border-[#d0dbe6] bg-[#f8fafb] px-[15px] py-[7px] group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#0e141b] text-sm font-medium leading-normal">
                    Product Information
                  </p>
                  <div className="text-[#0e141b] group-open:rotate-180">
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
                    (item: Block, index: number) => (
                      <div key={index}>
                        {item.blockType === 'TEXT_TYPE' ? (
                          <div>{item.contentInTextBlock}</div>
                        ) : (
                          <div>
                            <img
                              src={item.imgDownloadUrlInImageBlock}
                              alt="Product Block"
                            />
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </details>
              {/* Additional details sections can be added here */}
            </div>
            <div className="flex gap-x-8 gap-y-6 p-4 mt-[100px] ">
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
                onSubmit={(e) => {
                  e.preventDefault();
                  submitComment();
                }}
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
                  onChange={(event, newValue) => {
                    setScore(newValue);
                  }}
                />
                <div className="flex flex-col gap-6 mt-8">
                  <label className="text-lg font-medium">타이틀</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
                    value={commentTitle}
                    onChange={(e) => setCommentTitle(e.target.value)}
                  />
                  <label className="text-lg font-medium">내용</label>
                  <textarea
                    className="w-full resize-none h-[200px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                </div>
                <input
                  type="file"
                  className="mt-6 mb-8"
                  onChange={(e) => {
                    setCommentImg(e.target.files?.[0] || null);
                  }}
                />
                <Button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
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
                      {comments.map((comment: any) => (
                        <Comment
                          key={comment.id}
                          el={comment}
                          setComments={setComments}
                          comments={comments}
                        />
                      ))}
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
    </div>
  );
}
