// 청원에 대한 좋아요, 싫어요 액션을 처리하는 API 핸들러

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  // POST 메서드만 허용
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  try {
    // 백엔드에 좋아요/싫어요 요청 전달(1: 좋아요, -1: 싫어요), 쿠키 포함
    const r = await axios.post(`${base}/petition/likes`, req.body, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });
    // 성공 시 다시 /api/petition/{id} 호출해서 숫자갱신
    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
