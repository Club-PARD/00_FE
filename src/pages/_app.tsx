import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function App({ Component, pageProps }: AppProps) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <Component {...pageProps} />;
}

