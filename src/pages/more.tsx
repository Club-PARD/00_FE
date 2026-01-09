import type { NextPage } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/More.module.css";

import Image from "next/image";

const MorePage: NextPage = () => {
  return (
    <>
      <Header />

      {/* 이미지 영역 */}
      <div className={styles.imageSection}>
        <Image
          src="/long_image.png"
          alt="상세 이미지"
          width={1440}
          height={3000} // 예시: 긴 이미지
          priority
        />
      </div>

      <Footer />
    </>
  );
};

export default MorePage;
