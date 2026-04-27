import type { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";

import { normalizeSouthAfricanPhone } from "@/lib/phone";
import { constantTimeEquals, readHeaderValue } from "@/lib/security";
import { supabase } from "@/lib/supabaseClient";
import {
  createWebhookSignature,
  isWebhookTimestampFresh,
  normalizeSignature
} from "@/lib/webhookSignature";

export const config = {
  api: {
    bodyParser: false
  }
};

function mapStatus(status: string) {
  const normalizedStatus = status?.toLowerCase() ?? "";

  if (normalizedStatus.includes("delivered")) {
    return "delivered";
  }

  if (normalizedStatus.includes("success") || normalizedStatus.includes("sent")) {
    return "sent";
  }

  if (normalizedStatus.includes("failed")) {
    return "failed";
  }

  return "sent";
}

function statusRank(status: string) {
  switch (status) {
    case "delivered":
      return 3;
    case "failed":
      return 2;
    case "sent":
      return 1;
    default:
      return 0;
  }
}

function extractMessageId(payload: any): string | null {
  if (payload?.messageId) {
    return String(payload.messageId);
  }

  if (payload?.id) {
    return String(payload.id);
  }

  if (payload?.data?.messageId) {
    return String(payload.data.messageId);
  }

  return null;
}

function extractDeliveryStatus(payload: any): string | null {
  if (payload?.status) {
    return String(payload.status);
  }

  if (payload?.deliveryStatus) {
    return String(payload.deliveryStatus);
  }

  if (payload?.data?.status) {
    return String(payload.data.status);
  }

  return null;
}

function extractReply(payload: any): { from: string; text: string } | null {
  const from = payload?.from || payload?.msisdn || payload?.phoneNumber;
  const text = payload?.text || payload?.message || payload?.body;

  if (!from || !text) {
    return null;
  }

  return {
    from: String(from),
    text: String(text).trim()
  };
}

function classifyReply(text: string): "coming" | "delayed" | "call_me" | "other" {
  const normalized = text.trim().toLowerCase();

  if (normalized === "1" || normalized.includes("coming")) {
    return "coming";
  }

  if (normalized === "2" || normalized.includes("delay")) {
    return "delayed";
  }

  if (normalized === "3" || normalized.includes("call")) {
    return "call_me";
  }

  return "other";
}

function validateWebhookSignature(
  req: NextApiRequest,
  rawBody: string
): boolean {
  const expected = process.env.MESSAGING_WEBHOOK_SECRET;

  if (!expected) {
    console.error("MESSAGING_WEBHOOK_SECRET not configured");
    return false;
  }

  const timestamp = readHeaderValue(req.headers["x-webhook-timestamp"]);
  const signature = readHeaderValue(req.headers["x-webhook-signature"]);

  if (!timestamp || !signature || !isWebhookTimestampFresh(timestamp)) {
    return false;
  }

  const computed = createWebhookSignature(timestamp, rawBody, expected);
  return constantTimeEquals(normalizeSignature(signature), computed);
}

async function parseWebhookBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (Buffer.byteLength(rawBody, "utf8") > 64 * 1024) {
    throw new Error("Webhook payload too large");
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return {
      rawBody,
      parsedBody: JSON.parse(rawBody || "{}")
    };
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return {
      rawBody,
      parsedBody: querystring.parse(rawBody)
    };
  }

  throw new Error("Unsupported webhook content type");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { rawBody, parsedBody } = await parseWebhookBody(req);

    if (!validateWebhookSignature(req, rawBody)) {
      return res.status(401).send("Unauthorized");
    }

    const body = parsedBody;

    const messageId = extractMessageId(body);
    const incomingStatus = extractDeliveryStatus(body);

    if (messageId && incomingStatus) {
      const status = mapStatus(incomingStatus);
      const { data: existing, error: existingError } = await supabase
        .from("notifications")
        .select("id, status, delivery_attempts")
        .eq("gateway_message_id", messageId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingError) {
        console.error("Webhook lookup error:", existingError);
      }

      const currentStatus = existing?.status || "";
      const shouldUpdate =
        !currentStatus || statusRank(status) >= statusRank(currentStatus);

      if (shouldUpdate) {
        await supabase
          .from("notifications")
          .update({
            status,
            delivery_attempts: (existing?.delivery_attempts || 0) + 1,
            last_attempt_at: new Date().toISOString()
          })
          .eq("gateway_message_id", messageId);
      }

      return res.status(200).send("OK");
    }

    const reply = extractReply(body);

    if (reply) {
      const normalizedFrom = normalizeSouthAfricanPhone(reply.from);
      const replyType = classifyReply(reply.text);
      await supabase.from("audit_logs").insert({
        action: "guardian_reply",
        entity: "messages",
        metadata: {
          from: normalizedFrom || reply.from,
          text: reply.text,
          reply_type: replyType
        }
      });

      if (replyType === "coming" && normalizedFrom) {
        const { data: guardians } = await supabase
          .from("guardians")
          .select("id, patient_id")
          .eq("phone_number", normalizedFrom)
          .order("created_at", { ascending: false })
          .limit(3);

        const patientIds = (guardians ?? [])
          .map((guardian) => guardian.patient_id)
          .filter(Boolean);

        if (patientIds.length > 0) {
          await supabase
            .from("notifications")
            .update({
              status: "on_my_way",
              last_attempt_at: new Date().toISOString()
            })
            .in("patient_id", patientIds)
            .in("status", ["sent", "delivered"]);
        }
      }

      return res.status(200).send("RECEIVED");
    }

    return res.status(200).send("IGNORED");
  } catch (err) {
    console.error(err);
    return res.status(400).send("Invalid webhook");
  }
}
