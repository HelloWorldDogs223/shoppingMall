// api.js
import axios from 'axios';
import Router from 'next/router';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`, // API의 기본 URL 설정
});

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    if (response) {
      console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
      const status = response.status;
      if (status === 302 || status === 301) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          Router.push(redirectUrl);
        }
      }
    }
    return response;
  },
  (error) => {
    // 에러 응답 처리
    return Promise.reject(error);
  },
);

export default apiClient;
