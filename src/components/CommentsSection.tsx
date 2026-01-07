import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/CommentsSection.module.css";
import api from "@/lib/axios"; // ✅ 핵심


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
  return typeof v === "string" ? v : fallback;
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
  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  const count = useMemo(() => items.length, [items.length]);

  const showLoginToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  const fetchComments = async () => {
    if (!petitionId) return;
    setLoading(true);
    try {
      const r = await api.get(`/api/petition/comment/${petitionId}`, {
        validateStatus: () => true,
      });
      if (r.status >= 200 && r.status < 300) setItems(normalizeComments(r.data));
      else setItems([]);
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
      const r = await api.post(
        `/api/petition/comment`,
        { id: petitionId, body },
        { validateStatus: () => true }
      );

      if (r.status === 401 || r.status === 402) {
        showLoginToast();
        setDraft(body);
        return;
      }

      if (r.status < 200 || r.status >= 300) {
        setDraft(body);
        return;
      }

      await fetchComments();
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
      const r = await api.delete(`/api/petition/comment/${commentId}`, {
        validateStatus: () => true,
      });

      if (r.status === 401 || r.status === 402) {
        showLoginToast();
        setItems(prev);
        return;
      }

      if (r.status < 200 || r.status >= 300) setItems(prev);
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
            placeholder="댓글을 입력하세요"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            disabled={posting}
          />
          <div className={styles.underline} />
        </div>
      </div>

      <div className={styles.list}>
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
                    className={styles.kebab}
                    onClick={() => setOpenMenuId((p) => (p === c.id ? null : c.id))}
                  >
                    ⋮
                  </button>

                  {openMenuId === c.id && (
                    <div className={styles.menu}>
                      <button
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
