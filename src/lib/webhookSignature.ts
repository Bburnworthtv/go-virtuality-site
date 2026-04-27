import crypto from "crypto";

export const WEBHOOK_MAX_AGE_MS = 5 * 60 * 1000;

export function normalizeSignature(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("sha256=")) {
    return trimmed.slice("sha256=".length);
  }

  return trimmed;
}

export function createWebhookSignature(timestamp: string, rawBody: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

export function isWebhookTimestampFresh(timestamp: string, now = Date.now()) {
  const parsed = Number(timestamp);

  if (!Number.isFinite(parsed)) {
    return false;
  }

  return Math.abs(now - parsed) <= WEBHOOK_MAX_AGE_MS;
}
