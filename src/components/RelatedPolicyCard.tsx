import styles from "@/styles/RelatedPolicyCard.module.css";

type PolicyItem = {
  title: string;
  summary?: string;
};

type Props = {
  policies: PolicyItem[];
  error?: string | null;
};

export default function RelatedPolicyCard({ policies, error }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>관련 법안</h2>

      {error ? (
        <div className={styles.empty}>{error}</div>
      ) : policies.length === 0 ? (
        <div className={styles.empty}>관련 법안 정보가 없어요.</div>
      ) : (
        <div className={styles.list}>
          {policies.map((p, i) => (
            <div key={`${p.title}-${i}`} className={styles.item}>
              <div className={styles.title}>{p.title}</div>
              {p.summary && (
                <div className={styles.body}>{p.summary}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
