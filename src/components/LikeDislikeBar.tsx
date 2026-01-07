import { useEffect, useState } from "react";
import styles from "@/styles/LikeDislikeBar.module.css";
import api from "@/lib/axios"; // 👈 [핵심] 우리가 만든 Axios 인스턴스 import

type Props = {
  petitionId: number;
  good: number;
  bad: number;
  onChangeCounts?: (nextGood: number, nextBad: number) => void;
};

export default function LikeDislikeBar({
  petitionId,
  good,
  bad,
  onChangeCounts,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [my, setMy] = useState<null | 1 | -1>(null);

  const goodCount = Number.isFinite(Number(good)) ? Number(good) : 0;
  const badCount = Number.isFinite(Number(bad)) ? Number(bad) : 0;

  // ✅ 개수 기준 아이콘 결정
  const likeIcon = goodCount > 0 ? "/on.svg" : "/off.svg";
  const dislikeIcon = badCount > 0 ? "/fckon.svg" : "/fckoff.svg";

  useEffect(() => {
    if (!petitionId) return;

    let alive = true;

    // 1. [수정] 내 반응 조회 (GET)
    // fetch -> api.get 변경 (헤더에 토큰 자동 포함됨)
    api.get(`/petition/likes/${petitionId}`)
      .then((r) => {
        if (!alive) return;
        // Axios는 r.data에 본문이 있습니다. (r.json() 아님)
        // 백엔드가 숫자를 반환하면 1, -1, 0(null) 등이 옴
        const d = r.data; 
        
        // 데이터가 없거나 0이면 null 처리
        if (!d) {
          setMy(null);
          return;
        }

        const v = Number(d); // 백엔드 응답이 숫자라고 가정 (Integer)
        if (v === 1 || v === -1) setMy(v as 1 | -1);
        else setMy(null);
      })
      .catch((err) => {
        if (!alive) return;
        // 401 에러 등은 조용히 무시 (비로그인 상태일 수 있음)
        setMy(null);
      });

    return () => {
      alive = false;
    };
  }, [petitionId]);

  const applyLocalCounts = (nextMy: null | 1 | -1) => {
    let g = goodCount;
    let b = badCount;

    if (my === 1) g -= 1;
    if (my === -1) b -= 1;

    if (nextMy === 1) g += 1;
    if (nextMy === -1) b += 1;

    onChangeCounts?.(Math.max(0, g), Math.max(0, b));
  };

  const post = async (likes: 1 | -1) => {
    if (loading) return;
    setLoading(true);

    const nextMy = my === likes ? null : likes;
    
    // UI 먼저 업데이트 (낙관적 업데이트)
    applyLocalCounts(nextMy);
    setMy(nextMy);

    try {
      // 2. [수정] 좋아요/싫어요 전송 (POST)
      // fetch -> api.post 변경
      await api.post(`/petition/likes`, { 
        id: petitionId, 
        likes: likes 
      });

      // Axios는 2xx 범위가 아니면 자동으로 에러를 던지므로 r.ok 체크 불필요
    } catch (error: any) {
      console.error("좋아요 요청 실패:", error);
      
      // 실패 시 UI 원상복구
      applyLocalCounts(my);
      setMy(my);

      // 401 에러 (로그인 필요) 처리
      if (error.response?.status === 401) {
        if (confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?")) {
          window.location.href = "/login";
        }
      } else {
        alert("요청 처리에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        {/* 👍 좋아요 */}
        <button
          type="button"
          className={`${styles.btn} ${my === 1 ? styles.activeGood : ""}`}
          onClick={() => post(1)}
          disabled={loading}
        >
          <span className={styles.count}>{goodCount}</span>
          <img src={likeIcon} alt="좋아요" className={styles.iconImg} />
        </button>
  
        <div className={styles.divider} />
  
        {/* 👎 싫어요 */}
        <button
          type="button"
          className={`${styles.btn} ${my === -1 ? styles.activeBad : ""}`}
          onClick={() => post(-1)}
          disabled={loading}
        >
          <img src={dislikeIcon} alt="싫어요" className={styles.iconImg} />
          <span className={styles.count}>{badCount}</span>
        </button>
      </div>
    </div>
  );
}