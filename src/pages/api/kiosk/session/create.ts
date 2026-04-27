import type { NextApiRequest, NextApiResponse } from "next";

import {
  buildKioskSessionExpiry,
  generateKioskSessionToken,
  hashKioskSessionToken
} from "@/lib/kioskSession";
import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAuth(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { patient_id } = req.body as { patient_id?: string };

    if (!patient_id?.trim()) {
      return res.status(400).json({ error: "patient_id is required" });
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, name, status")
      .eq("id", patient_id.trim())
      .maybeSingle();

    if (patientError) {
      return res.status(500).json({ error: "Failed to load patient" });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const sessionToken = generateKioskSessionToken();
    const expiresAt = buildKioskSessionExpiry();

    const { error: auditError } = await supabase.from("audit_logs").insert({
      action: "kiosk_session_created",
      entity: "patients",
      metadata: {
        patient_id: patient.id,
        patient_name: patient.name,
        session_token_hash: hashKioskSessionToken(sessionToken),
        session_token_hint: sessionToken.slice(-4),
        expires_at: expiresAt,
        used_at: null
      }
    });

    if (auditError) {
      return res.status(500).json({ error: "Failed to create kiosk session" });
    }

    return res.status(200).json({
      success: true,
      patient_name: patient.name,
      session_token: sessionToken,
      expires_at: expiresAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
