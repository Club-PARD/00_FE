// 얘로 현재 요청한 사용자가 누군지 서버에 물어보고 로그인 상태면 사용자 정보를 반환함
// UI를 로그인 상태에 맞게 바꾸기 위해 사용

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const r = await axios.get(`${serverBase}/user/me`, {
      headers: { cookie: req.headers.cookie || "" },
      withCredentials: true,
      validateStatus: () => true,
    });

    res.status(r.status).json(r.data ?? null);
  } catch {
    res.status(500).send("me error");
  }
}



