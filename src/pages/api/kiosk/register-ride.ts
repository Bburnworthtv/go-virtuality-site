import type { NextApiRequest, NextApiResponse } from "next";

import {
  findKioskSession,
  isValidKioskSessionToken,
  markKioskSessionUsed
} from "@/lib/kioskSession";
import { normalizeSouthAfricanPhone } from "@/lib/phone";
import { applyRateLimit, getClientIpAddress } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabaseClient";

type Payload = {
  session_token?: string;
  patient_name?: string;
  patient_id_last4?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
  consent_confirmed?: boolean;
};

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
    key: `kiosk-register:${clientIp}`,
    limit: 8,
    windowMs: 5 * 60 * 1000
  });

  res.setHeader("X-RateLimit-Remaining", String(limit.remaining));
  res.setHeader("Retry-After", String(limit.retryAfterSeconds));

  if (!limit.allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const {
      session_token,
      patient_name,
      patient_id_last4,
      guardian_name,
      guardian_phone,
      guardian_relationship,
      consent_confirmed
    } = req.body as Payload;

    if (!guardian_name?.trim()) {
      return res.status(400).json({ error: "guardian_name is required" });
    }

    const normalizedPhone = normalizeSouthAfricanPhone(guardian_phone || "");

    if (!normalizedPhone) {
      return res.status(400).json({
        error: "guardian_phone must be a valid South African mobile number"
      });
    }

    if (!consent_confirmed) {
      return res.status(400).json({ error: "consent_confirmed is required" });
    }

    const normalizedIdLast4 = patient_id_last4?.replace(/\D/g, "") || "";

    if (!session_token?.trim() || !isValidKioskSessionToken(session_token)) {
      return res.status(400).json({ error: "A valid session_token is required" });
    }

    let matchedPatient:
      | {
          id: string;
          name: string;
          status?: string;
          id_last4?: string | null;
        }
      | null
      | undefined;
    let sessionAuditLogId: string | null = null;

    const session = await findKioskSession(session_token);

    if (session) {
      sessionAuditLogId = session.id;
      matchedPatient = {
        id: session.metadata.patient_id || "",
        name: session.metadata.patient_name || "Unknown patient"
      };
    }

    if (!matchedPatient) {
      await supabase.from("audit_logs").insert({
        action: "kiosk_ride_request_unmatched",
        entity: "patients",
        metadata: {
          patient_name: patient_name?.trim() || null,
          patient_id_last4: normalizedIdLast4 || null,
          guardian_name: guardian_name.trim(),
          guardian_phone: normalizedPhone
        }
      });

      return res.status(202).json({
        success: false,
        matched: false,
        error: "Invalid or expired discharge code"
      });
    }

    const { data: existingGuardian } = await supabase
      .from("guardians")
      .select("id")
      .eq("patient_id", matchedPatient.id)
      .eq("phone_number", normalizedPhone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const guardianPayload = {
      patient_id: matchedPatient.id,
      full_name: guardian_name.trim(),
      relationship: guardian_relationship?.trim() || "Ride Contact",
      phone_number: normalizedPhone
    };

    const { data: guardian, error: guardianError } = existingGuardian?.id
      ? await supabase
          .from("guardians")
          .update(guardianPayload)
          .eq("id", existingGuardian.id)
          .select("id")
          .single()
      : await supabase
          .from("guardians")
          .insert(guardianPayload)
          .select("id")
          .single();

    if (guardianError || !guardian) {
      return res.status(500).json({ error: "Failed to save ride contact" });
    }

    const { data: existingConsent } = await supabase
      .from("consents")
      .select("id")
      .eq("guardian_id", guardian.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existingConsent?.id) {
      await supabase.from("consents").insert({
        guardian_id: guardian.id,
        consent_given: true
      });
    }

    await supabase.from("audit_logs").insert({
      action: "kiosk_ride_request",
      entity: "patients",
      metadata: {
        patient_id: matchedPatient.id,
        patient_name: matchedPatient.name,
        guardian_id: guardian.id,
        guardian_name: guardian_name.trim(),
        guardian_phone: normalizedPhone
      }
    });

    if (sessionAuditLogId) {
      await markKioskSessionUsed(sessionAuditLogId);
    }

    return res.status(200).json({
      success: true,
      matched: true
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
