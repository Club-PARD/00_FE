import Header from "@/components/Header";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  const BANNER_HEIGHT = 544; // !! 배너 높이 544 (임시) !!

  return (
    <>
      <Header bannerHeight={BANNER_HEIGHT} />

      {/* 배너 부분 */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <button className={styles.cta}>
            <span>진행 중인 청원</span>
            <Image
              src="/right_arrow_white.svg"
              alt="화살표"
              width={20}
              height={20}
            />
          </button>
        </div>
      </section>

      {/* 본문 */}
      <main className={styles.main}>
        <p>나중에 main 컨텐츠 넣을 곳</p>
      </main>
    </>
  );
}
