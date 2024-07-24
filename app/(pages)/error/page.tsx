export default function Page() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px]  py-5 max-w-[960px] flex-1 ">
            <h2 className="text-[#1b130d] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Social login failed
            </h2>
            <p className="text-[#1b130d] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              We couldn't sign you in using your social media account. Please
              try again with the social login button. If you still can't sign
              in, try using a different login method or contact our support for
              further assistance.
            </p>
            <div className="flex px-4 py-3 justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee7f2b] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Try social login again</span>
              </button>
            </div>
            <p className="text-[#9a6e4c] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Or
            </p>
            <div className="flex px-4 py-3 justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Login with email</span>
              </button>
            </div>
            <div className="flex px-4 py-3 justify-center">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-transparent text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Contact support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
