
import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!BACKEND) return res.status(500).json({ message: "SERVER_BASE_URL is not set" });

  // 허용 메서드
  if (req.method !== "GET") return res.status(405).end();

  try {
    // 브라우저가 보낸 쿠키를 그대로 백엔드에 전달
    const cookie = req.headers.cookie ?? "";

    const r = await fetch(`${BACKEND}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
    });

    const text = await r.text(); // 백엔드가 json이 아닐 수도 있으니 안전하게 text로 받고
    //  상태코드 그대로 전달
    res.status(r.status);
  
    try {
      const json = text ? JSON.parse(text) : null;
      return res.json(json);
    } catch {
      return res.send(text);
    }
  } catch (e) {
    return res.status(502).json({ message: "Bad Gateway", detail: String(e) });
  }
}
