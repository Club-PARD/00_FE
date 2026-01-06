import { useMemo } from "react";
import styles from "@/styles/DetailHeroCard.module.css";

type MetaItem = {
  iconSrc: string;
  label: string;
  value: string;
  valueHighlight?: boolean;
};

type DetailHeroCardProps = {
  badge: string; // 청원분야 텍스트(예: "문화 · 체육 · 관광 · 언론")
  title: string;

  meta: MetaItem[];

  agreeCount: number;
  percent: number;

  statusPill?: string; // "마감"
  onClickBookmark?: () => void;
  onClickGo?: () => void;
};

const DEFAULT_ICON: Record<string, string> = {
  동의기간: "/proicons_calendar.svg",
  소관위원회: "/Group (2).svg",
  상태: "/Group (1).svg",
  청원분야: "/proicons_attach.svg",
  위원회회부일: "/proicons_send.svg",
  처리결과: "/proicons_script.svg",
};

export default function DetailHeroCard({
  badge,
  title,
  meta,
  agreeCount,
  percent,
  statusPill = "마감",
  onClickBookmark,
  onClickGo,
}: DetailHeroCardProps) {
  const value = Math.max(0, Math.min(100, percent));

  const metaMap = useMemo(() => {
    const m = new Map<string, MetaItem>();
    meta.forEach((it) => m.set(it.label, it));
    return m;
  }, [meta]);

  const orderedMeta = useMemo(() => {
    const order = [
      "동의기간",
      "소관위원회",
      "상태",
      "청원분야",
      "위원회회부일",
      "처리결과",
    ];

    return order.map((label) => {
      const found = metaMap.get(label);

      if (label === "청원분야") {
        return {
          iconSrc: found?.iconSrc ?? DEFAULT_ICON[label],
          label,
          value: (found?.value && found.value.trim()) ? found.value : badge || "-",
          valueHighlight: found?.valueHighlight ?? false,
        };
      }

      if (label === "동의기간") {
        return {
          iconSrc: found?.iconSrc ?? DEFAULT_ICON[label],
          label,
          value: (found?.value && found.value.trim()) ? found.value : "-",
          valueHighlight: found?.valueHighlight ?? true,
        };
      }

      if (label === "처리결과") {
        return {
          iconSrc: found?.iconSrc ?? DEFAULT_ICON[label],
          label,
          value: (found?.value && found.value.trim()) ? found.value : "-",
          valueHighlight: found?.valueHighlight ?? true,
        };
      }

      return {
        iconSrc: found?.iconSrc ?? DEFAULT_ICON[label],
        label,
        value: (found?.value && found.value.trim()) ? found.value : "-",
        valueHighlight: found?.valueHighlight ?? false,
      };
    });
  }, [metaMap, badge]);

  return (
    <section className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          {statusPill ? <span className={styles.statusPill}>{statusPill}</span> : <span />}

          <button
            type="button"
            className={styles.bookmarkBtn}
            onClick={onClickBookmark}
            aria-label="북마크"
          >
            <img src="/bookmark.svg" alt="" className={styles.bookmarkIcon} />
          </button>
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.divider} />

        <div className={styles.metaGrid}>
          {orderedMeta.map((m) => (
            <div className={styles.metaItem} key={m.label}>
              <div className={styles.metaIconBox}>
                <img src={m.iconSrc} alt="" className={styles.metaIcon} />
              </div>

              <div className={styles.metaText}>
                <div className={styles.metaLabel}>{m.label}</div>
                <div
                  className={`${styles.metaValue} ${
                    m.valueHighlight ? styles.metaValueHighlight : ""
                  }`}
                >
                  {m.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.statsRow}>
              <div className={styles.people}>
                <img src="/numberofpeople.svg" alt="" className={styles.peopleIcon} />
                <span className={styles.peopleText}>{agreeCount.toLocaleString()}명</span>
              </div>

              <span className={styles.percent}>{value}%</span>
            </div>

            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${value}%` }} />
            </div>
          </div>

          <button className={styles.cta} onClick={onClickGo}>
            바로가기
          </button>
        </div>
      </div>
    </section>
  );
}
