import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Header from "@/components/Header";
import DetailSideCard from "@/components/DetailSideCard";
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

type PetitionLaw = { title: string; summary: string };
type PetitionNews = { url: string };
type LikeInfo = { likes: -1 | 1 };
type PetitionComment = { id: number; name: string; body: string; check: boolean };

export default function PetitionDetailPage() {
  const router = useRouter();
  const idRaw = typeof router.query.id === "string" ? router.query.id : "";
  const petitionId = useMemo(() => {
    const n = Number(idRaw);
    return idRaw && !Number.isNaN(n) ? n : null;
  }, [idRaw]);

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<PetitionDetail | null>(null);
  const [laws, setLaws] = useState<PetitionLaw[]>([]);
  const [news, setNews] = useState<PetitionNews[]>([]);
  const [myLike, setMyLike] = useState<-1 | 1 | null>(null);
  const [comments, setComments] = useState<PetitionComment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numberFmt = useMemo(() => new Intl.NumberFormat("ko-KR"), []);

  const refetchDetail = async (pid: number) => {
    const r = await axios.get(`/api/petition/${pid}`).catch((e) => e.response);
    if (!r) throw new Error("network error");
    if (r.status !== 200) throw new Error(`detail ${r.status}`);
    setDetail(r.data);
  };

  const refetchLawsNews = async (pid: number) => {
    const [rLaws, rNews] = await Promise.all([
      axios.get(`/api/petition/laws/${pid}`).catch((e) => e.response),
      axios.get(`/api/petition/news/${pid}`).catch((e) => e.response),
    ]);

    if (rLaws?.status === 200) setLaws(Array.isArray(rLaws.data) ? rLaws.data : []);
    else setLaws([]);

    if (rNews?.status === 200) setNews(Array.isArray(rNews.data) ? rNews.data : []);
    else setNews([]);
  };

  const refetchLikes = async (pid: number) => {
    const r = await axios.get(`/api/petition/likes/${pid}`).catch((e) => e.response);
    if (!r) return setMyLike(null);

    if (r.status === 200) {
      const v = (r.data as LikeInfo | null)?.likes;
      setMyLike(v === 1 || v === -1 ? v : null);
      return;
    }

    if (r.status === 402 || r.status === 401) {
      setMyLike(null);
      return;
    }

    setMyLike(null);
  };

  const refetchComments = async (pid: number) => {
    const r = await axios.get(`/api/petition/comment/${pid}`).catch((e) => e.response);
    if (r?.status === 200) setComments(Array.isArray(r.data) ? r.data : []);
    else setComments([]);
  };

  useEffect(() => {
    if (!petitionId) return;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([refetchDetail(petitionId), refetchLawsNews(petitionId)]);
        await Promise.all([refetchLikes(petitionId), refetchComments(petitionId)]);
      } catch (e: any) {
        setError(e?.message ?? "load error");
      } finally {
        setLoading(false);
      }
    })();
  }, [petitionId]);

  const handleLike = async (value: 1 | -1) => {
    if (!petitionId || liking) return;

    setLiking(true);
    const r = await axios
      .post("/api/petition/likes", { id: petitionId, likes: value })
      .catch((e) => e.response);

    if (r?.status === 401 || r?.status === 402) {
      alert("로그인이 필요해");
      router.push("/login");
      setLiking(false);
      return;
    }

    await Promise.all([refetchDetail(petitionId), refetchLikes(petitionId)]);
    setLiking(false);
  };

  const handleSubmitComment = async () => {
    if (!petitionId || submittingComment) return;
    const body = commentBody.trim();
    if (!body) return;

    setSubmittingComment(true);
    const r = await axios
      .post("/api/petition/comment", { id: petitionId, body })
      .catch((e) => e.response);

    if (r?.status === 401 || r?.status === 402) {
      alert("로그인이 필요해");
      router.push("/login");
      setSubmittingComment(false);
      return;
    }

    setCommentBody("");
    await refetchComments(petitionId);
    setSubmittingComment(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!petitionId) return;
    const ok = confirm("댓글 삭제할까?");
    if (!ok) return;

    const r = await axios.delete(`/api/petition/comment/${commentId}`).catch((e) => e.response);

    if (r?.status === 401 || r?.status === 402) {
      alert("로그인이 필요해");
      router.push("/login");
      return;
    }

    await refetchComments(petitionId);
  };

  const periodText =
    detail ? `${detail.voteStartDate} ~ ${detail.voteEndDate}` : "";

  const sideResult = detail?.result ?? "-";
  const sideAi = detail?.petitionSummary ?? "-";
  const sideAgree = detail?.allows ?? 0;

  return (
    <div className={styles.page}>
      <Header/>

      <div className={styles.container}>
        <main className={styles.main}>
          {loading ? (
            <div className={styles.stateBox}>로딩중...</div>
          ) : error ? (
            <div className={styles.stateBox}>에러: {error}</div>
          ) : !detail ? (
            <div className={styles.stateBox}>데이터가 없어</div>
          ) : (
            <>
              <div className={styles.badge}>{detail.category}</div>

              <h1 className={styles.title}>{detail.title}</h1>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>동의기간</span>
                  <span className={styles.metaValue}>{periodText}</span>
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>처리결과</span>
                  <span className={styles.metaValue}>{detail.result}</span>
                </div>
              </div>

              <div className={styles.likeRow}>
                <button
                  className={myLike === 1 ? styles.likeBtnOn : styles.likeBtn}
                  type="button"
                  onClick={() => handleLike(1)}
                  disabled={liking}
                >
                  👍 좋아요 {numberFmt.format(detail.good)}
                </button>
                <button
                  className={myLike === -1 ? styles.likeBtnOn : styles.likeBtn}
                  type="button"
                  onClick={() => handleLike(-1)}
                  disabled={liking}
                >
                  👎 싫어요 {numberFmt.format(detail.bad)}
                </button>
              </div>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>AI 요약</h2>
                <p className={styles.paragraph}>{detail.petitionSummary}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>개요</h2>
                <p className={styles.paragraph}>{detail.positiveEx}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>20대 생활 영향</h2>
                <p className={styles.paragraph}>{detail.negativeEx}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>관련 정책</h2>
                {laws.length === 0 ? (
                  <div className={styles.emptyText}>관련 정책이 없어</div>
                ) : (
                  <div className={styles.list}>
                    {laws.map((x, idx) => (
                      <div key={`${x.title}-${idx}`} className={styles.listItem}>
                        <div className={styles.listTitle}>{x.title}</div>
                        <div className={styles.listBody}>{x.summary}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>관련 뉴스</h2>
                {news.length === 0 ? (
                  <div className={styles.emptyText}>관련 뉴스가 없어</div>
                ) : (
                  <div className={styles.list}>
                    {news.map((x, idx) => (
                      <a
                        key={`${x.url}-${idx}`}
                        className={styles.linkItem}
                        href={x.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {x.url}
                      </a>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>댓글</h2>

                <div className={styles.commentBox}>
                  <textarea
                    className={styles.commentInput}
                    placeholder="댓글을 입력해줘"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                  />
                  <button
                    className={styles.commentSubmit}
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                  >
                    등록
                  </button>
                </div>

                {comments.length === 0 ? (
                  <div className={styles.emptyText}>댓글이 없어</div>
                ) : (
                  <div className={styles.commentList}>
                    {comments.map((c) => (
                      <div key={c.id} className={styles.commentItem}>
                        <div className={styles.commentTop}>
                          <div className={styles.commentName}>{c.name}</div>
                          {c.check ? (
                            <button
                              className={styles.commentDelete}
                              type="button"
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              삭제
                            </button>
                          ) : null}
                        </div>
                        <div className={styles.commentBody}>{c.body}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <aside className={styles.aside}>
          <DetailSideCard
            period={periodText || "-"}
            committeeDate={detail ? detail.voteStartDate : "-"}
            result={sideResult}
            aiSummary={sideAi}
            agreeCount={sideAgree}
            percent={100}
            buttonText="바로가기"
            onClick={() => {}}
          />
        </aside>
      </div>
    </div>
  );
}



// import { useRouter } from "next/router";
// import styles from "@/styles/PetitionDetail.module.css";

// export default function PetitionDetailPage() {
//   const router = useRouter();

//   const data = {
//     category: "문화·체육·관광·언론",
//     title: "편파, 조작, 왜곡, 불공정 방송, 민주당의 나팔수 MBC\n폐방 요청에 관한 청원",
//     committeeLabel: "소관위원회",
//     committeeValue: "과학기술정보방송통신위원회",
//     statusLabel: "진행중",
//     periodLabel: "동의기간",
//     periodValue: "2025-03-17 ~ 2025-04-16",
//     committeeDateLabel: "위원회부회",
//     committeeDateValue: "2025.03.31",
//     처리결과Label: "처리결과",
//     처리결과Value: "본회의부회부의",
//     aiSummaryTitle: "AI 요약",
//     aiSummary:
//       "MBC가 공정방송으로서 지켜야 할 중립 의무를 어기고 특정 정파·세력 편향 보도를 하고 있으며, 이에 방송국 존립 자체가 위태롭다는 요구입니다.",
//     overviewTitle: "개요",
//     overview:
//       "티비 방송은 유튜브보다 다릅니다. 우리 모두의 자산인 전파를 빌려서 쓰기 때문이에요. 그래서 방송의 제작은 방송사에게 혜택을 주는 대신, 항상 편파 조작 없이 공정해야 한다는 약속을 받아냅니다. 지금 이 약속이 잘 지켜졌는지, 아니면 방송국 문을 닫아야 할 정도로 어겼는지를 두고 뜨거운 논쟁이 벌어지고 있습니다.",
//     impactTitle: "20대 생활 영향",
//     impact:
//       "첫째, 정보의 신뢰도가 흔들릴 때 여러 매체의 방송이 중립을 지키면 우리는 뉴스를 볼 때 사실인지 아닌지 의심할 필요가 없겠죠. 반면 편파 보도가 늘어나면 같은 사건도 다르게 보이면서 사회적 갈등이 커질 수 있습니다.\n\n둘째, 갈등이 심해질수록 사회적 비용이 늘고 취업·주거·교육 같은 현실 문제에 집중하기 어려워질 수 있어요. 다양한 의견이 공존하는 환경이 무너지면 사회 분위기가 더 경직될 수도 있습니다.\n\n셋째, 공영방송의 역할과 기준에 대한 논의가 커지면, 향후 미디어 정책·감시 체계·플랫폼 소비 방식에도 변화가 생길 수 있습니다.",
//     agreeCount: 175552,
//     percent: 100,
//     buttonText: "바로가기",
//   };

//   const numberFmt = new Intl.NumberFormat("ko-KR");

//   return (
//     <div className={styles.page}>
//       <div className={styles.topbar}>
//         <div className={styles.brand} onClick={() => router.push("/")}>
//           <span className={styles.brandMark} />
//           <span className={styles.brandText}>mora</span>
//         </div>

//         <nav className={styles.nav}>
//           <button className={styles.navItemActive} type="button">
//             국회안건
//           </button>
//           <button className={styles.navItem} type="button">
//             생활안건
//           </button>
//           <button
//             className={styles.navItem}
//             type="button"
//             onClick={() => router.back()}
//           >
//             돌아가기
//           </button>
//         </nav>

//         <div className={styles.profileDot} />
//       </div>

//       <div className={styles.container}>
//         <main className={styles.main}>
//           <div className={styles.badge}>{data.category}</div>

//           <h1 className={styles.title}>
//             {data.title.split("\n").map((line, idx) => (
//               <span key={idx}>
//                 {line}
//                 {idx !== data.title.split("\n").length - 1 ? <br /> : null}
//               </span>
//             ))}
//           </h1>

//           <div className={styles.metaRow}>
//             <div className={styles.metaItem}>
//               <span className={styles.metaLabel}>{data.committeeLabel}</span>
//               <span className={styles.metaValue}>{data.committeeValue}</span>
//             </div>
//             <div className={styles.metaDivider} />
//             <div className={styles.metaItem}>
//               <span className={styles.metaLabel}>본회의 부회부의</span>
//               <span className={styles.metaValue}>{data.statusLabel}</span>
//             </div>
//           </div>

//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>{data.overviewTitle}</h2>
//             <p className={styles.paragraph}>{data.overview}</p>
//           </section>

//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>{data.impactTitle}</h2>
//             <p className={styles.paragraph}>
//               {data.impact.split("\n").map((line, idx) => (
//                 <span key={idx}>
//                   {line}
//                   <br />
//                 </span>
//               ))}
//             </p>
//           </section>
//         </main>

//         <aside className={styles.aside}>
//           <div className={styles.sideCard}>
//             <div className={styles.sideInfo}>
//               <div className={styles.sideInfoRow}>
//                 <span className={styles.sideKey}>{data.periodLabel}</span>
//                 <span className={styles.sideVal}>{data.periodValue}</span>
//               </div>
//               <div className={styles.sideInfoRow}>
//                 <span className={styles.sideKey}>{data.committeeDateLabel}</span>
//                 <span className={styles.sideVal}>{data.committeeDateValue}</span>
//               </div>
//               <div className={styles.sideInfoRow}>
//                 <span className={styles.sideKey}>{data.처리결과Label}</span>
//                 <span className={styles.sideVal}>{data.처리결과Value}</span>
//               </div>
//             </div>

//             <div className={styles.aiBlock}>
//               <div className={styles.aiTitle}>{data.aiSummaryTitle}</div>
//               <div className={styles.aiBox}>{data.aiSummary}</div>
//             </div>

//             <div className={styles.progressWrap}>
//               <div className={styles.progressTop}>
//                 <div className={styles.countRow}>
//                   <span className={styles.personIcon}>👤</span>
//                   <span className={styles.countText}>
//                     {numberFmt.format(data.agreeCount)}명
//                   </span>
//                 </div>
//                 <span className={styles.percentText}>{data.percent}%</span>
//               </div>

//               <div className={styles.progressBar}>
//                 <div
//                   className={styles.progressFill}
//                   style={{ width: `${Math.min(100, Math.max(0, data.percent))}%` }}
//                 />
//               </div>

//               <button className={styles.cta} type="button">
//                 {data.buttonText}
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }
