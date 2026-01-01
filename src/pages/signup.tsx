import { useMemo, useState } from "react";
import axios from "axios";
import styles from "@/styles/Signup.module.css";

const DUPLICATE_NAMES = new Set(["고길동"]);

export default function SignupPage() {
  const [name, setName] = useState(""); // 사용자가 입력하는 닉네임
  const [touched, setTouched] = useState(false); // 사용자가 한 번이라도 입력창을 건드렸는지
  const [submitting, setSubmitting] = useState(false); // 회원가입 요청 중인지
  const [submitError, setSubmitError] = useState(""); // 서버 요청 실패시 보여줄 에러 메시지

  const trimmed = useMemo(() => name.trim(), [name]); // 앞뒤 공백 제거한 닉네임

  const isDuplicate = useMemo(() => {
    if (!touched) return false;
    if (!trimmed) return false;
    return DUPLICATE_NAMES.has(trimmed);
  }, [touched, trimmed]);

  // 회원가입 버튼 눌러도 되는지(조건 충족하는지)
  const canSubmit = useMemo(
    () => !!trimmed && !isDuplicate && !submitting,
    [trimmed, isDuplicate, submitting]
  );

  // 입력창 변경 이벤트 핸들러 -> 입력값 변경 시 닉네임 업뎃함
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touched) setTouched(true);
    if (submitError) setSubmitError("");
  };

  // 회원가입 폼 제출 이벤트 핸들러(유효하지 않으면 서버 요청 안함)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      
      // 서버에 회원가입 요청
      await axios.post("/api/signup", {
        name: trimmed,
        age: 0,
        status: 0,
      });

      window.location.href = "/"; // 회원가입 성공 시 메인 페이지로 이동
    } catch {
      setSubmitError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>회원가입</h1>

      <section className={styles.card} aria-label="회원가입 카드">
        <p className={styles.quote}>“당신은 누구인가요?”</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputWrap}>
            <input
              className={`${styles.input} ${isDuplicate ? styles.inputError : ""}`}
              value={name}
              onChange={onChange}
              onBlur={() => setTouched(true)}
              placeholder="닉네임을 입력하세요."
              aria-label="닉네임 입력"
            />
            {isDuplicate && <span className={styles.errorIcon} aria-hidden />}
          </div>

          {isDuplicate && <p className={styles.errorText}>사용할 수 없는 닉네임입니다.</p>}
          {!isDuplicate && !!submitError && <p className={styles.errorText}>{submitError}</p>}

          <button
            type="submit"
            className={`${styles.submitBtn} ${canSubmit ? styles.submitActive : styles.submitDisabled}`}
            disabled={!canSubmit}
          >
            회원가입 완료하기
          </button>
        </form>
      </section>
    </div>
  );
}
