import type { NextApiRequest, NextApiResponse } from "next";
import { constantTimeEquals, readHeaderValue } from "@/lib/security";

export function requireAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  const expected = process.env.DASHBOARD_API_SECRET;

  if (!expected) {
    console.error("DASHBOARD_API_SECRET not configured");
    res.status(500).json({ error: "Server misconfigured" });
    return false;
  }

  const provided = readHeaderValue(req.headers["x-api-key"]);

  if (!provided || !constantTimeEquals(provided, expected)) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}
