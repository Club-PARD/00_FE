// 현재 요청에 포함된 쿠키를 확인하기 위한 디버깅 전용 API 핸들러
//쿠키가 없을 경우 빈 문자열 반환 / 쿠키가 있으면 해당 쿠키 문자열 반환
// 로그인 문제 생길 때 쿠키가 제대로 오가는지 확인하는 용도로 만듦

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    cookie: req.headers.cookie ?? "",
  });
}
