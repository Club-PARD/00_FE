import { useMemo, useState } from "react";
import axios from "axios";
import styles from "@/styles/Signup.module.css";

const DUPLICATE_NAMES = new Set(["고길동"]);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const trimmed = useMemo(() => name.trim(), [name]);

  const isDuplicate = useMemo(() => {
    if (!touched) return false;
    if (!trimmed) return false;
    return DUPLICATE_NAMES.has(trimmed);
  }, [touched, trimmed]);

  const canSubmit = useMemo(
    () => !!trimmed && !isDuplicate && !submitting,
    [trimmed, isDuplicate, submitting]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touched) setTouched(true);
    if (submitError) setSubmitError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      await axios.post("/api/signup", {
        name: trimmed,
        age: 0,
        status: 0,
      });

      window.location.href = "/api/login";
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
