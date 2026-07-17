import { db } from "@/libs/supabase";

export async function getCandidates() {
    const { data, error } = await db
        .from("electoral_lists")
        .select(`
            id_list,
            political_organization_id,
            political_organization,
            electoral_year,
            election_scope,
            postulates_region,
            postulates_province,
            postulates_district,
            list_status,
            source_name,
            source_url,
            work_plan,
            candidate_image,
            list_image,
            is_active,
            electoral_candidates (
                id_candidate,
                id_hoja_vida,
                document_number,
                full_name,
                birth_date,
                gender,
                position_name,
                candidate_number,
                candidate_status,
                designated,
                native_candidate,
                source_file_guid,
                resume_guid
            )
        `)
        .eq("is_active", true)
        .eq("electoral_year", 2026)
        .eq("election_scope", "PROVINCIAL")
        .eq("postulates_region", "JUNIN")
        .eq("postulates_province", "JAUJA")
        .is("postulates_district", null)
        .order("political_organization", {
            ascending: true
        })
        .order("candidate_number", {
            referencedTable: "electoral_candidates",
            ascending: true
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function getLists() {

    const { data, error } = await db
        .from("electoral_lists")
        .select(`
            *,
            electoral_candidates (
                id,
                hoja_vida_id,
                candidate_number,
                full_name,
                document_number,
                birth_date,
                gender,
                position,
                status,
                designated,
                native_candidate,
                hoja_vida_guid
            )
        `)
        .order("candidate_number", {
            foreignTable: "electoral_candidates",
            ascending: true
        });

    if(error) throw error;

    return data;
}

export async function getElectoralSummary() {
    const { data, error } = await db.rpc("get_electoral_summary");

    if (error) {
        console.error("Error obteniendo resumen electoral:", error);
        throw error;
    }

    return data?.[0] ?? {
        total_lists: 0,
        total_candidates: 0,
        total_plans: 0,
        total_districts: 34
    };
}