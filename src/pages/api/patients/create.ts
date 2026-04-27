import type { NextApiRequest, NextApiResponse } from "next";

import { normalizeSouthAfricanPhone } from "@/lib/phone";
import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";

const SUPPORTED_LANGUAGES = new Set(["en", "zu", "xh", "af", "st", "tn"]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAuth(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      facility_id,
      facility_name,
      ward_id,
      ward_name,
      patient_name,
      patient_id_last4,
      patient_language = "en",
      guardian_name,
      guardian_relationship,
      guardian_phone,
      consent_given = true
    } = req.body as {
      facility_id?: string;
      facility_name?: string;
      ward_id?: string;
      ward_name?: string;
      patient_name?: string;
      patient_id_last4?: string;
      patient_language?: string;
      guardian_name?: string;
      guardian_relationship?: string;
      guardian_phone?: string;
      consent_given?: boolean;
    };

    const normalizedIdLast4 = patient_id_last4?.replace(/\D/g, "") || "";

    if (normalizedIdLast4 && !/^\d{4}$/.test(normalizedIdLast4)) {
      return res.status(400).json({
        error: "patient_id_last4 must be exactly 4 digits"
      });
    }

    if (!patient_name?.trim()) {
      return res.status(400).json({ error: "patient_name is required" });
    }

    if (!guardian_phone?.trim()) {
      return res.status(400).json({ error: "guardian_phone is required" });
    }

    const normalizedGuardianPhone = normalizeSouthAfricanPhone(guardian_phone);

    if (!normalizedGuardianPhone) {
      return res.status(400).json({
        error: "guardian_phone must be a valid South African mobile number"
      });
    }

    if (!guardian_name?.trim()) {
      return res.status(400).json({ error: "guardian_name is required" });
    }

    if (!SUPPORTED_LANGUAGES.has(patient_language)) {
      return res.status(400).json({ error: "patient_language is invalid" });
    }

    let resolvedFacilityId = facility_id?.trim() || "";
    let resolvedWardId = ward_id?.trim() || "";

    if (!resolvedWardId && !ward_name?.trim()) {
      return res.status(400).json({
        error: "Provide ward_id or ward_name"
      });
    }

    if (!resolvedFacilityId && !resolvedWardId && !facility_name?.trim()) {
      return res.status(400).json({
        error: "Provide facility_id or facility_name"
      });
    }

    if (!resolvedFacilityId && facility_name?.trim()) {
      const { data: facility, error: facilityError } = await supabase
        .from("facilities")
        .insert({
          name: facility_name.trim()
        })
        .select()
        .single();

      if (facilityError) {
        console.error("Facility create error:", facilityError);
        return res.status(500).json({ error: "Failed to create facility" });
      }

      resolvedFacilityId = facility.id;
    }

    if (!resolvedWardId && ward_name?.trim()) {
      const { data: ward, error: wardError } = await supabase
        .from("wards")
        .insert({
          name: ward_name.trim(),
          facility_id: resolvedFacilityId
        })
        .select(
          `
            id,
            name,
            facility_id,
            facilities (
              id,
              name
            )
          `
        )
        .single();

      if (wardError) {
        console.error("Ward create error:", wardError);
        return res.status(500).json({ error: "Failed to create ward" });
      }

      resolvedWardId = ward.id;
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .insert({
        name: patient_name.trim(),
        ward_id: resolvedWardId,
        language: patient_language,
        status: "admitted",
        id_last4: normalizedIdLast4 || null
      })
      .select(
        `
          id,
          name,
          language,
          status,
          wards (
            id,
            name,
            facilities (
              id,
              name
            )
          )
        `
      )
      .single();

    if (patientError) {
      console.error("Patient create error:", patientError);
      return res.status(500).json({ error: "Failed to create patient" });
    }

    const { data: guardian, error: guardianError } = await supabase
      .from("guardians")
      .insert({
        patient_id: patient.id,
        full_name: guardian_name.trim(),
        relationship: guardian_relationship?.trim() || null,
        phone_number: normalizedGuardianPhone
      })
      .select()
      .single();

    if (guardianError) {
      console.error("Guardian create error:", guardianError);
      return res.status(500).json({ error: "Failed to create guardian" });
    }

    const { data: consent, error: consentError } = await supabase
      .from("consents")
      .insert({
        guardian_id: guardian.id,
        consent_given
      })
      .select()
      .single();

    if (consentError) {
      console.error("Consent create error:", consentError);
      return res.status(500).json({ error: "Failed to create consent" });
    }

    return res.status(201).json({
      success: true,
      patient,
      guardian,
      consent
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
