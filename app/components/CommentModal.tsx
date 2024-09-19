import { Button, Rating, Typography } from '@mui/material';
import axios from 'axios';
import { useFetch } from '../hooks/useFetch';
import apiClient from '../utils/axiosSetting';

interface Props {
  score: number | null;
  setScore: (args: number | null) => void;
  commentTitle: string;
  setCommentTitle: (args: string) => void;
  commentImg: any;
  setCommentImg: (args: any) => void;
  description: string;
  setDescription: (args: string) => void;
  setModal: (args: boolean) => void;
  id: number;
}

export default function CommentModal({
  score,
  setScore,
  commentTitle,
  setCommentTitle,
  commentImg,
  setCommentImg,
  description,
  setDescription,
  setModal,
  id,
}: Props) {
  const { accessToken } = useFetch();

  const commentEditHandler = async () => {
    if (commentTitle !== '') {
      const reviewData = {
        title: commentTitle,
        description,
        score,
        reviewId: id,
      };

      const formData = new FormData();

      const productDataJson = new Blob([JSON.stringify(reviewData)], {
        type: 'application/json',
      });

      formData.append('reviewData', productDataJson);

      if (commentImg !== null) formData.append('reviewImage', commentImg);

      const editRes: any = await apiClient.put(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setModal(false);
      location.reload();
    }
  };

  return (
    <>
      <div
        className="fixed w-screen h-screen bg-black/30 top-0 left-0 z-[101] flex items-center justify-center"
        onClick={() => setModal(false)}
      >
        <div
          className="relative z-[105] flex flex-col bg-white group/design-root overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="layout-container flex h-full grow flex-col">
            <div className="px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col w-[512px]  py-5 max-w-[960px] flex-1">
                <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                  Add Comment
                </h1>
                <div>
                  <Typography component="legend">별점</Typography>
                  <Rating
                    name="simple-controlled"
                    value={score}
                    onChange={(event: any, newValue: number | null) => {
                      setScore(newValue);
                    }}
                  />
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                      Comment Title
                    </p>
                    <input
                      placeholder="Title"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                      value={commentTitle}
                      onChange={(e: any) => setCommentTitle(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                      Comment Description
                    </p>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] min-h-36 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                    ></textarea>
                  </label>
                </div>
                <div className="flex px-4 py-3">
                  <Button
                    variant="contained"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Upload Image</span>
                    <input
                      type="file"
                      onChange={(event: any) => {
                        setCommentImg(event.target.files[0]);
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <footer className="flex justify-center">
              <div className="flex max-w-[960px] flex-1 flex-col">
                <div className="p-4 @container">
                  <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#dce0e5] bg-white p-5 @[480px]:flex-row @[480px]:items-center">
                    <p className="text-[#111418] text-base font-bold leading-tight">
                      Your feedback helps us improve. Thank you for your time!
                    </p>
                    <Button
                      variant="contained"
                      className="text-sm font-bold leading-normal tracking-[0.015em] flex gap-2 text-[#111418]"
                      onClick={() => commentEditHandler()}
                    >
                      Send Feedback
                      <div
                        className="text-[#111418]"
                        data-icon="ArrowRight"
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
                          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                        </svg>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
