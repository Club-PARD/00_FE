import styles from "@/styles/AISummaryCard.module.css";

type Props = {
  text: string;
};

export default function AISummaryCard({ text }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <img src="/Group (3).svg" alt="" className={styles.icon} />
        <span className={styles.title}>AI 요약</span>
      </div>

      <p className={styles.body}>{text}</p>
    </section>
  );
}
