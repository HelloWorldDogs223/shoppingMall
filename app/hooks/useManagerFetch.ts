import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useManagerFetch = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let accessToken = null;
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서만 localStorage 접근
    accessToken = localStorage.getItem('manager');
  }

  useEffect(() => {
    const fetchToken = async () => {
      if (!accessToken) {
        try {
          const res = await axios.get(
            'https://api.group-group.com/manager/reissue',
            {
              withCredentials: true,
            },
          );
          localStorage.setItem('manager', res.data.accessToken);
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
  }, [accessToken, router]);

  return { loading, error, accessToken };
};
