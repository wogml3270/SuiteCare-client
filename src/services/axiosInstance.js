import axios from 'axios';

const localServer = 'http://localhost:3000'; // 로컬 서버
const productServer = ''; // 실제 백엔드 서버

const axiosInstance = axios.create({
  baseURL: localServer,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // axios api를 요청했을 때, interceptor를 통해서 요청하기 전 로직을 구현하는 곳입니다.
    // jwt로 발급한 token을 가져오는 로직을 여기에 구현하면 됩니다.
    // 참고 자료: https://velog.io/@xmun74/axios-interceptors-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

    // console.log('Starting Request', config);
    return config;
  },
  (error) => {
    // 요청 상태 코드 200이 아닌 경우
    console.error('Request Error, 요청 에러', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 로직
    // console.log('Response:', response);
    return response;
  },
  (error) => {
    // 응답 상태 코드 200이 아닌 경우
    console.error('Response Error, 응답 에러', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
