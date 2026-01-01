import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const r = await axios.post(`${serverBase}/auth/google/signUp`, req.body, {
      headers: {
        cookie: req.headers.cookie || "",
      },
      withCredentials: true,
      validateStatus: () => true,
    });

    const setCookie = r.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    res.status(r.status).json(r.data ?? {});
  } catch {
    res.status(500).send("Signup error");
  }
}
