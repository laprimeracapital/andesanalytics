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
            summary
        `)
        .order("general_score", {
            ascending: false
        });

    if (error) {
        console.error("Error obteniendo ranking:", error);
        throw error;
    }

    return data ?? [];
}