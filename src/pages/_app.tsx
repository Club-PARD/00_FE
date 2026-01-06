import type { AppProps } from "next/app";
import { useEffect } from "react";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/authStore";
import { Noto_Sans_KR } from "next/font/google";

import "../styles/globals.css";

const notoSansKr = Noto_Sans_KR({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <main className={notoSansKr.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  );
}
