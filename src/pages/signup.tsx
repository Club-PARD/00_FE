import { useMemo, useState, useEffect } from "react";
import styles from "@/styles/Signup.module.css";
import { useRouter } from "next/router";
import api from "@/lib/axios";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [checking, setChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    const q = router.query.email;
    const emailFromQuery = typeof q === "string" ? q : "";
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [router.query.email]);

  useEffect(() => {
    if (email) return;

    api
      .get("/user/me", { validateStatus: () => true })
      .then((r) => {
        if (r.status === 200 && r.data?.email) setEmail(String(r.data.email));
      })
      .catch(() => {});
  }, [email]);

  const trimmed = useMemo(() => name.trim(), [name]);
  const trimmedEmail = useMemo(() => email.trim(), [email]);

  const canSubmit = useMemo(
    () => !!trimmed && !!trimmedEmail && !isDuplicate && !submitting && !checking,
    [trimmed, trimmedEmail, isDuplicate, submitting, checking]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touched) setTouched(true);
    if (submitError) setSubmitError("");
  };

  const checkDuplicate = async (nickname: string) => {
    if (!nickname) return;

    try {
      setChecking(true);

      const r = await api.get(`/user/check/${encodeURIComponent(nickname)}`, {
        validateStatus: () => true,
      });

      if (r.status === 302) setIsDuplicate(true);
      else if (r.status === 200) setIsDuplicate(false);
      else setIsDuplicate(false);
    } finally {
      setChecking(false);
    }
  };

  const onBlurName = async () => {
    setTouched(true);
    if (!trimmed) return;
    await checkDuplicate(trimmed);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      await api.post(
        "/user/signUp",
        {
          name: trimmed,
          email: trimmedEmail,
          age: 0,
          status: 0,
        },
        { validateStatus: (s) => s >= 200 && s < 400 }
      );

      router.replace("/");
    } catch {
      setSubmitError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>회원가입</h1>

      <section aria-label="회원가입 카드">
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.text}>이메일</div>
          <div className={styles.inputWrap}>
            <input className={styles.input} value={trimmedEmail} readOnly disabled aria-label="이메일 표시" />
          </div>

          <div className={styles.text}>닉네임</div>
          <div className={styles.inputWrap}>
            <input
              className={`${styles.input} ${isDuplicate ? styles.inputError : ""}`}
              value={name}
              onChange={onChange}
              onBlur={onBlurName}
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
