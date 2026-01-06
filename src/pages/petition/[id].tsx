// import DetailHeroCard from "@/components/DetailHeroCard";
// import Header from "@/components/Header";
// import AISummaryCard from "@/components/AISummaryCard";
// import DetailMiniCard from "@/components/DetailMiniCard";
// import PetitionOverview from "@/components/PetitionOverview";

// export default function PetitionDetailPage() {
//   return (
//     <main style={{ minHeight: "100vh", background: "#f5f6f8" }}>
//       <Header />

//       <div style={{ padding: "60px 20px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <DetailHeroCard
//             badge="문화 체육 관광 언론띠"
//             title="편파, 조작, 왜곡, 불공정 방송, 민주당의 나팔수 MBC 폐방 요청에 관한 청원"
//             meta={[
//               { iconSrc: "/proicons_calendar.svg", label: "동의기간", value: "2025.03.17 ~ 2025.04.16", valueHighlight: true },
//               { iconSrc: "/Group (2).svg", label: "소관위원회", value: "과학기술정보방송통신위원회" },
//               { iconSrc: "/proicons_script.svg", label: "처리결과", value: "본회의부의", valueHighlight: true },
//               { iconSrc: "/Group (1).svg", label: "상태", value: "본회의불부의" },
//               { iconSrc: "/proicons_send.svg", label: "위원회회부일", value: "2025.03.31" },
//             ]}
//             agreeCount={175552}
//             percent={100}
//             onClickGo={() => alert("바로가기")}
//           />

//           <div
//             style={{
//               marginTop: 24,
//               display: "grid",
//               gridTemplateColumns: "792px 384px",
//               gap: 24,
//               alignItems: "start",
//             }}
//           >
//             <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
//               <AISummaryCard text="MBC가 공영방송으로서 지켜야 할 '중립 의무'를 어기고 특정 정치 세력 편만 들고 있으니, 아예 방송국 문을 닫게(허가 취소) 해달라는 요구입니다." />

//               <PetitionOverview
//                 text={`대한민국 방송법은 방송의 자유와 독립을 보장함과 동시에 언론의 공공 책임과 공정성을 엄격히 규정하고 있습니다. 방송은 특정 정당이나 이념의 도구가 되어서는 안 되며, 국민 전체의 이익을 위해 균형 잡힌 정보를 제공해야 할 의무가 있기 때문입니다. 현재 특정 방송사의 보도 내용이 객관성과 공정성을 상실하고 사실을 왜곡하여 사회적 갈등을 심화시키고 있다는 주장이 제기되면서, 해당 방송사에 대한 법적 책임과 방송 유지 여부에 대한 논의가 진행되었습니다.`}
//               />

//               <div style={{ height: 900 }} />
//             </div>

//             <div style={{ position: "sticky", top: 120, alignSelf: "start" }}>
//               <DetailMiniCard
//                 badge="문화 체육 관광 언론띠"
//                 title="편파, 조작, 왜곡, 불공정 방송, 민주당의 나팔수 MBC 폐방 요청에 관한 청원"
//                 meta={[
//                   { iconSrc: "/proicons_calendar.svg", label: "동의기간", value: "2025.03.17 ~ 2025.04.16", valueHighlight: true },
//                   { iconSrc: "/proicons_script.svg", label: "처리결과", value: "본회의불부의", valueHighlight: true },
//                 ]}
//                 agreeCount={175552}
//                 percent={100}
//                 onClickGo={() => alert("바로가기")}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import DetailHeroCard from "@/components/DetailHeroCard";
import Header from "@/components/Header";
import AISummaryCard from "@/components/AISummaryCard";
import DetailMiniCard from "@/components/DetailMiniCard";
import PetitionOverview from "@/components/PetitionOverview";

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
  const map: Record<number, string> = {
    0: "진행중",
    1: "종료",
    2: "처리완료",
  };
  if (typeof status !== "number") return "-";
  return map[status] ?? String(status);
}

function safeString(v: unknown, fallback = "-") {
  if (typeof v === "string" && v.trim()) return v;
  return fallback;
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

  useEffect(() => {
    if (!petitionId) return;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const r = await axios.get(`/api/petition/${petitionId}`, {
          validateStatus: () => true,
        });

        if (r.status !== 200) {
          setDetail(null);
          setError(`상세 조회 실패 (${r.status})`);
          return;
        }

        setDetail(r.data ?? null);
      } catch (e: any) {
        setDetail(null);
        setError(e?.message ?? "fetch error");
      } finally {
        setLoading(false);
      }
    })();
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
      { iconSrc: "/Group (2).svg", label: "소관위원회", value: safeString(detail?.committee, "-") },
      { iconSrc: "/proicons_script.svg", label: "처리결과", value: safeString(detail?.result, "-"), valueHighlight: true },
      { iconSrc: "/Group (1).svg", label: "상태", value: statusLabel(detail?.status) },
      { iconSrc: "/proicons_send.svg", label: "위원회회부일", value: detail?.committeeDate ? formatDotDate(detail.committeeDate) : "-" },
    ];
  }, [detail]);

  const miniMeta = useMemo(() => {
    const period = `${formatDotDate(detail?.voteStartDate)} ~ ${formatDotDate(detail?.voteEndDate)}`;
    return [
      { iconSrc: "/proicons_calendar.svg", label: "동의기간", value: period, valueHighlight: true },
      { iconSrc: "/proicons_script.svg", label: "처리결과", value: safeString(detail?.result, "-"), valueHighlight: true },
    ];
  }, [detail]);

  const aiText = useMemo(() => {
    return safeString(detail?.petitionSummary, "AI 요약 정보가 아직 없어요.");
  }, [detail?.petitionSummary]);

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
      <main style={{ minHeight: "100vh", background: "#f5f6f8" }}>
        <Header />
        <div style={{ padding: "60px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>잘못된 id</div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#f5f6f8" }}>
        <Header />
        <div style={{ padding: "60px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>로딩중...</div>
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main style={{ minHeight: "100vh", background: "#f5f6f8" }}>
        <Header />
        <div style={{ padding: "60px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{error ?? "데이터 없음"}</div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f6f8" }}>
      <Header />

      <div style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <DetailHeroCard
            badge={badge}
            title={title}
            meta={heroMeta}
            agreeCount={agreeCount}
            percent={percent}
            onClickGo={onClickGo}
          />

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "792px 384px",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <AISummaryCard text={aiText} />

              <PetitionOverview text={overviewText} />

              <div style={{ height: 900 }} />
            </div>

            <div style={{ position: "sticky", top: 120, alignSelf: "start" }}>
              <DetailMiniCard
                badge={badge}
                title={title}
                meta={miniMeta}
                agreeCount={agreeCount}
                percent={percent}
                onClickGo={onClickGo}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

