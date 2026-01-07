import ProsCard from "@/components/ProsCard";
import ConsCard from "@/components/ConsCard";
import styles from "@/styles/ProsConsSection.module.css";

type Item = {
  title: string;
  desc: string;
};

type Props = {
  pros: Item[];
  cons: Item[];
  prosTags?: string[];
  consTags?: string[];
};

export default function ProsConsSection({ pros, cons, prosTags = [], consTags = [] }: Props) {
  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        <ProsCard items={pros} tags={prosTags} />
        <ConsCard items={cons} tags={consTags} />
      </div>
    </section>
  );
}
