import Image from 'next/image';

export default function Page() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fafb] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif;' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <a
                className="text-[#4f7396] text-base font-medium leading-normal"
                href="#"
              >
                Home
              </a>
              <span className="text-[#4f7396] text-base font-medium leading-normal">
                /
              </span>
              <a
                className="text-[#4f7396] text-base font-medium leading-normal"
                href="#"
              >
                Women
              </a>
              <span className="text-[#4f7396] text-base font-medium leading-normal">
                /
              </span>
              <span className="text-[#0e141b] text-base font-medium leading-normal">
                Clothing
              </span>
            </div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Women's Clothing
              </p>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#e8edf3] text-[#0e141b] text-sm font-medium leading-normal">
                <span className="truncate">Filter</span>
              </button>
            </div>
            <div className="flex gap-3 p-3 overflow-x-hidden">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Tops
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Dresses
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Pants
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Shorts
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Skirts
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Jumpsuits
                </p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8edf3] pl-4 pr-4">
                <p className="text-[#0e141b] text-sm font-medium leading-normal">
                  Sweaters
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Silk Blouse
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $120
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Cotton T-Shirt
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $30
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Pleated Midi Dress
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $150
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    High-Waisted Jeans
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $80
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Lightweight Cardigan
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $60
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Sleeveless Jumpsuit
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $100
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Knit Crop Top
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $45
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl">
                  {' '}
                  <Image
                    src="/exampleCloth.png"
                    width={176}
                    height={176}
                    alt="product page"
                  />
                </div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">
                    Flowy Maxi Skirt
                  </p>
                  <p className="text-[#4f7396] text-sm font-normal leading-normal">
                    $90
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
