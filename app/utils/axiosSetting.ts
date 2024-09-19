import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`, // API의 기본 URL 설정
});

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    console.log(response);
    if (response) {
      console.log(response.request.responseURL);
      // window.location.href = response.request.responseURL;
    }
    return response;
  },
  (error) => {
    // 에러 응답 처리
    return Promise.reject(error);
  },
);

export default apiClient;
