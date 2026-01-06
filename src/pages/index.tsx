import { useState, useEffect } from "react";
import Header from "@/components/Header";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

import PetitionCard, { PetitionCardItem } from "@/components/PetitionCard";
import Banner from "@/components/Banner";

import { getPetitions, PetitionResponse } from "@/lib/api/mainCard";

export default function Home() {
  // 데이터를 담을 State
  const [assemblyList, setAssemblyList] = useState<PetitionCardItem[]>([]);
  const [dailyList, setDailyList] = useState<PetitionCardItem[]>([]);

  // 데이터를 불러오기 함수
  const fetchData = async () => {
    console.log("[Home] fetchData start");
    try {
      // 최신 국회 안건 요청 type=1, how=1
      const assemblyData = await getPetitions({
        type: 1,
        how: 1,
        limit: 4,
      });
      console.log("[Home] assemblyData", assemblyData);

      // 최신 생활 안건 요청(청원24) type=0, how=1
      const dailyData = await getPetitions({
        type: 0,
        how: 1,
        limit: 4,
      });
      console.log("[Home] dailyData", dailyData);

      // 데이터 변환 (서버 -> 프론트 카드)
      const formatData = (list: PetitionResponse[]): PetitionCardItem[] => {
        // 리스트 없거나, 에러나서 null이면 빈 배열 반환
        if (!list || !Array.isArray(list)) return [];

        return list.map((item) => ({
          id: String(item.id),
          title: item.title,
          category:
            typeof item.category === "string"
              ? item.category
              : Array.isArray(item.category)
              ? item.category.join("/")
              : "",
          allows: item.allows,

          startDate: (item.voteStartDate ?? "").split("T")[0],
          endDate: (item.voteEndDate ?? "").split("T")[0],

          status: item.status as 0 | 1 | 2,
        }));
      };

      // 데이터 포맷팅
      const formattedAssembly = formatData(assemblyData);
      const formattedDaily = formatData(dailyData);

      // 국민 동의 청원 sort
      formattedAssembly.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // 청원 24 sort
      formattedDaily.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // State 업데이트
      setAssemblyList(formattedAssembly);
      setDailyList(formattedDaily);
    } catch (error) {
      console.error("[Home] fetchData error", error);
    }
  };

  // 화면 켜질 때 실행 되도록
  useEffect(() => {
    console.log("[Home] mounted");
    fetchData();
  }, []);

  return (
    <>

      <div className={styles.page}>
        {/* 배너 부분 */}
        <Banner />

        {/* 본문 */}
        <main className={styles.main}>
          {/* ----- 최신 국회 안건 ----- */}
          <section className={styles.section}>
            {/* 제목 + 더보기 버튼 */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최신 국회 안건</h2>

              {/* 더보기 -> 국회 안건 리스트로 이동 */}
              <Link href="/congress" className={styles.moreLink}>
                더보기
                <div className={styles.iconBox}>
                  {/* 평소에 보일 회색 화살표 (회색) */}
                  <Image
                    src="/right_arrow_gray.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconGray}
                  />

                  {/* 2. 마우스 올렸을 때 보일 검은색 화살표 */}
                  <Image
                    src="/right_arrow_black.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconBlack}
                  />
                </div>
              </Link>
            </div>

            {/* 카드 리스트 (4개 배치) */}
            <div className={styles.cardGrid}>
              {/* 데이터가 없을 때 처리 */}
              {/* 실제 데이터 매핑 */}
              {assemblyList.length === 0 && <p>등록된 청원이 없습니다.</p>}
              {assemblyList.map((item) => (
                <PetitionCard key={item.id} item={item} />
              ))}
              {/* {(assemblyList.length === 0 ? DUMMY_ASSEMBLY : assemblyList).map(
                (item) => (
                  <PetitionCard key={item.id} item={item} />
                )
              )} */}
            </div>
          </section>

          {/* ----- 최신 생활 안건 ----- */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최신 생활 안건</h2>

              {/* 더보기 -> 청원24 리스트로 이동 */}
              <Link href="/life" className={styles.moreLink}>
                더보기
                <div className={styles.iconBox}>
                  {/* 평소에 보일 회색 화살표 (회색) */}
                  <Image
                    src="/right_arrow_gray.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconGray}
                  />

                  {/* 2. 마우스 올렸을 때 보일 검은색 화살표 */}
                  <Image
                    src="/right_arrow_black.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconBlack}
                  />
                </div>
              </Link>
            </div>

            <div className={styles.cardGrid}>
              {dailyList.length === 0 && <p>등록된 청원이 없습니다.</p>}
              {dailyList.map((item) => (
                <PetitionCard key={item.id} item={item} forceCategoryGray />
              ))}
              {/* {(dailyList.length === 0 ? DUMMY_DAILY : dailyList).map(
                (item) => (
                  <PetitionCard key={item.id} item={item} forceCategoryGray />
                )
              )} */}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
