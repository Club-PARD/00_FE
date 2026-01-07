import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  try {
    const auth = req.headers.authorization ?? "";

    const r = await axios.post(`${base}/petition/comment`, req.body, {
      headers: {
        authorization: auth,              
        cookie: req.headers.cookie ?? "",
      },
      validateStatus: () => true,
    });

    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "proxy error" });
  }
}
