import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

type HeaderProps = {
  bannerHeight?: number;
};

export default function Header({ bannerHeight = 544 }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (bannerHeight <= 0) {
      setScrolled(true);
      return;
    }

    const HEADER_HEIGHT = 69;
    const threshold = Math.max(0, bannerHeight - HEADER_HEIGHT);

    const handleScroll = () => {
      setScrolled(window.scrollY >= threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerHeight]);

  const onLogout = async () => {
    await axios.post("/api/logout", null, { validateStatus: () => true });
    clear();
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            mora
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/category" className={styles.navItem}>
            카테고리
          </Link>
          <Link href="/petitions" className={styles.navItem}>
            청원 현황
          </Link>
        </nav>

        <div className={styles.rights}>
          <div className={styles.search}>
            <span className={styles.searchInner}>
              <Image src="/search_gray.svg" alt="돋보기" width={16} height={16} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="검색어를 입력하세요"
              />
            </span>
          </div>

          {loading ? null : user ? (
            <button onClick={onLogout} className={styles.loginBtn}>
              로그아웃
            </button>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
