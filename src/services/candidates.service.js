import { db } from "@/libs/supabase";

export async function getCandidates() {
    const { data, error } = await db
        .from("electoral_lists")
        .select(`
            id_list,
            slug,
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
            created_at,
            updated_at,

            electoral_candidates (
                id_candidate,
                id_hoja_vida,
                document_number,
                full_name,
                birth_date,
                gender,
                position_name,
                candidate_number,
                status:candidate_status,
                designated,
                native_candidate,
                source_file_guid,
                resume_guid
            ),

            electoral_plan_analysis (
                id_analysis,
                id_list,
                candidate_name,
                political_organization,
                general_score,
                clarity_score,
                viability_score,
                innovation_score,
                impact_score,
                technical_support_score,
                local_focus_score,
                document_pages,
                proposals,
                strengths,
                weaknesses,
                main_projects,
                budget_viability,
                originality,
                summary,
                analysis_version,
                analysis_method,
                analyzed_at,
                updated_at
            ),

            electoral_candidate_analysis (
                id_candidate_analysis,
                id_candidate,
                id_list,
                candidate_name,
                political_organization,
                general_score,
                academic_training_score,
                specialization_score,
                public_management_score,
                executive_experience_score,
                municipal_experience_score,
                regional_experience_score,
                private_sector_experience_score,
                technical_capacity_score,
                territorial_knowledge_score,
                leadership_score,
                governance_capacity_score,
                plan_alignment_score,
                years_of_experience,
                years_public_sector,
                years_management_positions,
                education_level,
                profession,
                highest_position,
                management_positions_count,
                municipal_entities_count,
                regional_entities_count,
                public_entities_count,
                strengths,
                weaknesses,
                professional_experience,
                academic_background,
                specializations,
                recognitions,
                profile_summary,
                execution_capacity,
                profile_risks,
                source_document,
                document_pages,
                analysis_version,
                analysis_method,
                analyzed_at,
                updated_at
            ),

            electoral_integral_analysis (
                id_integral_analysis,
                id_list,
                id_candidate,
                id_plan_analysis,
                id_candidate_analysis,
                candidate_name,
                political_organization,
                plan_score,
                candidate_profile_score,
                plan_execution_alignment_score,
                integral_score,
                governance_score,
                execution_score,
                technical_consistency_score,
                territorial_response_score,
                strategic_communication_score,
                plan_weight,
                candidate_weight,
                alignment_weight,
                strengths,
                weaknesses,
                opportunities,
                risks,
                priority_areas,
                communication_recommendations,
                territorial_recommendations,
                integral_summary,
                execution_diagnosis,
                strategic_recommendation,
                analysis_version,
                analysis_method,
                analyzed_at,
                updated_at
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