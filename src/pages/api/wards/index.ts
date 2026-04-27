import type { NextApiRequest, NextApiResponse } from "next";

import { requireAuth } from "@/lib/requireAuth";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAuth(req, res)) return;

  if (req.method === "GET") {
    try {
      const { data: wards, error } = await supabase
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
        .order("name", { ascending: true });

      if (error) {
        console.error("Ward list error:", error);
        return res.status(500).json({ error: "Failed to fetch wards" });
      }

      return res.status(200).json({ wards: wards ?? [] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, facility_id } = req.body as {
        name?: string;
        facility_id?: string;
      };

      if (!name?.trim()) {
        return res.status(400).json({ error: "name is required" });
      }

      if (!facility_id?.trim()) {
        return res.status(400).json({ error: "facility_id is required" });
      }

      const { data: ward, error } = await supabase
        .from("wards")
        .insert({
          name: name.trim(),
          facility_id: facility_id.trim()
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

      if (error) {
        console.error("Ward create error:", error);
        return res.status(500).json({ error: "Failed to create ward" });
      }

      return res.status(201).json({
        success: true,
        ward
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
