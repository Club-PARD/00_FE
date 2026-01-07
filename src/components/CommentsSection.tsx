import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/CommentsSection.module.css";

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

function safeNumber(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeComments(data: any): CommentItem[] {
  const arr = Array.isArray(data) ? data : [];
  return arr
    .map((it: any) => {
      const id = safeNumber(it?.id, NaN);
      const name = safeString(it?.name, "");
      const body = safeString(it?.body, "");
      if (!Number.isFinite(id) || !body) return null;
      return { id, name: name || "익명", body, check: !!it?.check };
    })
    .filter(Boolean) as CommentItem[];
}

export default function CommentsSection({ petitionId, isAuthed }: Props) {
  const router = useRouter();

  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [toast, setToast] = useState(false);

  const count = useMemo(() => items.length, [items.length]);

  const showLoginToast = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 1800);
  };

  const fetchComments = async () => {
    if (!petitionId) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/petition/comment/${petitionId}`, {
        credentials: "include",
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) {
        setItems([]);
        return;
      }
      setItems(normalizeComments(d));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [petitionId]);

  const onSubmit = async () => {
    const body = draft.trim();
    if (!body) return;

    if (!isAuthed) {
      showLoginToast();
      return;
    }

    if (posting) return;

    setPosting(true);
    setDraft("");

    try {
      const r = await fetch(`/api/petition/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: petitionId, body }),
      });

      if (!r.ok) throw new Error();
      await fetchComments();
    } catch {
      setDraft(body);
    } finally {
      setPosting(false);
    }
  };

  const onDelete = async (commentId: number) => {
    if (!isAuthed) {
      showLoginToast();
      return;
    }

    const prev = items;
    setItems((p) => p.filter((x) => x.id !== commentId));
    setOpenMenuId(null);

    try {
      const r = await fetch(`/api/petition/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!r.ok) throw new Error();
    } catch {
      setItems(prev);
    }
  };

  return (
    <section className={styles.wrap} onClick={() => setOpenMenuId(null)}>
      {toast && <div className={styles.toast}>로그인 후 이용할 수 있는 기능이에요!</div>}

      <h2 className={styles.title}>댓글 {count}개</h2>

      <div className={styles.inputRow}>
        <div className={styles.avatar} />
        <div className={styles.inputCol}>
          <input
            className={styles.input}
            placeholder="댓글 다는 중 ㅋ"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            disabled={posting}
          />
          <div className={styles.underline} />
        </div>
      </div>

      <div className={styles.list}>
        {loading ? null : null}

        {items.map((c) => (
          <div key={c.id} className={styles.item}>
            <div className={styles.avatar} />

            <div className={styles.content}>
              <div className={styles.name}>{c.name}</div>
              <p className={styles.body}>{c.body}</p>
            </div>

            <div className={styles.menuWrap} onClick={(e) => e.stopPropagation()}>
              {c.check ? (
                <>
                  <button
                    type="button"
                    className={styles.kebab}
                    onClick={() => setOpenMenuId((p) => (p === c.id ? null : c.id))}
                    aria-label="댓글 메뉴"
                  >
                    ⋮
                  </button>

                  {openMenuId === c.id && (
                    <div className={styles.menu}>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => onDelete(c.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.kebabPlaceholder} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
