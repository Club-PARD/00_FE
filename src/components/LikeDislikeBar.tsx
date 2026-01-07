import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/LikeDislikeBar.module.css";

type Props = {
  petitionId: number;
  good: number;
  bad: number;
  isAuthed: boolean;
  onChangeCounts?: (nextGood: number, nextBad: number) => void;
};

export default function LikeDislikeBar({ petitionId, good, bad, isAuthed, onChangeCounts }: Props) {
  const [loading, setLoading] = useState(false);
  const [my, setMy] = useState<null | 1 | -1>(null);

  const [toast, setToast] = useState(false);

  const goodCount = useMemo(() => (Number.isFinite(Number(good)) ? Number(good) : 0), [good]);
  const badCount = useMemo(() => (Number.isFinite(Number(bad)) ? Number(bad) : 0), [bad]);

  const likeIcon = goodCount > 0 ? "/on.svg" : "/off.svg";
  const dislikeIcon = badCount > 0 ? "/fckon.svg" : "/fckoff.svg";

  useEffect(() => {
    if (!petitionId) return;

    if (!isAuthed) {
      setMy(null);
      return;
    }

    let alive = true;

    fetch(`/api/petition/likes/${petitionId}`, { credentials: "include" })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!alive) return;

        const v = Number(d?.likes);
        if (v === 1 || v === -1) setMy(v);
        else setMy(null);
      })
      .catch(() => {
        if (!alive) return;
        setMy(null);
      });

    return () => {
      alive = false;
    };
  }, [petitionId, isAuthed]);

  const showLoginToast = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 1800);
  };

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
    if (!isAuthed) {
      showLoginToast();
      return;
    }
    if (loading) return;

    setLoading(true);

    const nextMy = my === likes ? null : likes;
    applyLocalCounts(nextMy);
    setMy(nextMy);

    try {
      const r = await fetch(`/api/petition/likes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: petitionId, likes }),
      });

      if (!r.ok) throw new Error();
    } catch {
      applyLocalCounts(my);
      setMy(my);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {toast && (
        <div className={styles.toast}>
          로그인 후 이용할 수 있는 기능이에요!
        </div>
      )}

      <div className={styles.bar}>
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
