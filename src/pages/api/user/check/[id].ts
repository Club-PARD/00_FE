import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serverBase = process.env.SERVER_BASE_URL;

  if (!serverBase) {
    res.status(500).send("SERVER_BASE_URL is not set");
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }

  const idRaw = typeof req.query.id === "string" ? req.query.id : "";
  const idNum = Number(idRaw);

  if (!idRaw || Number.isNaN(idNum)) {
    res.status(400).send("Invalid id");
    return;
  }

  try {
    const r = await axios.get(`${serverBase}/user/check/${idNum}`, {
      headers: { cookie: req.headers.cookie || "" },
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: () => true,
    });

    res.status(r.status).json(r.data ?? {});
  } catch {
    res.status(500).send("Check error");
  }
}
