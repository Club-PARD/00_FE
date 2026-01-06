import Image from "next/image";
import styles from "@/styles/Pagination.module.css";

type Props = {
  currentPage: number; // 현재 페이지
  totalPages: number; // 전체 페이지
  onPageChange: (page: number) => void; // 페이지 변경 함수
};


// 페이지 번호 목록 만들기
function getPageList(total: number) {
  // 페이지가 5 이하이면 모두 보여줌 (1~total)
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  // 6 이상이면 "1 2 3 4 … total" 형태로 표시
  return [1, 2, 3, 4, "ellipsis" as const, total];
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  // 페이지 목록 생성
  const pages = getPageList(totalPages);

  // 이전/다음 페이지로 이동
  const goPrev = () => onPageChange(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className={styles.root}>
      {/* 이전 버튼 */}
      <button
        type="button"
        className={styles.arrowBtn}
        onClick={goPrev}
        disabled={currentPage === 1} // 1페이지면 비활성화
        aria-label="이전 페이지"
      >
        <Image src="/sign_left.svg" alt="" width={20} height={20} />
      </button>

      {/* 페이지 번호 영역 */}
      <div className={styles.pages}>
        {pages.map((p, idx) => {
          // ... 표시
          if (p === "ellipsis") {
            return (
              <span key={`e-${idx}`} className={styles.ellipsis}>
                …
              </span>
            );
          }

          // 페이지 번호 버튼
          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={`${styles.pageBtn} ${isActive ? styles.active : ""}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        className={styles.arrowBtn}
        onClick={goNext}
        disabled={currentPage === totalPages} // 마지막 페이지면 비활성화
        aria-label="다음 페이지"
      >
        <Image src="/sign_right.svg" alt="" width={20} height={20} />
      </button>
    </div>
  );
}