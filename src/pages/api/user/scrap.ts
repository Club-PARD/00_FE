import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("X-Api-Hit", "pages-api-user-scrap");

  const auth = req.headers.authorization || "";

  const axiosOpt = {
    maxRedirects: 0,
    validateStatus: () => true,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  } as const;

  if (req.method === "GET") {
    const r = await axios.get(`${BASE}/user/scrap`, axiosOpt);

    if (r.status === 301 || r.status === 302) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    return res.status(r.status).json(r.data);
  }

  if (req.method === "DELETE") {
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

  const r = await axios.request({
    url: `${BASE}/user/scrap`,
    method: "DELETE",
    data: body,
    maxRedirects: 0,
    validateStatus: () => true,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });

  // ✅ 디버그용: 지금은 원인 잡아야 하니까 내려줌 (나중에 지워도 됨)
  if (r.status === 301 || r.status === 302) {
    return res.status(401).json({
      message: "로그인이 필요합니다.",
      backendStatus: r.status,
      backendLocation: r.headers?.location ?? null,
    });
  }

  return res.status(r.status).json({
    backendStatus: r.status,
    data: r.data,
  });
}
  

  res.setHeader("Allow", "GET, DELETE");
  return res.status(405).end();
}
