// src/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  // baseURL 제거(상대경로) 또는 baseURL: ""
  withCredentials: true, // 브라우저가 요청을 보낼 때 쿠키를 자동으로 포함
  headers: { "Content-Type": "application/json" },
});

export default instance;