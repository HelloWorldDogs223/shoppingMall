export default function Page() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <a
                className="text-[#4e7397] text-base font-medium leading-normal"
                href="#"
              >
                Home
              </a>
              <span className="text-[#4e7397] text-base font-medium leading-normal">
                /
              </span>
              <span className="text-[#0e141b] text-base font-medium leading-normal">
                Wishlist
              </span>
            </div>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Wishlist
            </h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="table-ceb86489-5184-499f-ab10-7edca610396b-column-56 px-4 py-3 text-left text-[#0e141b] w-14 text-sm font-medium leading-normal">
                        Product
                      </th>
                      <th className="table-ceb86489-5184-499f-ab10-7edca610396b-column-176 px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium leading-normal">
                        Price
                      </th>
                      <th className="table-ceb86489-5184-499f-ab10-7edca610396b-column-296 px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#d0dbe7]">
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-56 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                          style={{
                            backgroundImage:
                              'url("https://cdn.usegalileo.ai/sdxl10/8188ae49-ec5f-4c59-b72e-b8e1bd2ddef2.png")',
                          }}
                        ></div>
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-176 h-[72px] px-4 py-2 w-[400px] text-[#0e141b] text-sm font-normal leading-normal">
                        89.99
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-296 h-[72px] px-4 py-2 w-[400px] text-[#4e7397] text-sm font-normal leading-normal">
                        Remove
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d0dbe7]">
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-56 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                          style={{
                            backgroundImage:
                              'url("https://cdn.usegalileo.ai/sdxl10/fec69114-3649-408d-8309-ed2e2fa246db.png")',
                          }}
                        ></div>
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-176 h-[72px] px-4 py-2 w-[400px] text-[#0e141b] text-sm font-normal leading-normal">
                        89.99
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-296 h-[72px] px-4 py-2 w-[400px] text-[#4e7397] text-sm font-normal leading-normal">
                        Remove
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d0dbe7]">
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-56 h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                          style={{
                            backgroundImage:
                              'url("https://cdn.usegalileo.ai/sdxl10/b9959779-f664-47cb-b290-fc5746d023a4.png")',
                          }}
                        ></div>
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-176 h-[72px] px-4 py-2 w-[400px] text-[#0e141b] text-sm font-normal leading-normal">
                        89.99
                      </td>
                      <td className="table-ceb86489-5184-499f-ab10-7edca610396b-column-296 h-[72px] px-4 py-2 w-[400px] text-[#4e7397] text-sm font-normal leading-normal">
                        Remove
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <style>
                {`
                          @container(max-width:56px){.table-ceb86489-5184-499f-ab10-7edca610396b-column-56{display: none;}}
                @container(max-width:176px){.table-ceb86489-5184-499f-ab10-7edca610396b-column-176{display: none;}}
                @container(max-width:296px){.table-ceb86489-5184-499f-ab10-7edca610396b-column-296{display: none;}}
                @container(max-width:416px){.table-ceb86489-5184-499f-ab10-7edca610396b-column-416{display: none;}}`}
              </style>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Continue Shopping</span>
                </button>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
