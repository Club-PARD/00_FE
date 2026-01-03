import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  // SERVER_BASE_URL이 설정되지 않은 경우 500 에러 반환
  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const r = await axios.post(`${serverBase}/user/signUp`, req.body, { //req.body: { name, age, status }
      headers: {
        cookie: req.headers.cookie || "", //쿠키가 있으면 쿠키를, 없으면 빈 문자열을 서버로 보냄
      },
      withCredentials: true,
      maxRedirects: 0, 
      validateStatus: () => true,
    });

    // 백엔드가 Set-Cookie를 줬으면 그 쿠키를 그대로 브라우저 응답에 실음
    const setCookie = r.headers["set-cookie"]; // 서버 응답 헤더 중에서 Set-Cookie에 해당하는 값을 꺼내서 setCookie 변수에 저장(-이 있어서 .이 아니라 대괄호 표기법 사용했음)
    if (setCookie) res.setHeader("Set-Cookie", setCookie); // 서버 응답 헤더에 Set-Cookie(백엔드가 준 쿠키)를 넣음 -> 브라우저가 이 응답을 받으면 쿠키를 저장

    res.status(r.status).json(r.data ?? {});
  } catch {
    res.status(500).send("Signup error");
  }
}
