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

export async function getCandidateRanking() {
    try {
        const { data, error } = await db
            .from('electoral_candidate_analysis')
            .select(`
                *,
                electoral_lists (
                    slug,
                    candidate_image
                )
            `)
            .order('general_score', { ascending: false });

        if (error) throw new Error(error.message || "Hubo un error al consultar");
            return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getCandidateIntegral() {
    try {
        const { data, error } = await db
            .from('electoral_integral_analysis')
            .select(`
                *,
                electoral_lists (
                    slug,
                    candidate_image
                )
            `)
            .order('integral_score', { ascending: false });
        
        if (error) throw new Error(error.message || "Hubo un error al consultar");
            console.log(data);
            return data;
    } catch (error) {
        console.error(error);
    }
}