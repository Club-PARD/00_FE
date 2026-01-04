import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function NationalDetailTest() {
  const router = useRouter();
  const id = useMemo(() => (typeof router.query.id === "string" ? router.query.id : ""), [router.query.id]);

  const [detail, setDetail] = useState<any>(null);
  const [news, setNews] = useState<any>(null);
  const [laws, setLaws] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setErr("");
      try {
        const [d, n, l] = await Promise.all([
          fetch(`/api/petition/${id}`).then((r) => r.json()),
          fetch(`/api/petition/news/${id}`).then((r) => r.json()),
          fetch(`/api/petition/laws/${id}`).then((r) => r.json()),
        ]);
        setDetail(d);
        setNews(n);
        setLaws(l);
      } catch (e: any) {
        setErr(e?.message ?? "fetch error");
      }
    };

    run();
  }, [id]);

  if (!id) return <div style={{ padding: 20 }}>id 없음. /national/123 처럼 접속해</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>국회안건 상세 API 연결 테스트</h1>
      <div style={{ marginTop: 10, color: "crimson" }}>{err}</div>

      <h2 style={{ marginTop: 20 }}>GET /petition/{`{id}`}</h2>
      <pre>{JSON.stringify(detail, null, 2)}</pre>

      <h2 style={{ marginTop: 20 }}>GET /petition/news/{`{id}`}</h2>
      <pre>{JSON.stringify(news, null, 2)}</pre>

      <h2 style={{ marginTop: 20 }}>GET /petition/laws/{`{id}`}</h2>
      <pre>{JSON.stringify(laws, null, 2)}</pre>
    </div>
  );
}
