// 상세페이지 대충 만든거임

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import styles from "@/styles/PetitionDetail.module.css";

type PetitionDetail = {
  title: string;
  type: number;
  petitionSummary: string;
  status: number;
  category: string;
  voteStartDate: string;
  voteEndDate: string;
  result: string;
  positiveEx: string;
  negativeEx: string;
  good: number;
  bad: number;
  allows: number;
};

type PetitionNews = { url: string };
type PetitionLaw = { title: string; summary: string };

function statusText(status: number) {
  if (status === 0) return "진행";
  if (status === 1) return "심사";
  return "종료";
}

function typeText(type: number) {
  if (type === 0) return "청원24";
  return "국민동의청원";
}

function fmtDate(s: string) {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function PetitionDetailPage() {
  const router = useRouter();

  const petitionId = useMemo(() => {
    const v = router.query.id;
    if (!v) return null;
    const raw = Array.isArray(v) ? v[0] : v;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [router.query.id]);

  const [detail, setDetail] = useState<PetitionDetail | null>(null);
  const [news, setNews] = useState<PetitionNews[]>([]);
  const [laws, setLaws] = useState<PetitionLaw[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (petitionId == null) return;

    let alive = true;
    setLoading(true);
    setErr(null);

    Promise.all([
      api.get(`/api/petition/${petitionId}`),
      api.get(`/api/petition/news/${petitionId}`),
      api.get(`/api/petition/laws/${petitionId}`),
    ])
      .then(([d, n, l]) => {
        if (!alive) return;
        setDetail(d.data);
        setNews(Array.isArray(n.data) ? n.data : []);
        setLaws(Array.isArray(l.data) ? l.data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.response?.data || e?.message || "Failed to load");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [petitionId]);

  if (petitionId == null) {
    return <div className={styles.page}><div className={styles.state}>잘못된 접근</div></div>;
  }
  if (loading) {
    return <div className={styles.page}><div className={styles.state}>로딩중...</div></div>;
  }
  if (err) {
    return <div className={styles.page}><div className={styles.state}>에러: {String(err)}</div></div>;
  }
  if (!detail) {
    return <div className={styles.page}><div className={styles.state}>데이터 없음</div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <main className={styles.main}>
            <div className={styles.head}>
              <h1 className={styles.title}>{detail.title}</h1>

              <div className={styles.metaRow}>
                <span className={styles.badge}>{typeText(detail.type)}</span>
                <span className={styles.dot} />
                <span className={styles.metaItem}>{statusText(detail.status)}</span>
                <span className={styles.dot} />
                <span className={styles.metaItem}>{detail.category}</span>
              </div>
            </div>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>개요</h2>
              </div>
              <p className={styles.paragraph}>{detail.petitionSummary || "-"}</p>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>본문</h2>
              </div>
              <p className={styles.paragraph}>{detail.result || "-"}</p>
            </section>

            <section className={styles.section}>
              <div className={styles.split}>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>장점</div>
                  <div className={styles.cardBody}>{detail.positiveEx || "-"}</div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>단점</div>
                  <div className={styles.cardBody}>{detail.negativeEx || "-"}</div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>관련 정책</h2>
              </div>

              <div className={styles.list}>
                {laws.length === 0 ? (
                  <div className={styles.empty}>관련 정책이 없어</div>
                ) : (
                  laws.map((x, i) => (
                    <div key={i} className={styles.listItem}>
                      <div className={styles.listTitle}>{x.title}</div>
                      <div className={styles.listBody}>{x.summary}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>정책 뉴스</h2>
              </div>

              <div className={styles.links}>
                {news.length === 0 ? (
                  <div className={styles.empty}>뉴스 링크가 없어</div>
                ) : (
                  news.map((x, i) => (
                    <a key={i} className={styles.link} href={x.url} target="_blank" rel="noreferrer">
                      {x.url}
                    </a>
                  ))
                )}
              </div>
            </section>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideTop}>
                <div className={styles.sideLabel}>상세 정보</div>
                <div className={styles.sideMeta}>
                  <div className={styles.sideMetaRow}>
                    <span className={styles.sideKey}>기간</span>
                    <span className={styles.sideVal}>
                      {fmtDate(detail.voteStartDate)} ~ {fmtDate(detail.voteEndDate)}
                    </span>
                  </div>
                  <div className={styles.sideMetaRow}>
                    <span className={styles.sideKey}>상태</span>
                    <span className={styles.sideVal}>{statusText(detail.status)}</span>
                  </div>
                  <div className={styles.sideMetaRow}>
                    <span className={styles.sideKey}>카테고리</span>
                    <span className={styles.sideVal}>{detail.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideLabel}>AI 요약</div>
              <div className={styles.aiBox}>
                {detail.petitionSummary || "-"}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideLabel}>동의 현황</div>

              <div className={styles.agreeRow}>
                <div className={styles.agreeNumber}>{detail.allows.toLocaleString()}</div>
                <div className={styles.agreeLabel}>동의</div>
              </div>

              <div className={styles.likeRow}>
                <div className={styles.likeItem}>
                  <span className={styles.likeKey}>좋아요</span>
                  <span className={styles.likeVal}>{detail.good.toLocaleString()}</span>
                </div>
                <div className={styles.likeItem}>
                  <span className={styles.likeKey}>싫어요</span>
                  <span className={styles.likeVal}>{detail.bad.toLocaleString()}</span>
                </div>
              </div>

              <button
                className={styles.primaryBtn}
                onClick={() => {
                  const first = news?.[0]?.url;
                  if (first) window.open(first, "_blank", "noopener,noreferrer");
                }}
              >
                바로가기
              </button>

              <div className={styles.btnRow}>
                <button
                  className={styles.ghostBtn}
                  onClick={async () => {
                    await api.post("/api/petition/likes", { id: petitionId, likes: 1 });
                    const d = await api.get(`/api/petition/${petitionId}`);
                    setDetail(d.data);
                  }}
                >
                  좋아요
                </button>
                <button
                  className={styles.ghostBtn}
                  onClick={async () => {
                    await api.post("/api/petition/likes", { id: petitionId, likes: -1 });
                    const d = await api.get(`/api/petition/${petitionId}`);
                    setDetail(d.data);
                  }}
                >
                  싫어요
                </button>
              </div>
            </div>

            <button className={styles.backBtn} onClick={() => router.back()}>
              뒤로가기
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
