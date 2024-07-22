export default function Home() {
  return (
    <div className="h-full pb-[100px]">
      <div className="flex mt-[36px] px-[176px] mb-[32px]">
        <div className="relative flex-1 flex justify-center">
          <img
            src="/example.jpg"
            className="w-[928px] h-[400px] object-fill  rounded-2xl"
            alt="main-image"
          />
          <div className="absolute top-[320px] z-[2] left-[50%] translate-x-[255%] w-[119px] h-12 px-5 bg-black rounded-xl justify-center items-center inline-flex cursor-pointer">
            <div className="flex-col justify-start items-center inline-flex">
              <div className="text-center text-white text-base font-bold font-['Work Sans'] leading-normal">
                Shop now
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-[32px] mb-[32px]">
        <img src="/example2.png" alt="main-image2" className="mr-[12px]" />
        <img src="/example3.png" alt="main-image3" />
      </div>
      <div className="flex justify-center">
        <img src="/example4.png" className="mr-[12px]" alt="main-image3" />
        <img src="/example4.png" className="mr-[12px]" alt="main-image3" />
        <img src="/example4.png" className="mr-[12px]" alt="main-image3" />
        <img src="/example4.png" className="mr-[12px]" alt="main-image3" />
      </div>
    </div>
  );
}
