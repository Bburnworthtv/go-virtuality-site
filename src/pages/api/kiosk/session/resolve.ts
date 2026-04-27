import type { NextApiRequest, NextApiResponse } from "next";

import { findKioskSession, isValidKioskSessionToken } from "@/lib/kioskSession";
import { applyRateLimit, getClientIpAddress } from "@/lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = getClientIpAddress(
    req.headers["x-forwarded-for"],
    req.socket.remoteAddress
  );
  const limit = applyRateLimit({
    key: `kiosk-resolve:${clientIp}`,
    limit: 12,
    windowMs: 60 * 1000
  });

  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));
  res.setHeader("Retry-After", String(limit.retryAfterSeconds));

  if (!limit.allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const { session_token } = req.body as { session_token?: string };
    const normalizedToken = session_token?.trim().toUpperCase() || "";

    if (!normalizedToken || !isValidKioskSessionToken(normalizedToken)) {
      return res.status(400).json({ error: "session_token is required" });
    }

    const session = await findKioskSession(normalizedToken);

    if (!session) {
      return res.status(404).json({ error: "Invalid or expired discharge code" });
    }

    return res.status(200).json({
      success: true,
      patient_id: session.metadata.patient_id,
      patient_name: session.metadata.patient_name,
      session_token: normalizedToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
