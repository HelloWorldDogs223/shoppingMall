import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/login';
import { useEffect, useState } from 'react';
import apiClient from '../utils/axiosSetting';

export const useFetch = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setAccessToken, accessToken } = useAuthStore();

  useEffect(() => {
    const fetchToken = async () => {
      if (!accessToken) {
        try {
          const res = await apiClient.get(
            'https://api.group-group.com/auth/reissue',
          );
          setAccessToken(res.data.accessToken);
        } catch (error: any) {
          console.error('Error fetching token', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchToken();
  }, [accessToken, setAccessToken, router]);

  return { loading, error, accessToken };
};
