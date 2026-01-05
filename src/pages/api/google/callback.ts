import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;
  const code = typeof req.query.code === "string" ? req.query.code : "";

  if (!serverBase) return res.status(500).send("SERVER_BASE_URL is not set");
  if (!code) return res.status(400).send("Missing code");

  try {
    const r = await axios.get(`${serverBase}/auth/google/callback`, {
      params: { code },
      maxRedirects: 0,
      validateStatus: () => true,
    });

    const setCookie = r.headers["set-cookie"];
    if (setCookie) {
      const patched = setCookie.map((c: string) =>
        c.replace(/;\s*Secure/gi, "").replace(/SameSite=None/gi, "SameSite=Lax")
      );
      res.setHeader("Set-Cookie", patched);
    }

    res.redirect(302, "/");
  } catch {
    res.redirect(302, "/login");
  }
}
