// 좋아요 겟

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  const id = Number(idRaw);

  if (!idRaw || Number.isNaN(id)) return res.status(400).send("Invalid id");

  try {
    const r = await axios.get(`${base}/petition/likes/${id}`, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });
    return res.status(r.status).json(r.data ?? null);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
