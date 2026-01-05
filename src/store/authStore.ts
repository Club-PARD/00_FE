// 현재 로그인한 유저 정보를 전역 상태로 들고있음 -> user, loading(/api/me 확인 중일 때 UI 깜빡임 방지용)

import { create } from "zustand";
import axios from "axios";

type User = {
  name: string;
  email: string;
  age: number;
  status: number;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  fetchMe: () => Promise<void>;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const r = await axios.get("/api/me", { validateStatus: () => true });
      const data = r.data;

      if (
        r.status === 200 &&
        data &&
        (typeof data.email === "string" || typeof data.name === "string")
      ) {
        set({ user: data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  clear: () => set({ user: null }),
}));
