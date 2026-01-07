// pages/mypage/manual-new.tsx
import type { NextPage } from "next";
import { useState } from "react";
import Header from "@/components/Header";
import styles from "@/styles/Mypage.module.css"; // 디자인 상관없다 했으니 아무거나 or 새로 만들어도 됨
import { postPetitionNew, type PetitionCreateRequest } from "@/lib/api/manual";

const ManualNewPage: NextPage = () => {
  const [form, setForm] = useState<PetitionCreateRequest>({
    title: "",
    petitionNeeds: "",
    petitionSummary: "",
    status: 0,
    category: "",
    voteStartDate: "",
    voteEndDate: "",
    result: "-",
    allows: 0,
    body: "",
    type: 0,
    good: 0,
    bad: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string>("");

  const setField = <K extends keyof PetitionCreateRequest>(key: K, value: PetitionCreateRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    setResultMsg("");
    if (submitting) return;

    // 최소 검증 (필요한 것만)
    if (!form.title.trim()) return setResultMsg("title은 필수입니다.");
    if (!form.petitionNeeds.trim()) return setResultMsg("petitionNeeds(청원 개요)는 필수입니다.");
    if (!form.petitionSummary.trim()) return setResultMsg("petitionSummary는 필수입니다.");
    if (!form.category.trim()) return setResultMsg("category는 필수입니다.");
    if (!form.voteStartDate.trim() || !form.voteEndDate.trim())
      return setResultMsg("voteStartDate / voteEndDate는 필수입니다.");
    if (!form.body.trim()) return setResultMsg("body(본문)는 필수입니다.");

    setSubmitting(true);
    try {
      const data = await postPetitionNew(form);
      setResultMsg(`✅ 등록 성공: ${JSON.stringify(data)}`);
    } catch (e: any) {
      // axios 에러 메시지 최대한 보기 쉽게
      const status = e?.response?.status;
      const msg = e?.response?.data ? JSON.stringify(e.response.data) : e?.message;
      setResultMsg(`❌ 등록 실패${status ? ` (${status})` : ""}: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingTop: 72 }}>
      <Header />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ margin: "0 0 16px" }}>청원24 수동 등록</h1>
        <p style={{ margin: "0 0 24px", color: "#555" }}>
          아래 입력값을 서버 <code>POST /new</code>로 전송합니다. (토큰은 axios 인터셉터가 자동 첨부)
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <label>
            title
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            petitionNeeds (청원 개요)
            <input
              value={form.petitionNeeds}
              onChange={(e) => setField("petitionNeeds", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            petitionSummary
            <input
              value={form.petitionSummary}
              onChange={(e) => setField("petitionSummary", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            status (0/1/2)
            <select
              value={form.status}
              onChange={(e) => setField("status", Number(e.target.value))}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            >
              <option value={0}>0 (진행)</option>
              <option value={1}>1 (심사)</option>
              <option value={2}>2 (종료)</option>
            </select>
          </label>

          <label>
            category
            <input
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            voteStartDate (예: 2025-11-12T15:00:00)
            <input
              value={form.voteStartDate}
              onChange={(e) => setField("voteStartDate", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
              placeholder="2025-11-12T15:00:00"
            />
          </label>

          <label>
            voteEndDate (예: 2025-11-12T15:00:00)
            <input
              value={form.voteEndDate}
              onChange={(e) => setField("voteEndDate", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
              placeholder="2025-11-12T15:00:00"
            />
          </label>

          <label>
            result (비면 '-'로 처리)
            <input
              value={form.result}
              onChange={(e) => setField("result", e.target.value)}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            allows (동의자 수)
            <input
              type="number"
              value={form.allows}
              onChange={(e) => setField("allows", Number(e.target.value))}
              style={{ width: "100%", height: 40, padding: "0 10px" }}
            />
          </label>

          <label>
            body (본문)
            <textarea
              value={form.body}
              onChange={(e) => setField("body", e.target.value)}
              style={{ width: "100%", minHeight: 160, padding: 10 }}
            />
          </label>

          {/* 서버에서 고정값 요구하면 보여주기만 하고 수정 막아도 됨 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <label>
              type (고정이면 0)
              <input
                type="number"
                value={form.type ?? 0}
                onChange={(e) => setField("type", Number(e.target.value))}
                style={{ width: "100%", height: 40, padding: "0 10px" }}
              />
            </label>
            <label>
              good (고정이면 0)
              <input
                type="number"
                value={form.good ?? 0}
                onChange={(e) => setField("good", Number(e.target.value))}
                style={{ width: "100%", height: 40, padding: "0 10px" }}
              />
            </label>
            <label>
              bad (고정이면 0)
              <input
                type="number"
                value={form.bad ?? 0}
                onChange={(e) => setField("bad", Number(e.target.value))}
                style={{ width: "100%", height: 40, padding: "0 10px" }}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            style={{
              height: 44,
              borderRadius: 8,
              border: "none",
              background: "#6a3df6",
              color: "#fff",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {submitting ? "전송 중..." : "서버로 등록하기 (POST /new)"}
          </button>

          {resultMsg && (
            <pre
              style={{
                background: "#111",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                whiteSpace: "pre-wrap",
                overflowX: "auto",
              }}
            >
              {resultMsg}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManualNewPage;