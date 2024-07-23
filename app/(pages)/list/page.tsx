import Card from '@/app/components/Card';
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
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
