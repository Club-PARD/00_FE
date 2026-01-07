import { ReactNode } from "react";
import styles from "@/styles/PetitionOverview.module.css";

type PetitionOverviewProps = {
  title?: string;
  text: string;
  children?: ReactNode;
};

export default function PetitionOverview({ title = "개요", text, children }: PetitionOverviewProps) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {children}
    </section>
  );
}
