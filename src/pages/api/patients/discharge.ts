import type { NextApiRequest, NextApiResponse } from "next";

import { normalizeSouthAfricanPhone } from "@/lib/phone";
import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";
import { sendNotification } from "@/services/messagingService";

type PatientRecord = {
  id: string;
  name: string;
  language?: string;
  wards?: {
    name?: string;
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

function buildMessage({
  hospitalName,
  pickupHours,
  language
}: {
  hospitalName?: string;
  pickupHours: number;
  language?: string;
}) {
  const safeHospital = hospitalName || "the hospital";

  switch (language) {
    case "zu":
      return `DischargeAlert: Umuntu omnakekelayo e-${safeHospital} uselungele ukulandwa. Sicela nifike kungakapheli amahora angu-${pickupHours}. Phendula 1=Ngiyafika 2=Ngibambezelekile 3=Ngicela ningishayele.`;
    case "xh":
      return `DischargeAlert: Umntu omkhathaleleyo e-${safeHospital} ukulungele ukulandwa. Nceda ufike ngaphakathi kweeyure ezi-${pickupHours}. Phendula 1=Ndiyafika 2=Ndilibazisekile 3=Nceda unditsalele umnxeba.`;
    case "af":
      return `DischargeAlert: Iemand in u sorg by ${safeHospital} is gereed vir afhaal. Kom asseblief binne ${pickupHours} uur. Antwoord 1=Oppad 2=Vertraag 3=Skakel my.`;
    case "st":
      return `DischargeAlert: Motho eo o mo hlokomedisang ho ${safeHospital} o loketse ho nkuoa. Ka kopo fihlang nakong ya dihora tse ${pickupHours}. Araba 1=Ke tseleng 2=Ke tla dieha 3=Mpitse.`;
    case "tn":
      return `DischargeAlert: Motho yo o mo tlhokomelang kwa ${safeHospital} o siametse go tsewa. Tsweetswee fitlhang mo diureng tse ${pickupHours}. Araba 1=Ke etla 2=Ke diegile 3=Ntesetse.`;
    case "en":
    default:
      return `DischargeAlert: A person in your care at ${safeHospital} is ready for collection. Please arrive within ${pickupHours} hours. Reply 1=Coming 2=Delayed 3=Call me.`;
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
    const { patient_id, pickup_window_hours = 4 } = req.body;
    const pickupWindow = Number(pickup_window_hours);

    if (!patient_id) {
      return res.status(400).json({ error: "patient_id required" });
    }

    if (!Number.isFinite(pickupWindow) || pickupWindow < 1 || pickupWindow > 24) {
      return res
        .status(400)
        .json({ error: "pickup_window_hours must be a number between 1 and 24" });
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
            name,
            facilities (name)
          )
        `
      )
      .eq("id", patient_id)
      .single();

    if (patientError) {
      console.error("Patient lookup error:", patientError);
      return res.status(500).json({ error: "Failed to fetch patient" });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const typedPatient = patient as PatientRecord & { status?: string };

    if (typedPatient.status === "discharged") {
      const { data: existingNotifications } = await supabase
        .from("notifications")
        .select(
          `
            id,
            channel,
            status,
            message_body,
            gateway_message_id,
            created_at
          `
        )
        .eq("patient_id", patient_id)
        .order("created_at", { ascending: false })
        .limit(10);

      return res.status(200).json({
        success: true,
        idempotent: true,
        message: "Patient already discharged",
        notifications: existingNotifications ?? []
      });
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
      console.error("Guardian lookup error:", guardiansError);
      return res.status(500).json({ error: "Failed to fetch guardians" });
    }

    const validGuardians = (guardians as GuardianRecord[] | null)?.filter(
      (guardian) => guardian.consents?.some((consent) => consent.consent_given)
    );

    if (!validGuardians || validGuardians.length === 0) {
      return res.status(400).json({ error: "No consented guardians" });
    }

    const { data: updatedPatients, error: updateError } = await supabase
      .from("patients")
      .update({ status: "discharged" })
      .eq("id", patient_id)
      .neq("status", "discharged")
      .select("id");

    if (updateError) {
      console.error("Patient update error:", updateError);
      return res.status(500).json({ error: "Failed to update patient" });
    }

    if (!updatedPatients || updatedPatients.length === 0) {
      const { data: existingNotifications } = await supabase
        .from("notifications")
        .select(
          `
            id,
            channel,
            status,
            message_body,
            gateway_message_id,
            created_at
          `
        )
        .eq("patient_id", patient_id)
        .order("created_at", { ascending: false })
        .limit(10);

      return res.status(200).json({
        success: true,
        idempotent: true,
        message: "Patient already discharged",
        notifications: existingNotifications ?? []
      });
    }

    const results = [];

    for (const guardian of validGuardians) {
      const normalizedPhone = normalizeSouthAfricanPhone(guardian.phone_number);

      if (!normalizedPhone) {
        await supabase.from("audit_logs").insert({
          action: "notification_blocked_invalid_phone",
          entity: "guardians",
          metadata: {
            patient_id,
            guardian_id: guardian.id,
            guardian_name: guardian.full_name || null
          }
        });
        continue;
      }

      const message = buildMessage({
        hospitalName: typedPatient.wards?.facilities?.name,
        pickupHours: pickupWindow,
        language: typedPatient.language
      });

      let notificationPayload:
        | {
            channel: "whatsapp" | "sms";
            status: "sent" | "failed";
            messageId: string | null;
            deliveryAttempts: number;
            errorReason?: string;
          }
        | undefined;

      try {
        notificationPayload = await sendNotification({
          phone: normalizedPhone,
          message
        });
      } catch (error: any) {
        notificationPayload = {
          channel: "sms",
          status: "failed",
          messageId: null,
          deliveryAttempts: 1,
          errorReason: error?.message || "Notification send failed"
        };
      }

      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert({
          patient_id,
          guardian_id: guardian.id,
          channel: notificationPayload.channel,
          message_body: message,
          status: notificationPayload.status,
          gateway_message_id: notificationPayload.messageId,
          delivery_attempts: notificationPayload.deliveryAttempts,
          last_attempt_at: new Date().toISOString()
        })
        .select()
        .single();

      if (notificationError) {
        console.error("Notification insert error:", notificationError);
        continue;
      }

      results.push(notification);

      if (notificationPayload.status === "failed") {
        await supabase.from("audit_logs").insert({
          action: "notification_failed",
          entity: "notifications",
          metadata: {
            patient_id,
            guardian_id: guardian.id,
            guardian_name: guardian.full_name || null,
            reason: notificationPayload.errorReason || "Unknown failure"
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      notifications: results
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
