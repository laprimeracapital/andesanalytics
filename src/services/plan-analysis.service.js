import { db } from "@/libs/supabase";

export async function getPlanAnalysisRanking() {
    const { data, error } = await db
        .from("electoral_plan_analysis")
        .select(`
            id_analysis,
            id_list,
            candidate_name,
            political_organization,
            general_score,
            summary,
            electoral_lists!inner (
                id_list,
                political_organization,
                is_active
            )
        `)
        .eq("electoral_lists.is_active", true)
        .order("general_score", {
            ascending: false
        });

    if (error) {
        console.error("Error obteniendo ranking:", error);
        throw error;
    }

    return data ?? [];
}

export async function getPlanComparation() {

    const { data, error } = await db
        .from("electoral_plan_analysis")
        .select(`
            *,
            electoral_lists(
                id_list,
                political_organization,
                is_active
            )
        `)
        .eq("electoral_lists.is_active", true);

    if (error) throw error;

    return data;
}