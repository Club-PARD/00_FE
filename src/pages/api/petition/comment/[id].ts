import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;

  if (!base) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    res.status(405).end();
    return;
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!id) {
    res.status(400).send("Missing id");
    return;
  }

  try {
    const r = await axios.delete(`${base}/petition/comment/${id}`, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });

    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
