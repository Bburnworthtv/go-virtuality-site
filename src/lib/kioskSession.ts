import crypto from "crypto";

import { supabase } from "@/lib/supabaseClient";

const SESSION_ACTION = "kiosk_session_created";
const SESSION_TTL_MS = 1000 * 60 * 30;
const SESSION_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SESSION_LENGTH = 10;

type SessionMetadata = {
  patient_id?: string;
  patient_name?: string;
  session_token_hash?: string;
  session_token_hint?: string;
  expires_at?: string;
  used_at?: string | null;
};

export function generateKioskSessionToken(length = SESSION_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let token = "";

  for (let index = 0; index < length; index += 1) {
    token += SESSION_ALPHABET[bytes[index] % SESSION_ALPHABET.length];
  }

  return token;
}

export function buildKioskSessionExpiry() {
  return new Date(Date.now() + SESSION_TTL_MS).toISOString();
}

export function hashKioskSessionToken(sessionToken: string) {
  return crypto
    .createHash("sha256")
    .update(sessionToken.trim().toUpperCase())
    .digest("hex");
}

export function isValidKioskSessionToken(sessionToken: string) {
  return /^[A-Z2-9]{10}$/.test(sessionToken.trim().toUpperCase());
}

export async function findKioskSession(sessionToken: string) {
  const normalizedToken = sessionToken.trim().toUpperCase();
  const hashedToken = hashKioskSessionToken(normalizedToken);

  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, metadata, created_at")
    .eq("action", SESSION_ACTION)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    throw error;
  }

  const now = Date.now();

  const match = (data ?? []).find((entry) => {
    const metadata = (entry.metadata || {}) as SessionMetadata;
    const expiresAt = metadata.expires_at ? Date.parse(metadata.expires_at) : 0;

    return (
      metadata.session_token_hash === hashedToken &&
      Boolean(metadata.patient_id) &&
      !metadata.used_at &&
      expiresAt > now
    );
  });

  if (!match) {
    return null;
  }

  return {
    id: match.id,
    metadata: (match.metadata || {}) as SessionMetadata
  };
}

export async function markKioskSessionUsed(sessionAuditLogId: string) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, metadata")
    .eq("id", sessionAuditLogId)
    .maybeSingle();

  if (error || !data) {
    return;
  }

  const metadata = (data.metadata || {}) as SessionMetadata;

  await supabase
    .from("audit_logs")
    .update({
      metadata: {
        ...metadata,
        used_at: new Date().toISOString()
      }
    })
    .eq("id", sessionAuditLogId);
}
