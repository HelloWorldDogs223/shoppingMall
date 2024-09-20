'use client';

import { useFetch } from '@/app/hooks/useFetch';
import {
  Button,
  TextField,
  Avatar,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Edit, Save, AccessTime } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/utils/axiosSetting';

export default function Page() {
  const { error, accessToken } = useFetch();

  const [postEmail, setPostEmail] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  const [nickname, setNickname] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [email, setEmail] = useState<string>('');
  const [editEmail, setEditEmail] = useState('');
  const [count, setCount] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown in seconds
  const [img, setImg] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [emailError, setEmailError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // HTMLInputElement로 타입 지정

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); // 파일 입력 창을 엽니다.
  };
  const router = useRouter();

  const fetchUser = async () => {
    if (!accessToken) return;

    const userInfoRes: any = await apiClient.get(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setImg(userInfoRes.data?.profileImageDownLoadUrl);
    setEmail(userInfoRes.data.email);
    setNickname(userInfoRes.data.nickName);

    if (userInfoRes.data.isBan) {
      alert('밴이 된 유저입니다.');
      router.push('/');
    }
  };

  useEffect(() => {
    if (error) {
      router.push('/signin');
    }
    fetchUser();
  }, [error, router, accessToken]);

  const emailCheckHandler = async () => {
    if (email === '') {
      setEmailError(true);
      return;
    }
    if (count) {
      alert('시간이 아직 남아있습니다.');
      return;
    }
    const res: any = await apiClient.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/email/registration/request`,
      { email: editEmail },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setCount(true);
    setCountdown(180); // Reset to 3 minutes
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (count && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCount(false);
    }
    return () => clearTimeout(timer);
  }, [count, countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const onNicknameChangeHandler = (e: any) => {
    setEditNickname(e.target.value);
  };

  const onEmailChangeHandler = (e: any) => {
    setEditEmail(e.target.value);
    setEmailError(false);
  };

  const onSubmitHandler = async () => {
    try {
      const res: any = await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/info`,
        { nickName: editNickname, profileImg: imgFile },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setNickname(editNickname);
    } catch (error) {
      console.error('Error:', error);
      alert('올바른 한글 / 영어 닉네임을 입력해주세요!');
    } finally {
      fetchUser();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string); // 파일 내용을 상태로 설정합니다.
      };
      reader.readAsDataURL(file); // 파일 내용을 Data URL로 읽습니다.
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={
                  img ||
                  'https://cdn.usegalileo.ai/stability/77b57bfe-1501-4498-b8a4-24d719383033.png'
                }
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {nickname}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {email}
              </Typography>
              {!edit && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEdit(true)}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  프로필 수정
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {edit ? (
              <Box>
                <TextField
                  fullWidth
                  label="닉네임"
                  variant="outlined"
                  value={editNickname}
                  onChange={onNicknameChangeHandler}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  프로필 이미지 변경
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </Button>
                <Button
                  startIcon={<Save />}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setEdit(false);
                    onSubmitHandler();
                  }}
                  disabled={count}
                >
                  변경사항 저장
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  계정 관리
                </Typography>
                <Grid container spacing={2}>
                  {[
                    '판매 제품 목록',
                    '회원탈퇴',
                    '판매 정산',
                    '판매 정산액',
                    '구매자 환불 요청',
                    '판매자 환불 요청',
                    '구매 목록',
                    '계좌 등록/조회',
                    '채팅방',
                  ].map((text, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() =>
                          router.push(
                            `/${text.toLowerCase().replace(/ /g, '-')}`,
                          )
                        }
                      >
                        {text}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {postEmail && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              이메일 등록
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={editEmail}
              onChange={onEmailChangeHandler}
              disabled={count}
              error={emailError}
              helperText={emailError ? '이메일을 입력해주세요!' : ''}
            />
            <Button
              variant="contained"
              onClick={emailCheckHandler}
              sx={{ mt: 2, mr: 2 }}
            >
              인증하기
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPostEmail(false)}
              sx={{ mt: 2 }}
            >
              저장하고 나가기
            </Button>
          </Box>
        )}

        {count && countdown > 0 && (
          <Box mt={2} display="flex" alignItems="center" color="error.main">
            <AccessTime sx={{ mr: 1 }} />
            <Typography>남은 시간: {formatTime(countdown)}</Typography>
          </Box>
        )}

        {!count && countdown === 0 && (
          <Typography color="error" mt={2}>
            이메일이 만료되었습니다. 다시 인증해주세요!
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
