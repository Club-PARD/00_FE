import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/axios";

interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;

  setToken: (token: string) => void;
  logout: () => void;
  checkLoginFromUrl: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      loading: true,

      setToken: (token: string) => {
        set({ token, isAuthenticated: true, loading: false });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false, user: null, loading: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
      },

      checkLoginFromUrl: () => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
          set({ token, isAuthenticated: true, loading: true });
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        void get().fetchMe();
      },

      fetchMe: async () => {
        const token = get().token;

        if (!token) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        try {
          const response = await api.get("/user/me", { validateStatus: () => true });

          if (response.status === 200 && response.data) {
            set({ user: response.data, isAuthenticated: true, loading: false });
          } else {
            get().logout();
          }
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined as any)),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
