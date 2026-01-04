// 특정 청원 댓글을 삭제하는 API 핸들러
//DELETE /api/petition/comment/{id}로 요청하면 DELETE {SERVER_BASE_URL}/petition/comment/{id}로 받아서 처리
// 브라우저 쿠키도 함께 전달해서 인증된 사용자만 댓글 삭제 가능

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;

  if (!base) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  // DELETE 메서드만 허용
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    res.status(405).end();
    return;
  }

  // URL 파라미터에서 id 추출 및 검증
  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  const id = Number(idRaw);

  if (!idRaw || Number.isNaN(id)) {
    res.status(400).send("Invalid id");
    return;
  }

  try {
    // 백엔드 서버로 DELETE 요청 전달, 쿠키 포함, 로그인 여부, 권한 검사는 백엔드에서 처리함
    const r = await axios.delete(`${base}/petition/comment/${id}`, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });

    // 결과를 클라이언트에 그대로 전달
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
