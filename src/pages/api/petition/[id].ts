// 특정 청원 하나의 상세 정보를 가져오는 API 핸들러

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  // URL 파라미터에서 청원 id 추출 및 검증
  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  const id = Number(idRaw);
  if (!idRaw || Number.isNaN(id)) return res.status(400).send("Invalid id");

  try {
    // 백엔드한테 청원 상세 요청, 쿠키 포함
    const r = await axios.get(`${base}/petition/${id}`, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });
    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
