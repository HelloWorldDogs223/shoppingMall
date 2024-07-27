import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/login';

export const useFetch = async () => {
  const router = useRouter();
  const { setAccessToken, accessToken } = useAuthStore();
  if (accessToken === null) {
    try {
      const res: any = await axios.get(
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
