import styles from "@/styles/ProsConsSection.module.css";

type Props = {
  positiveText?: string;
  negativeText?: string;
};

export default function ProsConsSection({ positiveText, negativeText }: Props) {
  const pos = (positiveText ?? "").trim();
  const neg = (negativeText ?? "").trim();

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <div className={styles.head}>
            <span className={`${styles.pill} ${styles.pillPos}`}>긍정적</span>
            <div className={`${styles.line} ${styles.linePos}`} />
          </div>

          <p className={styles.body}>{pos || "긍정(장점) 정보가 아직 없어요."}</p>
        </div>

        <div className={styles.col}>
          <div className={styles.head}>
            <span className={`${styles.pill} ${styles.pillNeg}`}>부정적</span>
            <div className={`${styles.line} ${styles.lineNeg}`} />
          </div>

          <p className={styles.body}>{neg || "부정(단점) 정보가 아직 없어요."}</p>
        </div>
      </div>
    </section>
  );
}
