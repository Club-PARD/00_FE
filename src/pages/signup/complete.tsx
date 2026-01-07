import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/SignupComplete.module.css";

import Header from "@/components/Header";

const SignupCompletePage: NextPage = () => {
  const router = useRouter();

  // 페이지 이동
  const goToTest = () => {
    router.push("/mypage/test");
  };

  return (
    <div className={styles.page}>
      {/* 상단 헤더 */}
      <Header />

      {/* 본문: 화면 가운데 정렬 */}
      <main className={styles.centerArea}>
        <section className={styles.content}>
          {/* 완료 아이콘 */}
          <Image
            src="/complete.svg"
            alt="회원가입 완료"
            width={65}
            height={65}
            className={styles.icon}
            priority
          />

          <div className={styles.spaceIconTitle} />

          {/* 타이틀 */}
          <h1 className={styles.title}>모라에 온 것을 환영해요!</h1>

          <div className={styles.spaceTitleSub} />

          {/* 서브타이틀 */}
          <p className={styles.subtitle}>
            이제 정책을 바라보는 당신만의 관점을 알아볼 차례예요.
          </p>

          <div className={styles.spaceSubDesc} />

          {/* 안내 문구 */}
          <p className={styles.desc}>
            지금의 생각을 부담 없이 골라주세요.
            <br />
            검사는 언제든 다시 할 수 있어요.
          </p>

          <div className={styles.spaceDescCta} />

          {/* CTA 버튼 */}
          <button type="button" className={styles.ctaBtn} onClick={goToTest}>
            <span className={styles.ctaText}>내 관점 알아보기</span>
            <Image src="/right_arrow_white.svg" alt="" width={16} height={16} />
          </button>
        </section>
      </main>
    </div>
  );
};

export default SignupCompletePage;
