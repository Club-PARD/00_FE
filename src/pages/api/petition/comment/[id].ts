import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  const id = Number(idRaw);
  if (!idRaw || Number.isNaN(id)) return res.status(400).send("Invalid id");

  if (req.method === "GET") {
    try {
      const r = await axios.get(`${base}/petition/comment/${id}`, {
        headers: { cookie: req.headers.cookie ?? "" },
        validateStatus: () => true,
      });
      return res.status(r.status).json(r.data ?? []);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message ?? "proxy error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const r = await axios.delete(`${base}/petition/comment/${id}`, {
        headers: { cookie: req.headers.cookie ?? "" },
        validateStatus: () => true,
      });
      return res.status(r.status).json(r.data ?? null);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message ?? "proxy error" });
    }
  }

  res.setHeader("Allow", "GET, DELETE");
  return res.status(405).end();
}

