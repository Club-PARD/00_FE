// 구글 OAuth2 로그인 요청을 백엔드로 리다이렉트하는 API 핸들러 -> 사용자가 구글 로그인 화면으로

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;
  if (!serverBase) return res.status(500).send("SERVER_BASE_URL is not set");

  // 현재 요청의 Origin 추출, 로그인 끝나고 돌아올 때 사용
  const origin = req.headers.origin;

  // 백엔드의 구글 OAuth2 인증 URL로 리다이렉트, 쿼리 파라미터로 origin 전달
  res.redirect(
    302,
    `${serverBase}/oauth2/authorization/google?redirect_origin=${encodeURIComponent(
      origin ?? ""
    )}`
  );
}
