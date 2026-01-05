// 모든 페이지가 렌더링 되기 전에 로그인 상태를 한번 확인해서 로그인/로그아웃 했을 때 UI 보여줌

import type { AppProps } from "next/app";
import { useEffect } from "react";

import Header from "@/components/Header"; // 헤더 불러오기
import { useAuthStore } from "@/store/authStore";

import { Noto_Sans_KR } from "next/font/google"; // noto Sans KR 사용

// 폰트 설정 (두께, subset 등)
const notoSansKr = Noto_Sans_KR({
  // 배열로 두께 지정
  weight: ["100", "300", "400", "500", "700", "900"], 
  subsets: ["latin"], // preload 문제 방지를 위해 subsets 지정 (한글 사용할 때 문제 방지)
});

export default function App({ Component, pageProps }: AppProps) {
  const fetchMe = useAuthStore((s: { fetchMe: () => void }) => s.fetchMe);

  // 사이트 들어오면 /api/me 호출해서 로그인 상태 확인, authStore에 사용자 정보 저장
  // 쿠키가 브라우저에 남아있을 수 있지만 프론트 상태는 새로고침하면 초기화 되니까 매번 로그인 상태를 다시 복구
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <>
      <main className={notoSansKr.className}>
      
      <Header />
      <Component {...pageProps} />
      
    </main>
      
    </>
  );
}
