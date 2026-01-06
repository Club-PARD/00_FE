import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const clear = useAuthStore((s) => s.clear);

  const onLogout = async () => {
    await axios.post("/api/logout", null, { validateStatus: () => true });
    clear();
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
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

        <div className={styles.rights}>
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
