// 모든 페이지가 렌더링 되기 전에 로그인 상태를 한번 확인해서 로그인/로그아웃 했을 때 UI 보여ㅕ줌

import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function App({ Component, pageProps }: AppProps) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  // 사이트 들어오면 /api/me 호출해서 로그인 상태 확인, authStore에 사용자 정보 저장
  // 쿠키가 브라우저에 남아있을 수 있지만 프론트 상태는 새로고침하면 초기화 되니까 매번 로그인 상태를 다시 복구
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <Component {...pageProps} />;
}
