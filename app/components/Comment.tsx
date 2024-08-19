import axios from 'axios';
import { useFetch } from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import CommentModal from './CommentModal';
import ReportModal from './ReportModal';

interface Props {
  el: any;
}

interface Member {
  id: number;
  nickName: string;
  email: string;
  profileImageDownLoadUrl: string;
  isBan: Boolean;
}

export default function Comment({ el }: Props) {
  const [memberInfo, setMemberInfo] = useState<Member>();
  const { accessToken } = useFetch();

  const [commentTitle, setCommentTitle] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState<number | null>(0);
  const [commentImg, setCommentImg] = useState('');
  const [modal, setModal] = useState<boolean>(false);

  const [reportModal, setReportModal] = useState(false);

  const getMemberInfo = async () => {
    const memberRes: any = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    setMemberInfo(memberRes.data);

    console.log('멤버, 라이터네임');
    console.log(memberRes.data, el.writerName);
  };

  useEffect(() => {
    getMemberInfo();
  }, []);

  const commentDeleteHandler = () => {
    const res: any = axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/review/${el.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
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
                이름 : {el.writerName} 아이디 : {el.writerId}
              </p>
              <p className="text-[#9c8d49] text-sm font-normal leading-normal">
                {el.title}
              </p>
              <Button onClick={() => setReportModal(true)}>
                리뷰 신고하기
              </Button>
              <p>
                {el.writerName === memberInfo?.nickName ? (
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
          <div className="flex gap-0.5">
            <div
              className="text-[#f3cc20]"
              data-icon="Star"
              data-size="20px"
              data-weight="fill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
              </svg>
            </div>
            <div
              className="text-[#f3cc20]"
              data-icon="Star"
              data-size="20px"
              data-weight="fill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
              </svg>
            </div>
            <div
              className="text-[#f3cc20]"
              data-icon="Star"
              data-size="20px"
              data-weight="fill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
              </svg>
            </div>
            <div
              className="text-[#f3cc20]"
              data-icon="Star"
              data-size="20px"
              data-weight="fill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
              </svg>
            </div>
            <div
              className="text-[#f3cc20]"
              data-icon="Star"
              data-size="20px"
              data-weight="fill"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
              </svg>
            </div>
          </div>
          <img src={el.reviewImageUrl} className="w-[100px] h-[100px] " />
          <p className="text-[#1c190d] text-base font-normal leading-normal">
            {el.description}
          </p>
          <div className="flex gap-9 text-[#9c8d49]">
            <button className="flex items-center gap-2">
              <div
                className="text-inherit"
                data-icon="ThumbsUp"
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
                  <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                </svg>
              </div>
              <p className="text-inherit">2</p>
            </button>
            <button className="flex items-center gap-2">
              <div
                className="text-inherit"
                data-icon="ThumbsDown"
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
                  <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
