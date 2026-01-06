import styles from "@/styles/DetailHeroCard.module.css";

type MetaItem = {
  iconSrc: string;
  label: string;
  value: string;
  valueHighlight?: boolean;
};

type DetailHeroCardProps = {
  badge: string;
  title: string;

  meta: MetaItem[];

  agreeCount: number;
  percent: number;

  onClickGo?: () => void;
};

export default function DetailHeroCard({
  badge,
  title,
  meta,
  agreeCount,
  percent,
  onClickGo,
}: DetailHeroCardProps) {
  const value = Math.max(0, Math.min(100, percent));

  return (
    <section className={styles.card}>
      <div className={styles.inner}>
        <span className={styles.badge}>{badge}</span>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.divider} />

        <div className={styles.metaGrid}>
          {meta.map((m, idx) => (
            <div className={styles.metaItem} key={`${m.label}-${idx}`}>
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
                <img
                  src="/numberofpeople.svg"
                  alt="동의 인원"
                  className={styles.peopleIcon}
                />
                <span className={styles.peopleText}>
                  {agreeCount.toLocaleString()}명
                </span>
              </div>

              <span className={styles.percent}>{value}%</span>
            </div>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${value}%` }}
              />
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
