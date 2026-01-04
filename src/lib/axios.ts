// withCredentials: true 설정이 기본으로 포함된 axios 인스턴스 생성

import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  withCredentials: true, // 브라우저가 가진 쿠키를 요청에 포함, 서버가 내려준 Set-Cookie도 정상 저장
});

export default instance;
