// OAuth흐름을 시작하는 API 핸들러, 사용자를 백엔드의 구글 인증 페이지로 리다이렉트시키는 역할을 함

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  // 현재 요청이 들어온 프론트 주소를 동적으로 계산
  const origin = `${req.headers["x-forwarded-proto"] ?? "http"}://${req.headers.host}`; 
  // 구글 로그인 후 리다이렉트될 URI 설정
  const redirectUri = `${origin}/api/google/callback`;

  // 백엔드의 구글 OAuth2 인증 URL 생성 -> 이 주소로 가면 구글 로그인 페이지로 리다이렉트됨
  const url = new URL(`${base}/oauth2/authorization/google`);
  // 구글 로그인 후 돌아올 리다이렉트 URI를 쿼리 파라미터로 설정
  url.searchParams.set("redirect_uri", redirectUri);


  res.redirect(302, url.toString());
}
