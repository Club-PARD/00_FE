import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ProsConsSection from "@/components/ProsConsSection";
import DetailHeroCard from "@/components/DetailHeroCard";
import Header from "@/components/Header";
import AISummaryCard from "@/components/AISummaryCard";
import DetailMiniCard from "@/components/DetailMiniCard";
import PetitionOverview from "@/components/PetitionOverview";

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

function formatDotDate(iso?: string) {
  if (!iso) return "-";
  const s = iso.slice(0, 10);
  return s.replaceAll("-", ".");
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

const MOCK_DETAIL: PetitionDetailResponse = {
  title: "편파, 조작, 왜곡, 불공정 방송, 민주당의 나팔수 MBC 폐방 요청에 관한 청원",
  category: "문화 체육 관광 언론",
  voteStartDate: "2025-03-17",
  voteEndDate: "2025-04-16",
  result: "본회의불부의",
  status: 2,
  allows: 175552,
  petitionSummary:
    "MBC가 공영방송으로서 지켜야 할 '중립 의무'를 어기고 특정 정치 세력 편만 들고 있으니, 이에 방송국 문을 닫게(허가 취소) 해달라는 요구입니다.",
  content:
    "대한민국 방송법은 방송의 자유와 독립을 보장함과 동시에 언론의 공공 책임과 공정성을 엄격히 규정하고 있습니다.\n\n방송은 특정 정당이나 이념의 도구가 되어서는 안 되며, 국민 전체의 이익을 위해 균형 잡힌 정보를 제공해야 할 의무가 있습니다.\n\n현재 특정 방송사의 보도 내용이 객관성과 공정성을 상실하고 사실을 왜곡하여 사회적 갈등을 심화시키고 있다는 주장이 제기되면서, 해당 방송사에 대한 법적 책임과 방송 유지 여부에 대한 논의가 진행되었습니다.",
  petitionUrl: "https://example.com",
};

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

  useEffect(() => {
    if (!petitionId) return;
    setLoading(false);
    setError(null);
    setDetail(MOCK_DETAIL);
  }, [petitionId]);

  const badge = useMemo(() => safeString(detail?.category, "-"), [detail?.category]);
  const title = useMemo(() => safeString(detail?.title, "제목 없음"), [detail?.title]);

  const agreeCount = useMemo(() => {
    const n = Number(detail?.allows);
    return Number.isFinite(n) ? n : 0;
  }, [detail?.allows]);

  const percent = useMemo(() => 100, []);

  const heroMeta = useMemo(() => {
    const period = `${formatDotDate(detail?.voteStartDate)} ~ ${formatDotDate(detail?.voteEndDate)}`;
    return [
      { iconSrc: "/proicons_calendar.svg", label: "동의기간", value: period, valueHighlight: true },
      { iconSrc: "/Group (2).svg", label: "소관위원회", value: safeString(detail?.committee, "과학기술정보방송통신위원회") },
      { iconSrc: "/Group (1).svg", label: "상태", value: statusLabel(detail?.status) },
      { iconSrc: "/proicons_attach.svg", label: "청원분야", value: badge },
      { iconSrc: "/proicons_send.svg", label: "위원회회부일", value: detail?.committeeDate ? formatDotDate(detail.committeeDate) : "2025.03.31" },
      { iconSrc: "/proicons_script.svg", label: "처리결과", value: safeString(detail?.result, "-"), valueHighlight: true },
    ];
  }, [detail, badge]);

  const miniMeta = useMemo(() => {
    return [
      { iconSrc: "/proicons_calendar.svg", label: "마감날짜", value: formatDotDate(detail?.voteEndDate), valueHighlight: true },
      { iconSrc: "/proicons_script.svg", label: "처리결과", value: safeString(detail?.result, "-"), valueHighlight: true },
    ];
  }, [detail]);

  const aiText = useMemo(
    () => safeString(detail?.petitionSummary, "AI 요약 정보가 아직 없어요."),
    [detail?.petitionSummary]
  );

  const overviewText = useMemo(() => {
    const t = detail?.content || detail?.positiveEx || detail?.negativeEx || "";
    return safeString(t, "개요 정보가 아직 없어요.");
  }, [detail]);

  const onClickGo = useMemo(() => {
    const url = detail?.petitionUrl || detail?.url;
    if (!url) return undefined;
    return () => window.open(url, "_blank", "noreferrer");
  }, [detail?.petitionUrl, detail?.url]);

  if (!petitionId) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.fallbackWrap}>
          <div className={styles.container}>잘못된 id</div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.fallbackWrap}>
          <div className={styles.container}>로딩중...</div>
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.fallbackWrap}>
          <div className={styles.container}>{error ?? "데이터 없음"}</div>
        </div>
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

              <PetitionOverview text={overviewText} />

              <ProsConsSection
                pros={[
                  {
                    title: "‘팩트 체크’ 스트레스 감소",
                    desc:
                      "자극적인 낚시성 기사나 가짜 뉴스가 줄어듭니다. 공정성 기준이 엄격해지면 뉴스 자체가 담백해지기 때문에, 청년들이 일일이 진위 여부를 의심하지 않아도 믿고 볼 수 있는 고퀄리티 정보가 많아집니다.",
                  },
                  {
                    title: "소모적인 ‘키보드 배틀’ 완화",
                    desc:
                      "감정적인 선동이나 편 가르기식 보도가 줄어들면 사회적 갈등도 낮아집니다. 커뮤니티나 댓글창에서 벌어지는 소모적인 싸움이 줄어들고, 훨씬 차분한 분위기에서 이슈를 바라볼 수 있게 됩니다.",
                  },
                  {
                    title: "합리적인 ‘내 생각’ 정립 가능",
                    desc:
                      "편향되지 않은 중립적인 정보를 접하면서, 외부의 선동에 휘둘리지 않고 스스로 판단할 수 있는 힘이 길러집니다. 취업, 경제, 주거 등 예민한 사회 이슈에 대해 객관적인 근거를 바탕으로 본인만의 주관을 세울 수 있습니다.",
                  },
                ]}
                cons={[
                  {
                    title: "할 말 못하는 ‘고구마’ 언론",
                    desc:
                      "강력한 징계가 무서워 언론이 몸을 사릴 수 있습니다. 권력에 대한 시원한 비판이나 날카로운 폭로가 줄어들면서, 언론 본연의 ‘사이다’ 같은 감시 기능도 약해질 우려가 있습니다.",
                  },
                  {
                    title: "뉴스판 ‘노잼’ 화 (개성 상실)",
                    desc:
                      "모든 매체가 공정성 틀에만 갇히면, 각 채널만의 독특한 시각이나 개성 있는 분석이 사라집니다. 결국 어디를 틀어도 똑같은 목소리만 들리는 ‘무색무취’한 뉴스 환경이 될 수 있습니다.",
                  },
                  {
                    title: "‘내 취향’의 정보 선택권 제한",
                    desc:
                      "세상에는 다양한 가치관이 존재하는데, 엄격한 규제로 인해 매체들이 줄어들면 결국 다양한 관점을 비교해 볼 기회 자체가 사라집니다. ‘내가 보고 싶은 관점을 선택할 권리’가 침해받는 셈입니다.",
                  },
                ]}
                prosTags={["정보 객관성 확보", "사회적 갈등 완화"]}
                consTags={["비판 기능 위축", "매체 다양성 감소"]}
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
