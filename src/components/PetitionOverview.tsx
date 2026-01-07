import styles from "@/styles/PetitionOverview.module.css";

type Props = {
  text: string;
};

export default function PetitionOverview({ text }: Props) {
  if (!text) return null;

  const [title, ...rest] = text.split("\n");
  const body = rest.join("\n").trim();

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>개요</h2>

      <div className={styles.box}>
        <div className={styles.question}>{title}</div>
        {body && <div className={styles.body}>{body}</div>}
      </div>
    </section>
  );
}
