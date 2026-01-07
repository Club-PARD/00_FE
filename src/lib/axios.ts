import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const localApi = axios.create({

});

localApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {}; 
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default localApi;
