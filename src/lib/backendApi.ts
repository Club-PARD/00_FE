import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // or NEXT_PUBLIC_SERVER_BASE_URL 중 하나로 통일
});

backendApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default backendApi;
