import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;
  const code = typeof req.query.code === "string" ? req.query.code : "";

  // SERVER_BASE_URL이 설정되지 않은 경우 500 에러 반환
  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }
  // code 쿼리 파라미터가 없으면 400 에러 반환
  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  try {
    // 서버에 구글 코드 전달하여 인증 처리
    const r = await axios.get(`${serverBase}/auth/google/callback`, {
      params: { code },
      maxRedirects: 0,
      validateStatus: () => true, // 300, 302도 에러로 던지지 말고 응답으로 받기 위해
    });

    // 서버가 Set-Cookie를 줬으면 그 쿠키를 그대로 브라우저 응답에 실음 -> 서버, 브라우저 모두 로그인 상태 유지
    const setCookie = r.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    // 기존 유저는 메인페이지
    if (r.status === 300) {
      res.redirect(302, "/");
      return;
    }

    // 신규 유저는 회원가입 페이지
    if (r.status === 302) {
      res.redirect(302, "/signup");
      return;
    }

    // 그 외의 경우에는 에러로 간주
    res.status(r.status).send(r.data ?? "Auth callback failed");
  } catch {
    res.status(500).send("Auth callback error");
  }
}
