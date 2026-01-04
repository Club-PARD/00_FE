import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;

  if (!base) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  try {
    const r = await axios.post(`${base}/auth/google/logout`, null, {
      headers: { cookie: req.headers.cookie ?? "" },
      validateStatus: () => true,
    });

    const setCookie = r.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    res.status(200).end();
  } catch {
    res.status(500).send("logout error");
  }
}
