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
import axios from 'axios';
import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/utils/axiosSetting';

const defaultTheme = createTheme();

export default function Page() {
  const router = useRouter();
  const { accessToken } = useManagerFetch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const makeRes: any = await apiClient.post(
      `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/root-manager/manager`,
      { serialNumber: data.get('email'), password: data.get('password') },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    console.log(makeRes.data);
  };

  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  }, []);

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
            관리자 계정 만들기
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
              만들기
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
