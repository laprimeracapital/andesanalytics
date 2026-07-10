import { db } from "@/libs/supabase";

export async function getTransparencyData() {

    const { data, error } = await db
        .from("electoral_lists")
        .select(`
            id,
            organization_name,
            logo,
            color,
            work_plan,
            electoral_candidates (
                candidate_number,
                full_name,
                position,
                gender,
                birth_date,
                status,
                designated,
                native_candidate
            )
        `)
        .order("organization_name")
        .order("candidate_number", {
            foreignTable: "electoral_candidates"
        });

    if(error) throw error;

    return data;
}