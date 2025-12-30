import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Header.module.css";

type HeaderProps = {
  bannerHeight?: number;  // 배너 높이
}

export default function Header({bannerHeight = 544}: HeaderProps) {

  const [scrolled, setScrolled] = useState(false);

  // 컴포넌트가 처음 렌더링될 대 한 번 실행
  useEffect(() => {
    if (bannerHeight <= 0){
      setScrolled(true); // 배너 없는 경우 흰 헤더로 시작
      return;
    }

    const HEADER_HEIGHT = 69; // 헤더 세로 길이 (69px, Header.module.css)
    const threshold = Math.max(0, bannerHeight - HEADER_HEIGHT); // 배너 끝점

    const handleScroll = () => {
      setScrolled(window.scrollY >= threshold);
    };

    handleScroll(); // 새로고침 및 처음 렌더 시 상태 맞추기

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerHeight]);

  return (
    // 기본 header + 스크롤했을 때 배너 넘어갔는지 여부
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>

      <div className={styles.inner}>

        {/* !! 왼쪽: 로고 들어가는 부분 !! */}
        <div className={styles.left}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="로고 및 홈으로 이동"
          >
            {/*
          수아가 로고 image 만들어주면 교체
        <Image src="/logo.svg" alt="mora" width={68} height={27} priority /> */}
            mora
          </Link>
        </div>

        {/* !! 가운데: 메뉴 !! */}
        <nav className={styles.nav} aria-label="내비게이션바">
          <Link href="/category" className={styles.navItem}>
            카테고리
          </Link>
          <Link href="/petitions" className={styles.navItem}>
            청원 현황
          </Link>
        </nav>

        {/* !! 오른쪽: 검색창, 로그인 !! */}
        <div className={styles.rights}>
          <div className={styles.search}>
            <span className={styles.searchInner}>
              <Image
                src="/search_gray.svg"
                alt="돋보기"
                width={16}
                height={16}
              />

              <input
                className={styles.searchInput}
                type="text"
                placeholder="검색어를 입력하세요"
                aria-label="검색어 입력"
              />
            </span>
          </div>

          <Link href="/login" className={styles.loginBtn}>
            로그인
          </Link>

        </div>

      </div>
      
    </header>
  );
}
