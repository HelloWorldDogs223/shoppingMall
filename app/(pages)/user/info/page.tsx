'use client';

import { useFetch } from '@/app/hooks/useFetch';
import {
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Paper,
  Badge,
} from '@mui/material';
import { Edit, Email, Save, PhotoCamera } from '@mui/icons-material';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
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
    await apiClient.post(
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
      await apiClient.post(
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
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper elevation={0} style={{ minHeight: '100vh', padding: '20px' }}>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      edit && (
                        <IconButton
                          color="primary"
                          component="label"
                          onClick={handleFileButtonClick}
                        >
                          <PhotoCamera />
                          <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={handleFileChange}
                          />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar
                      src={
                        img
                          ? img
                          : 'https://cdn.usegalileo.ai/stability/77b57bfe-1501-4498-b8a4-24d719383033.png'
                      }
                      alt="avatar"
                      sx={{ width: 128, height: 128 }}
                    />
                  </Badge>
                </Grid>
                <Grid item xs>
                  {edit ? (
                    <TextField
                      label="닉네임"
                      variant="outlined"
                      fullWidth
                      value={editNickname}
                      onChange={onNicknameChangeHandler}
                    />
                  ) : (
                    <Typography variant="h5">닉네임: {nickname}</Typography>
                  )}
                  <Typography variant="subtitle1">이메일: {email}</Typography>
                </Grid>
                <Grid item>
                  {edit ? (
                    <IconButton color="primary" onClick={onSubmitHandler}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton color="primary" onClick={() => setEdit(true)}>
                      <Edit />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            {postEmail && (
              <CardContent>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="이메일"
                      variant="outlined"
                      fullWidth
                      disabled={count}
                      value={editEmail}
                      onChange={onEmailChangeHandler}
                      error={emailError}
                      helperText={emailError ? '이메일을 입력해주세요!' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={emailCheckHandler}
                      disabled={count}
                    >
                      인증하기
                    </Button>
                  </Grid>
                </Grid>
                {count && countdown > 0 && (
                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    남은 시간: {formatTime(countdown)}
                  </Typography>
                )}
                {!count && countdown === 0 && (
                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    이메일이 만료되었습니다. 다시 인증해주세요!
                  </Typography>
                )}
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setPostEmail(false)}
                >
                  저장하고 나가기
                </Button>
              </CardContent>
            )}
            <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/list-product-sell')}
              >
                판매자 - 내 판매 제품 목록 확인하기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/withdraw')}
              >
                회원탈퇴하기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/review')}
              >
                내 판매 정산 보기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/review/cost')}
              >
                내 판매 정산액 보기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/list-refund-buyer')}
              >
                구매자 - 환불 요청 목록 확인하기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/list-refund')}
              >
                판매자 - 환불 요청 목록 확인하기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/list-buy')}
              >
                구매 목록 확인하기
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/bank')}
              >
                계좌 등록 및 조회
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/chat')}
              >
                채팅방 확인하기
              </Button>
              {!edit && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setEdit(true)}
                  startIcon={<Edit />}
                >
                  프로필 수정하기
                </Button>
              )}
              {postEmail === false && edit === false && (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<Email />}
                  onClick={() => setPostEmail(true)}
                >
                  이메일 등록
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}
