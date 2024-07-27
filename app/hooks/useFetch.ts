import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/login';
import { useEffect } from 'react';

export const useFetch = () => {
  const router = useRouter();
  const { setAccessToken, accessToken } = useAuthStore();

  useEffect(() => {
    const fetchToken = async () => {
      if (accessToken === null) {
        try {
          const res = await axios.get(
            'https://api.group-group.com/auth/reissue',
            {
              withCredentials: true,
            },
          );
          setAccessToken(res.data.accessToken);
        } catch (error) {
          router.push('/signin');
          console.error('Error fetching token', error);
        }
      }
    };

    fetchToken();
  }, [accessToken, setAccessToken, router]);
};
