import axios from "axios";

const instance = axios.create({
  // .env.local에서 주소 가져오기
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// 디버깅용: 개발 중에만 baseURL 확인
console.log("API BASEURL:", process.env.NEXT_PUBLIC_API_URL);

export default instance;