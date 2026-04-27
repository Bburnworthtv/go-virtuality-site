import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";

type PatientListItem = {
  id: string;
  name: string;
  status: string;
  wards?: {
    name?: string;
    facilities?: {
      name?: string;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAuth(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data: patients, error } = await supabase
      .from("patients")
      .select(
        `
          id,
          name,
          status,
          wards (
            name,
            facilities (name)
          )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Patient list error:", error);
      return res.status(500).json({ error: "Failed to fetch patients" });
    }

    return res.status(200).json({
      patients: (patients ?? []) as PatientListItem[]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
