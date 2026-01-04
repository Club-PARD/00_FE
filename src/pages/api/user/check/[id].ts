// 회원가입 시 입력한 닉네임이 이미 사용중인지 확인하는 API 핸들러

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }

  // URL 파라미터에서 닉네임 id 추출 및 검증 -> 실제로 id는 닉네임 문자열
  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  if (!idRaw) {
    res.status(400).send("Invalid id");
    return;
  }
  
  try {
    const r = await axios.get(`${serverBase}/user/check/${encodeURIComponent(idRaw)}`, {
      maxRedirects: 0,
      validateStatus: () => true,
    });

    res.status(r.status).end();
  } catch (e: any) {
    res.status(500).send(e?.message ?? "Nickname check error");
  }
}
