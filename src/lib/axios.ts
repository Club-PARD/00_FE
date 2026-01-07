// src/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  // baseURL 제거(상대경로) 또는 baseURL: ""
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default instance;