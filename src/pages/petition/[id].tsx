import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import RelatedNewsSection from "@/components/RelatedNewsSection";
import ProsConsSection from "@/components/ProsConsSection";
import DetailHeroCard from "@/components/DetailHeroCard";
import Header from "@/components/Header";
import AISummaryCard from "@/components/AISummaryCard";
import DetailMiniCard from "@/components/DetailMiniCard";
import PetitionOverview from "@/components/PetitionOverview";
import SummaryNotice from "@/components/SummaryNotice";
import LikeDislikeBar from "@/components/LikeDislikeBar";

import styles from "@/styles/PetitionDetail.module.css";

type PetitionDetailResponse = {
  title?: string;
  category?: string;
  type?: number;
  status?: number;

  voteStartDate?: string;
  voteEndDate?: string;

  committee?: string;
  committeeDate?: string;

  result?: string;

  petitionNeeds?: string; 
  petitionSummary?: string;
  content?: string;

  positiveEx?: string;
  negativeEx?: string;

  good?: number;
  bad?: number;
  allows?: number;

  url?: string;
  petitionUrl?: string;
};


type NewsItem = {
  title: string;
  url: string;
  source?: string;
  date?: string;
};

type LawItem = {
  title: string;
  summary: string;
};

function formatDotDate(iso?: string) {
  if (!iso) return "-";
  return iso.slice(0, 10).replaceAll("-", ".");
}

function statusLabel(status?: number) {
  const map: Record<number, string> = { 0: "진행중", 1: "종료", 2: "처리완료" };
  if (typeof status !== "number") return "-";
  return map[status] ?? String(status);
}

function safeString(v: unknown, fallback = "-") {
  if (typeof v === "string" && v.trim()) return v;
  return fallback;
}

function safeNumber(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function computePercent(allows?: number) {
  const n = safeNumber(allows, 0);
  const target = 50000;
  const p = Math.floor((n / target) * 100);
  return Math.max(0, Math.min(100, p));
}

function normalizeNews(data: any): NewsItem[] {
  const arr = Array.isArray(data) ? data : [];
  return arr
    .map((it: any, idx: number) => {
      const url = safeString(it?.url, "");
      if (!url) return null;
      return {
        title: safeString(it?.title, `관련 기사 ${idx + 1}`),
        url,
        source: it?.source,
        date: it?.date,
      };
    })
    .filter(Boolean) as NewsItem[];
}

function normalizeLaws(data: any): LawItem[] {
  const arr = Array.isArray(data) ? data : [];
  return arr
    .map((it: any) => {
      const title = safeString(it?.title, "");
      if (!title) return null;
      return {
        title,
        summary: safeString(it?.summary, ""),
      };
    })
    .filter(Boolean) as LawItem[];
}

export default function PetitionDetailPage() {
  const router = useRouter();

  const petitionId = useMemo(() => {
    const v = router.query.id;
    const n = typeof v === "string" ? Number(v) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [router.query.id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<PetitionDetailResponse | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [laws, setLaws] = useState<LawItem[]>([]);
  const [lawsError, setLawsError] = useState<string | null>(null);

  const [goodLocal, setGoodLocal] = useState(0);
  const [badLocal, setBadLocal] = useState(0);

  useEffect(() => {
    if (!petitionId) return;

    let alive = true;
    setLoading(true);
    setError(null);
    setNews([]);
    setNewsError(null);
    setLaws([]);
    setLawsError(null);

    Promise.all([
      fetch(`/api/petition/${petitionId}`, { credentials: "include" }).then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d?.message || "상세 조회 실패");
        return d as PetitionDetailResponse;
      }),
      fetch(`/api/petition/news/${petitionId}`, { credentials: "include" }).then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error("뉴스 조회 실패");
        return d;
      }),
      fetch(`/api/petition/laws/${petitionId}`, { credentials: "include" }).then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error("정책 조회 실패");
        return d;
      }),
    ])
      .then(([detailData, newsData, lawsData]) => {
        if (!alive) return;
        setDetail(detailData);
        setNews(normalizeNews(newsData));
        setLaws(normalizeLaws(lawsData));
        setGoodLocal(safeNumber(detailData.good, 0));
        setBadLocal(safeNumber(detailData.bad, 0));
      })
      .catch((e: any) => {
        if (!alive) return;
        const msg = String(e?.message || "");
        if (msg.includes("뉴스")) {
          setNewsError(e.message);
          return;
        }
        if (msg.includes("정책")) {
          setLawsError(e.message);
          return;
        }
        setError(e.message);
        setDetail(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [petitionId]);

  const badge = useMemo(() => safeString(detail?.category, "-"), [detail?.category]);
  const title = useMemo(() => safeString(detail?.title, "제목 없음"), [detail?.title]);

  const agreeCount = useMemo(() => safeNumber(detail?.allows, 0), [detail?.allows]);
  const percent = useMemo(() => computePercent(detail?.allows), [detail?.allows]);

  const heroMeta = useMemo(() => {
    const period = `${formatDotDate(detail?.voteStartDate)} ~ ${formatDotDate(
      detail?.voteEndDate
    )}`;

    return [
      { iconSrc: "/proicons_calendar.svg", label: "동의기간", value: period, valueHighlight: true },
      { iconSrc: "/Group (2).svg", label: "소관위원회", value: safeString(detail?.committee, "-") },
      { iconSrc: "/Group (1).svg", label: "상태", value: statusLabel(detail?.status) },
      { iconSrc: "/proicons_attach.svg", label: "청원분야", value: badge },
      {
        iconSrc: "/proicons_send.svg",
        label: "위원회회부일",
        value: detail?.committeeDate ? formatDotDate(detail.committeeDate) : "-",
      },
      {
        iconSrc: "/proicons_script.svg",
        label: "처리결과",
        value: safeString(detail?.result, "-"),
        valueHighlight: true,
      },
    ];
  }, [detail, badge]);

  const miniMeta = useMemo(() => {
    return [
      {
        iconSrc: "/proicons_calendar.svg",
        label: "마감날짜",
        value: formatDotDate(detail?.voteEndDate),
        valueHighlight: true,
      },
      {
        iconSrc: "/proicons_script.svg",
        label: "처리결과",
        value: safeString(detail?.result, "-"),
        valueHighlight: true,
      },
    ];
  }, [detail]);

  const aiText = useMemo(
    () => safeString(detail?.petitionSummary, "AI 요약 정보가 아직 없어요."),
    [detail?.petitionSummary]
  );

  const overviewText = useMemo(() => {
    const t = detail?.petitionNeeds || detail?.content || "";
    return safeString(t, "개요 정보가 아직 없어요.");
  }, [detail?.petitionNeeds, detail?.content]);
  

  const onClickGo = useMemo(() => {
    const url = detail?.petitionUrl || detail?.url;
    if (!url) return undefined;
    return () => window.open(url, "_blank", "noreferrer");
  }, [detail?.petitionUrl, detail?.url]);

  const prosItems = useMemo(() => {
    const s = safeString(detail?.positiveEx, "");
    return s ? [{ title: "긍정적 영향", desc: s }] : [];
  }, [detail?.positiveEx]);

  const consItems = useMemo(() => {
    const s = safeString(detail?.negativeEx, "");
    return s ? [{ title: "부정적 영향", desc: s }] : [];
  }, [detail?.negativeEx]);

  const showProsCons = prosItems.length > 0 || consItems.length > 0;

  if (!petitionId) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.container}>잘못된 id</div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.container}>로딩중...</div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.container}>{error ?? "데이터 없음"}</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.bgLayer} />

      <div className={styles.contentWrap}>
        <div className={styles.container}>
          <DetailHeroCard
            badge={badge}
            title={title}
            meta={heroMeta}
            agreeCount={agreeCount}
            percent={percent}
            statusPill="마감"
            onClickBookmark={() => {}}
            onClickGo={onClickGo}
          />

          <div className={styles.grid}>
            <div className={styles.leftCol}>
              <AISummaryCard text={aiText} />

              <PetitionOverview text={overviewText}>
                {lawsError ? (
                  <div style={{ marginTop: 16, color: "#666", fontWeight: 700 }}>
                    {lawsError}
                  </div>
                ) : laws.length === 0 ? null : (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 10 }}>
                      관련 정책
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {laws.map((x, i) => (
                        <div
                          key={`${x.title}-${i}`}
                          style={{
                            border: "1px solid #E6E6E6",
                            borderRadius: 12,
                            padding: 14,
                            background: "#fff",
                          }}
                        >
                          <div style={{ fontWeight: 900, marginBottom: 6 }}>{x.title}</div>
                          {x.summary ? (
                            <div style={{ color: "#555", lineHeight: 1.7 }}>{x.summary}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PetitionOverview>

              {showProsCons && <ProsConsSection pros={prosItems} cons={consItems} />}

              <RelatedNewsSection items={news} error={newsError} />
              <SummaryNotice />

              <LikeDislikeBar
                petitionId={petitionId}
                good={goodLocal}
                bad={badLocal}
                onChangeCounts={(g, b) => {
                  setGoodLocal(g);
                  setBadLocal(b);
                }}
              />

              <div className={styles.spacer} />
            </div>

            <aside className={styles.rightCol}>
              <DetailMiniCard
                badge={badge}
                title={title}
                meta={miniMeta}
                agreeCount={agreeCount}
                percent={percent}
                onClickGo={onClickGo}
              />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
