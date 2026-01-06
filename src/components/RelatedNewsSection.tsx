import styles from "@/styles/RelatedNewsSection.module.css";

export type RelatedNewsItem = {
  title: string;
  url: string;
  source?: string;
  date?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  items: RelatedNewsItem[];
  error?: string | null;
};

export default function RelatedNewsSection({
  title = "관련 기사 보러가기!",
  subtitle = "(멘션예정)",
  items,
  error,
}: Props) {
  const has = items.length > 0;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.sub}>{subtitle}</div> : null}
      </div>

      {error ? (
        <div className={styles.empty}>{error}</div>
      ) : !has ? (
        <div className={styles.empty}>아직 연결된 관련 기사가 없어.</div>
      ) : (
        <ul className={styles.list}>
          {items.map((n, idx) => (
            <li key={`${n.url}-${idx}`} className={styles.item}>
              <a href={n.url} target="_blank" rel="noreferrer" className={styles.link}>
                {n.title}
              </a>

              {(n.source || n.date) && (
                <div className={styles.meta}>
                  {n.source ? n.source : ""}
                  {n.source && n.date ? " · " : ""}
                  {n.date ? n.date : ""}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
