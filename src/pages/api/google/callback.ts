import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;
  const code = typeof req.query.code === "string" ? req.query.code : "";

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  try {
    const r = await axios.get(`${serverBase}/auth/google/callback`, {
      params: { code },
      maxRedirects: 0,
      validateStatus: () => true,
    });

    const setCookie = r.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    if (r.status === 300) {
      res.redirect(302, "/");
      return;
    }

    if (r.status === 302) {
      res.redirect(302, "/signup");
      return;
    }

    res.status(r.status).send(r.data ?? "Auth callback failed");
  } catch {
    res.status(500).send("Auth callback error");
  }
}
