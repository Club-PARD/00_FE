// mora/src/pages/index.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PetitionCard, { PetitionCardItem } from "@/components/PetitionCard";

import styles from "@/styles/Home.module.css";
import { getPetitions, PetitionResponse } from "@/lib/api/mainCard";

export default function Home() {
  const [assemblyList, setAssemblyList] = useState<PetitionCardItem[]>([]);
  const [dailyList, setDailyList] = useState<PetitionCardItem[]>([]);

  const formatData = (list: PetitionResponse[]): PetitionCardItem[] => {
    if (!Array.isArray(list)) return [];

    return list.map((item) => ({
      id: String(item.id),
      title: item.title,
      category: item.category ?? "",
      allows: item.allows ?? 0,
      startDate: (item.voteStartDate ?? "").split("T")[0],
      endDate: (item.voteEndDate ?? "").split("T")[0],
      status: item.status as 0 | 1 | 2,
    }));
  };

  const fetchData = async () => {
    try {
      const [assemblyData, dailyData] = await Promise.all([
        getPetitions({ type: 1, how: 1, limit: 4 }),
        getPetitions({ type: 0, how: 1, limit: 4 }),
      ]);

      const formattedAssembly = formatData(assemblyData).sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      const formattedDaily = formatData(dailyData).sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setAssemblyList(formattedAssembly);
      setDailyList(formattedDaily);
    } catch (error) {
      console.error("[Home] fetchData error", error);
      setAssemblyList([]);
      setDailyList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className={styles.page}>
        <Banner />

        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최신 국회 안건</h2>

              <Link href="/congress" className={styles.moreLink}>
                더보기
                <div className={styles.iconBox}>
                  <Image
                    src="/right_arrow_gray.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconGray}
                  />
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
              {assemblyList.length === 0 && <p>등록된 청원이 없습니다.</p>}
              {assemblyList.map((item) => (
                <PetitionCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최신 생활 안건</h2>

              <Link href="/life" className={styles.moreLink}>
                더보기
                <div className={styles.iconBox}>
                  <Image
                    src="/right_arrow_gray.svg"
                    alt="이동"
                    width={16}
                    height={16}
                    className={styles.iconGray}
                  />
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
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
