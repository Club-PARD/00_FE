import { create } from "zustand";
import api from "@/lib/axios";

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
  logout: () => Promise<void>;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const r = await api.get("/user/me", { validateStatus: () => true });

      if (r.status === 200 && r.data) {
        set({ user: r.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/google/logout", {}, { validateStatus: () => true });
    } finally {
      set({ user: null });
    }
  },

  clear: () => set({ user: null }),
}));
