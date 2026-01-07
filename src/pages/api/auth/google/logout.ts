import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!BACKEND) return res.status(500).json({ message: "SERVER_BASE_URL not set" });

  try {
    const cookie = req.headers.cookie ?? "";

    const r = await fetch(`${BACKEND}/auth/google/logout`, {
      method: "POST",
      headers: cookie ? { cookie } : {},
    });

    // 🔑 백엔드가 내려준 Set-Cookie(세션 만료) 그대로 전달
    const setCookie = r.headers.get("set-cookie");
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    res.status(r.status).end();
  } catch (e) {
    res.status(502).json({ message: "Bad Gateway", error: String(e) });
  }
}
