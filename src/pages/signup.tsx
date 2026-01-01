import { useMemo, useState } from "react";
import styles from "@/styles/Signup.module.css";

const DUPLICATE_NAMES = new Set(["고길동"]);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = useMemo(() => name.trim(), [name]);

  const isDuplicate = useMemo(() => {
    if (!touched) return false;
    if (!trimmed) return false;
    return DUPLICATE_NAMES.has(trimmed);
  }, [touched, trimmed]);

  const canSubmit = useMemo(() => !!trimmed && !isDuplicate, [trimmed, isDuplicate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touched) setTouched(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    console.log("signup name:", trimmed);
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
