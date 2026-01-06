import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/CommentSection.module.css";

type CommentItem = {
  id: number;
  name: string;
  body: string;
  check?: boolean;
};

type Props = {
  petitionId: number;
  isAuthed: boolean;
};

function safeString(v: unknown, fallback = "") {
  if (typeof v === "string") return v;
  return fallback;
}

export default function CommentSection({ petitionId, isAuthed }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<CommentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => text.trim().length > 0 && !submitting, [text, submitting]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 1600);
  };

  const fetchComments = async () => {
    if (!petitionId) return;

    setLoading(true);
    setError(null);

    try {
      const r = await fetch(`/api/petition/comment/${petitionId}`, {
        credentials: "include",
      });
      const d = await r.json().catch(() => []);
      if (!r.ok) throw new Error(d?.message || `댓글 조회 실패 (status ${r.status})`);

      const arr = Array.isArray(d) ? d : [];
      const normalized: CommentItem[] = arr
        .map((it: any) => {
          const id = Number(it?.id);
          if (!Number.isFinite(id)) return null;
          return {
            id,
            name: safeString(it?.name, "익명"),
            body: safeString(it?.body, ""),
            check: Boolean(it?.check),
          };
        })
        .filter(Boolean) as CommentItem[];

      setItems(normalized);
    } catch (e: any) {
      setError(e?.message ?? "댓글을 불러오지 못했어");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [petitionId]);

  const requireLogin = () => {
    showToast("로그인 후 이용할 수 있는 기능이에요!");
    window.setTimeout(() => router.push("/login"), 700);
  };

  const onSubmit = async () => {
    if (!isAuthed) {
      requireLogin();
      return;
    }
    if (!canSubmit) return;

    const body = text.trim();
    setSubmitting(true);

    try {
      const r = await fetch(`/api/petition/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: petitionId, body }),
      });

      const d = await r.json().catch(() => null);

      if (r.status === 401 || r.status === 402) {
        requireLogin();
        return;
      }

      if (!r.ok) throw new Error(d?.message || `댓글 작성 실패 (status ${r.status})`);

      setText("");
      await fetchComments();
    } catch (e: any) {
      showToast(e?.message ?? "댓글 작성에 실패했어");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (commentId: number) => {
    if (!isAuthed) {
      requireLogin();
      return;
    }
    if (submitting) return;

    setSubmitting(true);

    try {
      const r = await fetch(`/api/petition/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const d = await r.json().catch(() => null);

      if (r.status === 401 || r.status === 402) {
        requireLogin();
        return;
      }

      if (!r.ok) throw new Error(d?.message || `댓글 삭제 실패 (status ${r.status})`);

      await fetchComments();
    } catch (e: any) {
      showToast(e?.message ?? "댓글 삭제에 실패했어");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>댓글</h2>
        <span className={styles.count}>{items.length}</span>
      </div>

      <div className={styles.editor}>
        <div className={styles.avatar} aria-hidden />
        <div className={styles.inputBox}>
          <textarea
            className={styles.textarea}
            placeholder="댓글을 입력해주세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
          <div className={styles.editorBottom}>
            <span className={styles.limit}>{text.trim().length}/500</span>
            <button
              type="button"
              className={styles.submitBtn}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {loading && <div className={styles.stateText}>불러오는 중...</div>}
        {!loading && error && <div className={styles.stateText}>{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className={styles.stateText}>첫 댓글을 남겨보자!</div>
        )}

        {!loading &&
          !error &&
          items.map((c) => (
            <div key={c.id} className={styles.item}>
              <div className={styles.avatarSmall} aria-hidden />
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <div className={styles.name}>{c.name}</div>

                  {c.check && (
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onDelete(c.id)}
                      disabled={submitting}
                    >
                      삭제
                    </button>
                  )}
                </div>

                <p className={styles.body}>{c.body}</p>
              </div>
            </div>
          ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </section>
  );
}
