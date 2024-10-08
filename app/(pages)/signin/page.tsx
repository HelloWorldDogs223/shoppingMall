'use client';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/utils/axiosSetting';

const defaultTheme = createTheme();

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const loginRes: any = await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/manager/login`,
        { serialNumber: data.get('email'), password: data.get('password') },
      );
      if (loginRes.data) {
        localStorage.setItem('manager', loginRes.data.accessToken as string);
        router.push('/manager/info');
      }
      return;
    } catch (e) {
      console.log(e);
    }

    try {
      const loginResUser: any = await apiClient.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/member/login`,
        { email: data.get('email'), password: data.get('password') },
        { withCredentials: true },
      );
      router.push('/');
    } catch (e) {
      console.log(e);
    }
  };

  const handleGoogleLogin = async () => {
    location.href = 'https://api.group-group.com/oauth2/authorization/google';
  };
  const handleKakaoLogin = async () => {
    location.href = 'https://api.group-group.com/oauth2/authorization/kakao';
  };
  const handleNaverLogin = async () => {
    location.href = 'https://api.group-group.com/oauth2/authorization/naver';
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      <div className="w-full flex justify-center">
        <Button
          onClick={() => router.push('/signup')}
          type="submit"
          className="w-[396px] bg-red-500 hover:bg-yellow-500"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          회원가입하기
        </Button>
      </div>
      <div className="w-full flex justify-center mt-[50px]">
        <hr className="w-[500px]" />
      </div>
      <div className="w-full flex justify-center mt-[32px] font-[20px]">
        SNS 로그인하기
      </div>
      <div className="w-full flex justify-center mt-[100px] mb-[100px]">
        <img
          onClick={handleNaverLogin}
          src="/naver.svg"
          className="w-[55px] h-[55px] rounded-full cursor-pointer mr-[32px] object-fill"
        />
        <img
          onClick={handleGoogleLogin}
          src="/google.svg"
          className="w-[55px] h-[55px] rounded-full cursor-pointer mr-[32px] object-fill"
        />
        <img
          onClick={handleKakaoLogin}
          src="/kakao.svg"
          className="w-[55px] h-[55px] rounded-full cursor-pointer mr-[32px] object-fill"
        />
      </div>
    </ThemeProvider>
  );
}
