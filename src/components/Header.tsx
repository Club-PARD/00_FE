import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/styles/Header.module.css";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 왼쪽: 로고 */}
        <div className={styles.left}>
          <Link href="/" aria-label="로고 및 홈으로 이동">
            <Image
              src="/logo.svg"
              alt="mora logo"
              width={137}
              height={37}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* 가운데: 메뉴 */}
        <nav className={styles.nav} aria-label="내비게이션바">
          <Link
            href="/congress"
            className={`${styles.navItem} ${pathname === "/congress" ? styles.active : ""}`}
          >
            국회안건
          </Link>
          <Link
            href="/life"
            className={`${styles.navItem} ${pathname === "/life" ? styles.active : ""}`}
          >
            생활안건
          </Link>
          <Link
            href="/more"
            className={`${styles.navItem} ${pathname === "/more" ? styles.active : ""}`}
          >
            몰아보기
          </Link>
        </nav>

        {/* 오른쪽: 로그인 / 프로필 */}
        <div className={styles.rights}>
          {loading ? null : user ? (
            /* 로그인 상태 → 프로필 아이콘 */
            <Link href="/mypage" className={styles.profileBtn}>
              <Image
                src="/profile.svg"
                alt="프로필"
                width={32}
                height={32}
              />
            </Link>
          ) : (
            /* 비로그인 상태 → 로그인 버튼 */
            <Link href="/login" className={styles.loginBtn}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
