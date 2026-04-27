import type { NextApiRequest, NextApiResponse } from "next";

import { normalizeSouthAfricanPhone } from "@/lib/phone";
import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";
import { sendNotification } from "@/services/messagingService";

type PatientRecord = {
  id: string;
  name: string;
  language?: string;
  status?: string;
  wards?: {
    facilities?: {
      name?: string;
    };
  };
};

type GuardianRecord = {
  id: string;
  full_name?: string;
  phone_number: string;
  consents?: Array<{
    consent_given: boolean;
  }>;
};

function buildPreNotifyMessage({
  hospitalName,
  language
}: {
  hospitalName?: string;
  language?: string;
}) {
  const safeHospital = hospitalName || "the hospital";

  switch (language) {
    case "zu":
      return `DischargeAlert: Umuntu omnakekelayo e-${safeHospital} usesacutshungulwa ukukhululwa. Sicela niqale ukuqonda eya esibhedlela.`;
    case "xh":
      return `DischargeAlert: Umntu omkhathaleleyo e-${safeHospital} usaqhutywa ekukhutshweni. Nceda uqale ukuza esibhedlele.`;
    case "af":
      return `DischargeAlert: Iemand in u sorg by ${safeHospital} word vir ontslag verwerk. Begin asseblief om hospitaal toe te beweeg.`;
    case "st":
      return `DischargeAlert: Motho eo o mo hlokomedisang ho ${safeHospital} o sa ntse a lokisetswa ho nkuoa. Ka kopo qalang ho ya sepetlele.`;
    case "tn":
      return `DischargeAlert: Motho yo o mo tlhokomelang kwa ${safeHospital} o sa ntse a baakanyetswa go tswa. Tsweetswee simolang go tla bookelong.`;
    case "en":
    default:
      return `DischargeAlert: A person in your care at ${safeHospital} is being prepared for discharge. Please start heading to the hospital.`;
  }
}

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

    if (!patient_id) {
      return res.status(400).json({ error: "patient_id required" });
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select(
        `
          id,
          name,
          language,
          status,
          wards (
            facilities (name)
          )
        `
      )
      .eq("id", patient_id)
      .single();

    if (patientError) {
      return res.status(500).json({ error: "Failed to fetch patient" });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const typedPatient = patient as PatientRecord;

    if (typedPatient.status === "discharged") {
      return res.status(400).json({ error: "Patient already discharged" });
    }

    const { data: guardians, error: guardiansError } = await supabase
      .from("guardians")
      .select(
        `
          id,
          full_name,
          phone_number,
          consents (consent_given)
        `
      )
      .eq("patient_id", patient_id);

    if (guardiansError) {
      return res.status(500).json({ error: "Failed to fetch guardians" });
    }

    const validGuardians = (guardians as GuardianRecord[] | null)?.filter(
      (guardian) => guardian.consents?.some((consent) => consent.consent_given)
    );

    if (!validGuardians || validGuardians.length === 0) {
      return res.status(400).json({ error: "No consented guardians" });
    }

    const message = buildPreNotifyMessage({
      hospitalName: typedPatient.wards?.facilities?.name,
      language: typedPatient.language
    });

    const results = [];

    for (const guardian of validGuardians) {
      const normalizedPhone = normalizeSouthAfricanPhone(guardian.phone_number);

      if (!normalizedPhone) {
        await supabase.from("audit_logs").insert({
          action: "pre_notify_blocked_invalid_phone",
          entity: "guardians",
          metadata: {
            patient_id,
            guardian_id: guardian.id,
            guardian_name: guardian.full_name || null
          }
        });
        continue;
      }

      const result = await sendNotification({
        phone: normalizedPhone,
        message
      });

      const { data: notification } = await supabase
        .from("notifications")
        .insert({
          patient_id,
          guardian_id: guardian.id,
          channel: result.channel,
          message_body: message,
          status: result.status,
          gateway_message_id: result.messageId,
          delivery_attempts: result.deliveryAttempts,
          last_attempt_at: new Date().toISOString()
        })
        .select()
        .single();

      if (notification) {
        results.push(notification);
      }
    }

    await supabase
      .from("patients")
      .update({ status: "pending_discharge" })
      .eq("id", patient_id)
      .neq("status", "discharged");

    return res.status(200).json({
      success: true,
      notifications: results
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
