import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/ProfileCard.module.css";

import EditModal from "@/components/EditModal";
import { useAuthStore } from "@/store/authStore";

export default function ProfileCard() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const nickname = user?.name ?? "사용자";
  const email = user?.email ?? "";

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuWrapRef.current) return;
      if (!menuWrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.avatar} />

        <div className={styles.content}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{nickname}</span>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="프로필 수정"
              onClick={() => setIsEditOpen(true)}
            />
          </div>

          <div className={styles.metaRow}>
            <span className={styles.metaText}>실용중심형</span>

            <Link href="/mypage/test" className={styles.retryLink}>
              유형 검사 다시하기
              <Image
                src="/sign_right_gray.svg"
                alt=""
                width={16}
                height={16}
                className={styles.chevIcon}
              />
            </Link>
          </div>

          <div className={styles.email}>{email}</div>
        </div>

        <div className={styles.actions} ref={menuWrapRef}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="더보기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Image src="/option_btn.svg" alt="" width={20} height={20} />
          </button>

          {menuOpen && (
            <div className={styles.menu}>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  setIsEditOpen(true);
                  setMenuOpen(false);
                }}
              >
                <Image src="/pencil.svg" alt="" width={16} height={16} />
                <span>수정하기</span>
              </button>

              <button type="button" className={styles.menuItem} onClick={onLogout}>
                <Image src="/logout.svg" alt="" width={16} height={16} />
                <span>로그아웃</span>
              </button>

              <div className={styles.divider} />

              <button
                type="button"
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <Image src="/secession.svg" alt="" width={16} height={16} />
                <span>회원탈퇴</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <EditModal
        isOpen={isEditOpen}
        initialNickname={nickname}
        onClose={() => setIsEditOpen(false)}
        onSave={() => {
          setIsEditOpen(false);
        }}
      />
    </>
  );
}
