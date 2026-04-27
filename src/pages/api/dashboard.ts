import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAuth(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [
      { data: patients, error: patientsError },
      { data: facilities, error: facilitiesError },
      { data: wards, error: wardsError },
      { data: notifications, error: notificationsError },
      { data: replies, error: repliesError },
      { data: kioskRequests, error: kioskRequestsError }
    ] = await Promise.all([
      supabase
        .from("patients")
        .select(
          `
            id,
            name,
            language,
            status,
            id_last4,
            guardians (
              id,
              full_name,
              relationship,
              phone_number
            ),
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
        .order("created_at", { ascending: false }),
      supabase
        .from("facilities")
        .select("id, name")
        .order("name", { ascending: true }),
      supabase
        .from("wards")
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
        .order("name", { ascending: true }),
      supabase
        .from("notifications")
        .select(
          `
            id,
            channel,
            status,
            message_body,
            gateway_message_id,
            created_at,
            patients (
              name,
              language
            ),
            guardians (
              full_name,
              relationship,
              phone_number
            )
          `
        )
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("audit_logs")
        .select("id, action, metadata, created_at")
        .eq("action", "guardian_reply")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("audit_logs")
        .select("id, action, metadata, created_at")
        .in("action", ["kiosk_ride_request", "kiosk_ride_request_unmatched"])
        .order("created_at", { ascending: false })
        .limit(100)
    ]);

    const firstError =
      patientsError ||
      facilitiesError ||
      wardsError ||
      notificationsError ||
      repliesError ||
      kioskRequestsError;

    if (firstError) {
      console.error("Dashboard fetch error:", firstError);
      return res.status(500).json({ error: "Failed to load dashboard" });
    }

    return res.status(200).json({
      patients: patients ?? [],
      facilities: facilities ?? [],
      wards: wards ?? [],
      notifications: notifications ?? [],
      replies: replies ?? [],
      kioskRequests: kioskRequests ?? []
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
