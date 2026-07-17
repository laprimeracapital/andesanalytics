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
            is_active,
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
        .eq('is_active', true)
        .order("organization_name")
        .order("candidate_number", {
            foreignTable: "electoral_candidates"
        })

    if(error) throw error;

    return data;
}

export async function getPadronSummary() {

    const { data, error } = await db.rpc("get_padron_summary", {
        p_year: 2026,
        p_province: "Jauja"
    });

    if(error) throw error;

    return data[0];

}