// src/components/DetailSideCard.tsx

import styles from "@/styles/DetailSideCard.module.css";

type Props = {
  period: string;
  committeeDate: string;
  result: string;
  aiSummary: string;
  agreeCount: number;
  percent: number;
  buttonText?: string;
  onClick?: () => void;
};

export default function DetailSideCard({
  period,
  committeeDate,
  result,
  aiSummary,
  agreeCount,
  percent,
  buttonText = "바로가기",
  onClick,
}: Props) {
  const numberFmt = new Intl.NumberFormat("ko-KR");

  return (
    <div className={styles.wrap}>
      <div className={styles.sideInfo}>
        <div className={styles.sideInfoRow}>
          <span className={styles.sideKey}>동의기간</span>
          <span className={styles.sideVal}>{period}</span>
        </div>
        <div className={styles.sideInfoRow}>
          <span className={styles.sideKey}>위원회회부일</span>
          <span className={styles.sideVal}>{committeeDate}</span>
        </div>
        <div className={styles.sideInfoRow}>
          <span className={styles.sideKey}>처리결과</span>
          <span className={styles.sideVal}>{result}</span>
        </div>
      </div>

      <div className={styles.aiBlock}>
        <div className={styles.aiTitle}>AI 요약</div>
        <div className={styles.aiBox}>{aiSummary}</div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressTop}>
          <div className={styles.countRow}>
            <span className={styles.personIcon}>👤</span>
            <span className={styles.countText}>{numberFmt.format(agreeCount)}명</span>
          </div>
          <span className={styles.percentText}>{percent}%</span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>

        <button className={styles.cta} type="button" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
