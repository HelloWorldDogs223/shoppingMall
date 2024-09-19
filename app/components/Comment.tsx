import axios from 'axios';
import { useFetch } from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { Button, Rating } from '@mui/material';
import CommentModal from './CommentModal';
import ReportModal from './ReportModal';
import apiClient from '../utils/axiosSetting';

interface Props {
  el: any;
  setComments: (args: any) => void;
  comments: any;
}

interface Member {
  id: number;
  nickName: string;
  email: string;
  profileImageDownLoadUrl: string;
  isBan: Boolean;
}

export default function Comment({ el, setComments, comments }: Props) {
  const [memberInfo, setMemberInfo] = useState<Member>();
  const { accessToken } = useFetch();

  const [commentTitle, setCommentTitle] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState<number | null>(0);
  const [commentImg, setCommentImg] = useState('');
  const [modal, setModal] = useState<boolean>(false);

  const [rating, setRating] = useState(0);

  const [reportModal, setReportModal] = useState(false);

  const getMemberInfo = async () => {
    const memberRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    setMemberInfo(memberRes.data);
  };

  useEffect(() => {
    getMemberInfo();
  }, []);

  useEffect(() => {
    setRating(el.score);
  }, [el.score]);

  const commentDeleteHandler = () => {
    const res: any = apiClient.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/${el.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    setComments(
      comments.filter((item: any) => {
        return item.id !== el.id;
      }),
    );
  };

  return (
    <>
      {modal && (
        <CommentModal
          setModal={setModal}
          score={score}
          setScore={setScore}
          commentTitle={commentTitle}
          setCommentTitle={setCommentTitle}
          setDescription={setDescription}
          commentImg={commentImg}
          setCommentImg={setCommentImg}
          description={description}
          id={el.id}
        />
      )}

      {reportModal && (
        <ReportModal
          setModal={setReportModal}
          productId={0}
          reviewId={el.id}
          review={true}
        />
      )}

      <div className="flex flex-col gap-8 overflow-x-hidden bg-[#fcfbf8] p-4">
        <div className="flex flex-col gap-3 bg-[#fcfbf8]">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[#1c190d] text-base font-medium leading-normal">
                닉네임 : {el.writerName}
              </p>
              <p className="text-[#9c8d49] text-sm font-normal leading-normal">
                제목 : {el.title}
              </p>
              <Button onClick={() => setReportModal(true)}>
                리뷰 신고하기
              </Button>
              <p>
                {el.writerId === memberInfo?.id ? (
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => commentDeleteHandler()}
                    >
                      삭제하기
                    </Button>
                    <Button variant="contained" onClick={() => setModal(true)}>
                      수정하기
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>

          {el?.score !== undefined && (
            <Rating
              name="half-rating-read"
              value={rating}
              precision={0.5}
              readOnly
            />
          )}

          <img src={el.reviewImageUrl} className="w-[100px] h-[100px] " />
          <p className="text-[#1c190d] text-base font-normal leading-normal">
            리뷰내용: {el.description}
          </p>
        </div>
      </div>
    </>
  );
}
