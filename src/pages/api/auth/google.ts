import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.SERVER_BASE_URL;
  if (!base) return res.status(500).send("SERVER_BASE_URL is not set");

  const origin = `${req.headers["x-forwarded-proto"] ?? "http"}://${req.headers.host}`;
  const redirectUri = `${origin}/api/google/callback`;

  const url = new URL(`${base}/oauth2/authorization/google`);
  url.searchParams.set("redirect_uri", redirectUri);

  res.redirect(302, url.toString());
}
