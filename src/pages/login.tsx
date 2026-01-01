import styles from "@/styles/Login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>로그인</h1>

      <section className={styles.card}>
        <p className={styles.quote}>
          “ 정책 참여가 쉬워지는 곳, 모라! ”
        </p>

        <p className={styles.desc}>
          Google 계정으로 로그인 후
          <br />
          어떤 정책이 있는지 둘러볼까요?
        </p>
        
        <button
          className={styles.googleBtn}
          type="button"
          onClick={() => {
            window.location.href = "/api/login"; //login.ts로 GET을 보냄, 
          }}
        >
          <span className={styles.googleIcon} aria-hidden />
          Google 계정으로 로그인
        </button>
      </section>
    </main>
  ); 
}

