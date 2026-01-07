import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 사용자 정보 타입
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

  // Actions
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
        set({
          token: null,
          isAuthenticated: false,
          user: null,
          loading: false,
        });
        localStorage.removeItem('auth-storage');
      },

      checkLoginFromUrl: () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          set({ token, isAuthenticated: true });
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          get().fetchMe();
        } else {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        const { token } = get();

        if (!token) {
          set({ loading: false });
          return;
        }

        try {
          const response = await axios.get(
            `${API_BASE_URL}/user/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          set({
            user: response.data,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
