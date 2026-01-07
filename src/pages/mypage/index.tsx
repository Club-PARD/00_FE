import type { NextPage } from "next";
import { useMemo, useState } from "react";
import styles from "@/styles/Mypage.module.css";

import ProfileCard from "@/components/ProfileCard";
import MyPetitionTable from "@/components/MyPetitionTable";

type Row = {
  id: string;
  title: string;
  ddayLabel: string;
  ddayTone: "gray" | "red";
  period: string;
  status: string;
};


const MOCK: Row[] = [
  {
    id: "1",
    title: "자동차보험 표준약관 변경 철회해주세요",
    ddayLabel: "마감",
    ddayTone: "gray",
    period: "~2025.08.18",
    status: "종결",
  },
  {
    id: "2",
    title:
      "근로자가 불지예산자 일자리 연계 및 복수검증 신고조항개정도 개선을 통한 공정한 복지체계 구축 청원",
    ddayLabel: "D-6",
    ddayTone: "red",
    period: "~2025.01.17",
    status: "위원회 회부",
  },
];

// 한 페이지에 몇 개 보여줄지
const PAGE_SIZE = 10;

const MyPage: NextPage = () => {
  // (선택 부분) rows를 state로 바꿔야 삭제가 됨
  const [rows, setRows] = useState<Row[]>(MOCK);

  // 현재 페이지 저장
  const [currentPage, setCurrentPage] = useState(1);

  // 선택된 행 id들을 저장
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 총 페이지 수
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  // 현재 페이지 rows
  const currentPageRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, currentPage]);

  // 현재 페이지의 id들
  const currentPageIds = useMemo(
    () => currentPageRows.map((r) => r.id),
    [currentPageRows]
  );

  // 현재 페이지가 "전부 선택" 상태인지
  const isAllSelectedOnPage = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => selectedIds.includes(id));
  }, [currentPageIds, selectedIds]);

  // 전체 선택 (현재 페이지 기준)
  const selectAllOnPage = () => {
    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  // 선택 해제 (현재 페이지 기준)
  const unselectAllOnPage = () => {
    setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
  };

  // 선택 삭제
  const deleteSelected = () => {
    if (selectedIds.length === 0) return;

    const nextRows = rows.filter((r) => !selectedIds.includes(r.id));
    setRows(nextRows);
    setSelectedIds([]);

    const nextTotalPages = Math.max(1, Math.ceil(nextRows.length / PAGE_SIZE));
    setCurrentPage((p) => Math.min(p, nextTotalPages));
  };

  // 개별 토글
  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* 프로필 카드 영역 */}
        <section className={styles.profileSection}>
          <ProfileCard />
        </section>

        {/* 버튼 영역*/}
        <section className={styles.actionsSection}>
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={selectAllOnPage}
              disabled={currentPageIds.length === 0 || isAllSelectedOnPage}
            >
              전체 선택
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={unselectAllOnPage}
              disabled={currentPageIds.length === 0}
            >
              선택 해제
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
            >
              선택 삭제
            </button>
          </div>
        </section>

        <section className={styles.tableSection}>
          <MyPetitionTable
            rows={currentPageRows}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </main>
  );
};

export default MyPage;
