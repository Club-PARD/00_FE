import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const nickname = typeof req.query.nickname === "string" ? req.query.nickname : "";
  if (!nickname) return res.status(400).send("Invalid nickname");

  try {
    const r = await axios.get(`${base}/user/check/${encodeURIComponent(nickname)}`, {
      validateStatus: () => true,
      maxRedirects: 0,
    });
    return res.status(r.status).json(r.data ?? null);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
