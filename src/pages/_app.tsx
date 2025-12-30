import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Header from "@/components/Header"; // 헤더 불러오기

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header /> {/* 페이지 내용(Component) 위에 헤더를 배치함 */}
      <Component {...pageProps} />
      
    </>
  );
}
