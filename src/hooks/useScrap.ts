// src/hooks/useScrap.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteScraps, getMyScraps, postScrap, ScrapItem } from "@/lib/scrapApi";

type UseScrapOptions = {
  petitionId: number;
  onRequireLogin?: () => void; // 401일 때 실행 (예: 로그인 모달/페이지 이동)
};

export function useScrap({ petitionId, onRequireLogin }: UseScrapOptions) {
  const [scraps, setScraps] = useState<ScrapItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const isScrapped = useMemo(() => {
    if (!scraps) return false;
    return scraps.some((s) => s.petId === petitionId);
  }, [scraps, petitionId]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMyScraps();
      setScraps(list);
    } catch (e: any) {
      // 로그인 안 한 경우(401)에는 목록을 굳이 에러로 터뜨리기보다는 "미스크랩" 취급
      if (e?.status === 401) {
        setScraps([]);
      } else {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    // 낙관적 업데이트(UX 개선)도 가능하 지만, 우선은 안전하게 서버 성공 후 반영
    setLoading(true);
    try {
      if (isScrapped) {
        await deleteScraps([petitionId]);
      } else {
        await postScrap(petitionId);
      }
      await refresh();
    } catch (e: any) {
      if (e?.status === 401) {
        onRequireLogin?.();
        return;
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, [isScrapped, petitionId, refresh, onRequireLogin]);

  return { scraps, isScrapped, loading, refresh, toggle };
}
