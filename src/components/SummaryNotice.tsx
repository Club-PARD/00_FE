import styles from "@/styles/SummaryNotice.module.css";

export default function SummaryNotice() {
  return (
    <section className={styles.wrap}>
      <div className={styles.divider} />
      <p className={styles.text}>
        위 요약은 청원인의 주장을 바탕으로 정책적 쟁점을 정제한 내용입니다.
        <br />
        모라는 사용자가 스스로 정보를 판단하고 목소리를 낼 수 있도록 돕습니다.
        <br />
        요약된 내용만으로 결정하기보다, 원문 링크를 통해 청원인이 제시한 구체적인 근거와 논리를 직접 확인해 보시기 바랍니다.
      </p>
    </section>
  );
}