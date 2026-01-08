import { create } from "zustand";
import { deleteScraps, getMyScraps, postScrap } from "@/lib/scrapApi";

type ScrapStore = {
  // 내 스크랩 전체
  scraps: { petId: number }[];
  loading: boolean;

  // 서버에서 한 번 불러오기
  sync: () => Promise<void>;

  // 특정 id가 스크랩인지
  isScrapped: (petId: number) => boolean;

  // 토글
  toggleScrap: (petId: number) => Promise<void>;

  // 강제 설정(필요하면)
  setScrap: (petId: number, next: boolean) => Promise<void>;
};

export const useScrapStore = create<ScrapStore>((set, get) => ({
  scraps: [],
  loading: false,

  isScrapped: (petId: number) => get().scraps.some((s) => s.petId === petId),

  sync: async () => {
    set({ loading: true });
    try {
      const list = await getMyScraps();
      set({ scraps: list ?? [] });
    } catch (e: any) {
      // 로그인 풀렸으면 빈 배열
      const status = e?.status ?? e?.response?.status;
      if (status === 401 || status === 402) set({ scraps: [] });
      else throw e;
    } finally {
      set({ loading: false });
    }
  },

  setScrap: async (petId: number, next: boolean) => {
    if (!petId) return;
    if (get().loading) return;

    set({ loading: true });
    try {
      if (next) await postScrap(petId);
      else await deleteScraps([petId]);

      // 성공 후 다시 동기화
      const list = await getMyScraps();
      set({ scraps: list ?? [] });
    } catch (e: any) {
      if (e?.status === 401) set({ scraps: [] });
      else throw e;
    } finally {
      set({ loading: false });
    }
  },

  toggleScrap: async (petId: number) => {
    const now = get().isScrapped(petId);
    await get().setScrap(petId, !now);
  },
}));
