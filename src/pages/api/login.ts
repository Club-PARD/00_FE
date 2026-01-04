import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;
  if (!serverBase) return res.status(500).send("SERVER_BASE_URL is not set");

  const origin = req.headers.origin;
  res.redirect(
    302,
    `${serverBase}/oauth2/authorization/google?redirect_origin=${encodeURIComponent(
      origin ?? ""
    )}`
  );
}
