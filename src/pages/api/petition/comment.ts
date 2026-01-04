// 청원에 댓글을 작성하기 위한 API 핸들러

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
    // 백엔드한테 댓글 작성 요청, 쿠키 포함(로그인 한 사람만 가능하게게)
    // req.body는 댓글 내용, 청원 id 등 (프론트에서 보낸 데이터)
    const r = await axios.post(`${base}/petition/comment`, req.body, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });
    
    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
