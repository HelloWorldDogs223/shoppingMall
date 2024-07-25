'use client';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const defaultTheme = createTheme();

export default function Page() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleGoogleLogin = async () => {
    const res = await axios.get(
      'https://api.group-group.com/oauth2/authorization/google',
    );
    console.log(res);
  };
  const handleKakaoLogin = async () => {
    const res = await axios.get(
      'https://api.group-group.com/oauth2/authorization/kakao',
    );
    console.log(res);
  };
  const handleNaverLogin = async () => {
    const res = await axios.get(
      'https://api.group-group.com/oauth2/authorization/naver',
    );
    console.log(res);
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
