import axios from "axios";

import { normalizeSouthAfricanPhone } from "@/lib/phone";

const AT_API_KEY = process.env.AT_API_KEY!;
const AT_USERNAME = process.env.AT_USERNAME!;
const AT_REQUEST_TIMEOUT_MS = Number(process.env.AT_REQUEST_TIMEOUT_MS || 10000);
const AT_SMS_MAX_RETRIES = Math.max(
  1,
  Number(process.env.AT_SMS_MAX_RETRIES || 2)
);
const AT_FALLBACK_DELAY_MS = Math.max(
  0,
  Number(process.env.AT_FALLBACK_DELAY_MS || 1500)
);
const AT_SMS_URL =
  AT_USERNAME === "sandbox"
    ? "https://api.sandbox.africastalking.com/version1/messaging"
    : "https://api.africastalking.com/version1/messaging";

type MessagingResult = {
  channel: "whatsapp" | "sms";
  status: "sent" | "failed";
  messageId: string | null;
  deliveryAttempts: number;
  errorReason?: string;
};

function normalizePhone(phone: string): string {
  const normalized = normalizeSouthAfricanPhone(phone);

  if (!normalized) {
    throw new Error("Invalid SA phone number");
  }

  return normalized;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendSMSAttempt(phone: string, message: string) {
  try {
    const response = await axios.post(
      AT_SMS_URL,
      new URLSearchParams({
        username: AT_USERNAME,
        to: phone,
        message
      }),
      {
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: AT_REQUEST_TIMEOUT_MS
      }
    );

    const recipient = response.data?.SMSMessageData?.Recipients?.[0];
    const providerStatus = String(recipient?.status || "").toLowerCase();
    const delivered = !providerStatus.includes("fail");

    return {
      delivered,
      messageId: recipient?.messageId || null,
      errorReason: delivered ? undefined : recipient?.status
    };
  } catch (error: any) {
    const reason = error?.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("SMS error:", reason);

    return {
      delivered: false,
      messageId: null,
      errorReason: reason
    };
  }
}

export async function sendSMS(phone: string, message: string) {
  let lastError = "Unknown SMS error";

  for (let attempt = 1; attempt <= AT_SMS_MAX_RETRIES; attempt += 1) {
    const result = await sendSMSAttempt(phone, message);

    if (result.delivered) {
      return {
        delivered: true,
        messageId: result.messageId,
        attempts: attempt
      };
    }

    lastError = result.errorReason || lastError;

    if (attempt < AT_SMS_MAX_RETRIES) {
      await delay(500 * attempt);
    }
  }

  return {
    delivered: false,
    messageId: null,
    attempts: AT_SMS_MAX_RETRIES,
    errorReason: lastError
  };
}

export async function sendWhatsApp(phone: string, message: string) {
  console.log("WhatsApp placeholder:", phone, message);

  return {
    delivered: false,
    messageId: null,
    errorReason: "WhatsApp integration not configured"
  };
}

export async function sendNotification({
  phone,
  message
}: {
  phone: string;
  message: string;
}): Promise<MessagingResult> {
  const normalizedPhone = normalizePhone(phone);
  const wa = await sendWhatsApp(normalizedPhone, message);

  if (wa.delivered) {
    return {
      channel: "whatsapp",
      status: "sent",
      messageId: wa.messageId,
      deliveryAttempts: 1
    };
  }

  if (AT_FALLBACK_DELAY_MS > 0) {
    await delay(AT_FALLBACK_DELAY_MS);
  }

  const sms = await sendSMS(normalizedPhone, message);

  return {
    channel: "sms",
    status: sms.delivered ? "sent" : "failed",
    messageId: sms.messageId,
    deliveryAttempts: sms.attempts,
    errorReason: sms.errorReason
  };
}
