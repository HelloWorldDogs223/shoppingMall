// api.js
import axios from 'axios';
import Router from 'next/router';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`, // API의 기본 URL 설정
});

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    // 정상적인 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 에러 응답 처리
    if (error.response) {
      const status = error.response.status;
      if (status === 302 || status === 301) {
        const redirectUrl = error.response.headers.location;
        if (redirectUrl) {
          Router.push(redirectUrl);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
