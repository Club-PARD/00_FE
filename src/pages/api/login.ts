import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  res.redirect(302, `${serverBase}/auth/google/login`);
}
