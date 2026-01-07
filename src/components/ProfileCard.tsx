import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/ProfileCard.module.css";

import EditModal from "@/components/EditModal";

export default function ProfileCard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);

  // 회원 정보 수정 모달창 용
  const [nickname, setNickname] = useState("홍길동");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 바깥 클릭하면 메뉴 닫기
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

  return (
    <>
      {/* 카드 전체 박스 */}
      <section className={styles.card}>
        {/* 프로필 이미지 */}
        <div className={styles.avatar} />

        {/* 오른쪽 텍스트 영역 전체*/}
        <div className={styles.content}>
          {/* 상단: 왼쪽(이름) */}
          <div className={styles.nameRow}>
            <span className={styles.name}>{nickname}</span>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="프로필 수정"
            ></button>
          </div>

          {/* 중간: 성향 | 다시하기 링크 */}
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

          {/* 하단: 이메일 */}
          <div className={styles.email}>abcdefg@email.com</div>
        </div>

        {/* 오른쪽: 옵션 버튼 + 토글 */}
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
              {/* 수정하기 */}
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

              {/* 로그아웃 */}
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  // TODO: 로그아웃 로직
                  setMenuOpen(false);
                }}
              >
                <Image src="/logout.svg" alt="" width={16} height={16} />
                <span>로그아웃</span>
              </button>

              <div className={styles.divider} />

              {/* 회원탈퇴 */}
              <button
                type="button"
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => {
                  // TODO: 회원탈퇴 로직
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

      {/* 모달창 */}
      <EditModal
        isOpen={isEditOpen}
        initialNickname={nickname}
        onClose={() => setIsEditOpen(false)}
        onSave={(next) => {
          setNickname(next);
          setIsEditOpen(false);
        }}
      />
    </>
  );
}
