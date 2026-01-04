// 구글 OAuth2 로그아웃 요청을 백엔드로 전달하는 API 핸들러, 만료된 쿠키 브라우저에 설정

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;

  if (!base) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  // POST만 할거임
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  try {
    // 백엔드에 로그아웃 요청 전달, 쿠키 포함 -> 백엔드는 세션 무효화하고 만료된 쿠키를 응답헤더로 보냄
    const r = await axios.post(`${base}/auth/google/logout`, null, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });

    // 백엔드가 준 Set-Cookie전달, 브라우저에 만료된 쿠키 설정
    const setCookie = r.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    res.status(200).end();
  } catch {
    res.status(500).send("logout error");
  }
}
