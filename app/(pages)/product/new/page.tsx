'use client';

import { useFetch } from '@/app/hooks/useFetch';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
  const [numberOfOptions, setNumberOfOptions] = useState<number>(0);
  const [numberOfSingle, setNumberOfSingle] = useState<number>(0);
  const [numberOfBlocks, setNumberOfBlocks] = useState<number>(0);
  const [blockSelect, setBlockSelect] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<number>(0);
  const [singleName, setSingleName] = useState<string[]>([]);
  const [singleAmount, setSingleAmount] = useState<number[]>([]);
  const [multiNames, setMultiNames] = useState<string[]>([]);
  const [multiPrices, setMultiPrices] = useState<number[]>([]);

  const [price, setPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0.0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [blockFiles, setBlockFiles] = useState<File[]>([]);
  const [blockText, setBlockText] = useState<string[]>([]);

  const { accessToken } = useFetch();

  useEffect(() => {
    setMultiNames(Array.from({ length: numberOfOptions }).fill('') as string[]);
    setMultiPrices(Array.from({ length: numberOfOptions }).fill(0) as number[]);
  }, [numberOfOptions]);

  useEffect(() => {
    setBlockSelect(
      Array.from({ length: numberOfBlocks }).fill('text') as string[],
    );

    setBlockFiles(Array.from({ length: numberOfBlocks }).fill(null) as File[]);
    setBlockText(Array.from({ length: numberOfBlocks }).fill(null) as string[]);
  }, [numberOfBlocks]);

  useEffect(() => {
    setSingleName(Array.from({ length: numberOfSingle }).fill('') as string[]);
    setSingleAmount(Array.from({ length: numberOfSingle }).fill(0) as number[]);
  }, [numberOfSingle]);

  const onSubmitHandler = async () => {
    let blockDataList = Array.from({ length: numberOfBlocks }).fill(null);

    blockDataList = blockDataList.map((el, idx) => {
      return {
        index: idx + 1,
        blockType: blockText[idx] === null ? 'IMAGE_TYPE' : 'TEXT_TYPE',
        content:
          blockText[idx] === null ? blockFiles[idx].name : blockText[idx],
      };
    });

    const productData = {
      productTypeId: category,
      name,
      singleOptions: singleName.map((el, idx) => {
        return { optionName: el, priceChangeAmount: singleAmount[idx] };
      }),
      multiOptions: multiNames.map((el, idx) => {
        return { optionName: el, priceChangeAmount: multiPrices[idx] };
      }),

      blockDataList: blockDataList.length === 0 ? null : blockDataList,
      price,
      discountAmount,
      discountRate: discountRate,
    };

    const formData = new FormData();

    console.log(productData, blockFiles, imageFiles);

    const productDataJson = new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    });

    formData.append('productData', productDataJson);
    Array.from(imageFiles).map((file) => {
      formData.append('productImages', file);
    });
    Array.from(blockFiles).map((file) => {
      formData.append('blockImages', file);
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/product`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log(res);
  };

  return (
    <div>
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
              <h3 className="text-[#111418] tracking-light text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
                상품 등록하기
              </h3>
              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Product name
                  </p>
                  <input
                    placeholder="Enter product name"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    제품 이미지
                  </p>
                  <input
                    className="file-input"
                    type="file"
                    multiple
                    onChange={(e: any) => setImageFiles(e.target.files)}
                  />
                </label>
              </div>

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Price
                  </p>
                  <input
                    type="number"
                    min={0}
                    placeholder="$0.00"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={price}
                    onChange={(e: any) => setPrice(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    할인율(%) 숫자만 입력하시오.
                  </p>
                  <input
                    placeholder="0%"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={discountRate}
                    onChange={(e: any) => setDiscountRate(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    할인 가격 : 숫자만 입력하시오.
                  </p>
                  <input
                    placeholder="0"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={discountAmount}
                    onChange={(e: any) => setDiscountAmount(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Categories
                  </p>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 bg-[image:--select-button-svg] placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                  >
                    <option value="1">게임$타이틀</option>
                    <option value="2">게임$게임기</option>
                    <option value="3">게임$주변기기</option>
                    <option value="4">도서$IT</option>
                    <option value="5">도서$문제지</option>
                    <option value="6">도서$소설</option>
                    <option value="7">도서$유아</option>
                    <option value="8">식료품$유제품</option>
                    <option value="9">식료품$밀키트</option>
                    <option value="10">식표품$과일</option>
                  </select>
                </label>
              </div>

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    단일 선택 옵션 개수
                  </p>
                  <input
                    type="number"
                    placeholder="옵션 개수"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={numberOfSingle}
                    onChange={(e: any) => setNumberOfSingle(e.target.value)}
                  />
                </label>
              </div>

              {Array.from({ length: numberOfSingle }).map((_, index) => (
                <div
                  className="flex gap-[1rem] max-w-[960px] px-4 py-3"
                  key={index}
                >
                  <label className="flex min-w-40 flex-1">
                    <label className="mr-[1rem]">
                      <p>단일 선택 옵션 상품명</p>
                      <input
                        placeholder=""
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                        onChange={(e: any) =>
                          setSingleName(
                            singleName.map((el, idx) => {
                              if (index === idx) {
                                return e.target.value;
                              } else {
                                return el;
                              }
                            }),
                          )
                        }
                      />
                    </label>
                    <label>
                      <p>단일 상품 옵션 가격</p>
                      <input
                        placeholder=""
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                        onChange={(e: any) =>
                          setSingleAmount(
                            singleAmount.map((el, idx) => {
                              if (index === idx) {
                                return e.target.value;
                              } else {
                                return el;
                              }
                            }),
                          )
                        }
                      />
                    </label>
                  </label>
                </div>
              ))}
              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    다중 선택 옵션 개수
                  </p>
                  <input
                    min={0}
                    type="number"
                    onChange={(e: any) => setNumberOfOptions(e.target.value)}
                    placeholder="0"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={numberOfOptions}
                  />
                </label>
              </div>

              {Array.from({ length: numberOfOptions }).map((_, index) => (
                <div
                  className="flex gap-[1rem] max-w-[960px] px-4 py-3"
                  key={index}
                >
                  <label className="flex min-w-40 flex-1">
                    <label className="mr-[1rem]">
                      <p>다중상품명</p>
                      <input
                        placeholder=""
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                        onChange={(e: any) =>
                          setMultiNames(
                            multiNames.map((el, idx) => {
                              if (index === idx) {
                                return e.target.value;
                              } else {
                                return el;
                              }
                            }),
                          )
                        }
                      />
                    </label>
                    <label>
                      <p>다중상품가격</p>
                      <input
                        placeholder=""
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                        onChange={(e: any) =>
                          setMultiPrices(
                            multiPrices.map((el, idx) => {
                              if (index === idx) {
                                return e.target.value;
                              } else {
                                return el;
                              }
                            }),
                          )
                        }
                      />
                    </label>
                  </label>
                </div>
              ))}

              <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    블록 개수
                  </p>
                  <input
                    placeholder=""
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    value={numberOfBlocks}
                    onChange={(e: any) => setNumberOfBlocks(e.target.value)}
                  />
                </label>
              </div>

              {Array.from({ length: numberOfBlocks }).map((_, index) => (
                <div key={index + 'a'}>
                  <div className="flex max-w-[960px] flex-wrap items-end gap-4  px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                        Categories
                      </p>
                      <select
                        value={blockSelect[index]}
                        onChange={(e: any) =>
                          setBlockSelect(
                            blockSelect.map((el: any, idx: number) => {
                              if (idx === index) {
                                return e.target.value;
                              } else {
                                return el;
                              }
                            }),
                          )
                        }
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 bg-[image:--select-button-svg] placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                      >
                        <option value="text">텍스트</option>
                        <option value="image">이미지</option>
                      </select>
                    </label>
                  </div>

                  {blockSelect[index] === 'text' ? (
                    <div
                      key={index}
                      className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3"
                    >
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                          텍스트 블록 OR 이미지 블록
                        </p>
                        <textarea
                          onChange={(e: any) =>
                            setBlockText(
                              blockText.map((el: any, idx: number) => {
                                if (idx === index) {
                                  return e.target.value;
                                } else {
                                  return el;
                                }
                              }),
                            )
                          }
                          placeholder="Describe your product"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] min-h-36 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                        ></textarea>
                      </label>
                    </div>
                  ) : (
                    <input
                      type="file"
                      onChange={(e: any) =>
                        setBlockFiles(
                          blockFiles.map((el: any, idx: number) => {
                            if (idx === index) {
                              return e.target.files[0];
                            } else {
                              return el;
                            }
                          }),
                        )
                      }
                    />
                  )}
                </div>
              ))}

              <div className="flex px-4 py-3 mx-auto" onClick={onSubmitHandler}>
                <button className="flex min-w-[960px] max-w-[960px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2884e6] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
