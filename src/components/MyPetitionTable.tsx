import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/MyPetitionTable.module.css";
import Pagination from "@/components/Pagination";

type Row = {
  id: string;
  title: string;
  ddayLabel: string;
  ddayTone: "gray" | "red";
  period: string;
  status: string;
};

type Props = {
  rows: Row[]; // 현재 페이지에 보여줄 rows만
  selectedIds: string[];
  onToggleRow: (id: string) => void;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function MyPetitionTable({
  rows,
  selectedIds,
  onToggleRow,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <section className={styles.tableCard}>
      {/* 테이블 헤더 : 제목, 마감, 기간, 처리상태*/}
      <div className={styles.tableHeader}>
        <div className={styles.headRow}>
          <div className={styles.colCheck} />
          <div className={styles.colTitle}>
            <span className={styles.headTitle}>제목</span>
          </div>
          <div className={styles.colDday}>마감</div>
          <div className={styles.colPeriod}>기간</div>
          <div className={styles.colStatus}>처리 상태</div>
        </div>
      </div>

      {/* 리스트 */}
      <div className={styles.tableBody}>
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <div className={styles.colCheck}>
              <button
                type="button"
                className={styles.checkboxBtn}
                onClick={() => onToggleRow(row.id)}
                aria-label="선택"
              >
                <Image
                  src={
                    selectedIds.includes(row.id)
                      ? "/checked.svg"
                      : "/checkbox.svg"
                  }
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className={styles.colTitle}>
              <div className={styles.titleText}>{row.title}</div>
            </div>

            <div className={styles.colDday}>
              <span
                className={`${styles.badge} ${
                  row.ddayTone === "red" ? styles.badgeRed : styles.badgeGray
                }`}
              >
                {row.ddayLabel}
              </span>
            </div>

            <div className={styles.colPeriod}>{row.period}</div>
            <div className={styles.colStatus}>{row.status}</div>
          </div>
        ))}
      </div>
      {/* --- 페이지네이션 --- */}
      <div className={styles.paginationArea}>
        <Pagination
          currentPage={currentPage} // 현재 페이지
          totalPages={totalPages} // 전체 페이지
          onPageChange={onPageChange} // 페이지 변경
        />
      </div>
    </section>
  );
}
