import { db } from "@/libs/supabase";
export async function getPlanAnalysisForAffinity() {
    const { data, error } = await db
        .from("electoral_plan_analysis")
        .select(`
            id_analysis,
            id_list,
            candidate_name,
            political_organization,
            general_score,
            proposals
        `);

    if (error) throw error;

    return data ?? [];
}

export async function saveCitizenAnswer({visitorId, sessionId, form, ranking}) {
    const winner = ranking[0] ?? null;

    const { data: answer, error: answerError } = await db
        .from("electoral_citizen_answers")
        .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            gender: form.gender || null,
            district_name: form.district_name || null,
            age_range: form.age_range || null,
            main_concern: form.main_concern || null,
            priority_topics: form.priority_topics || null,
            candidate_value: form.candidate_value || null,
            preferred_management: form.preferred_management || null,
            work_plan_importance: form.work_plan_importance || null,
            candidate_knowledge: form.candidate_knowledge || null,
            vote_decision: form.vote_decision || null,
            recommended_list: winner?.list_id ?? null,
            recommended_candidate: winner?.candidate_id ?? null,
            affinity: ranking,
            feedback: 0,
            completed_at: new Date().toISOString()
        })
        .select("id, session_id, created_at")
        .single();

    if (answerError) throw answerError;

    const affinityRows = ranking.map(item => ({
        answer_id: answer.id,
        list_id: item.list_id,
        affinity: item.affinity
    }));

    const { error: affinityError } = await db
        .from("electoral_citizen_affinity")
        .insert(affinityRows);

    if (affinityError) {
        /*
         * La respuesta principal ya fue guardada.
         * Lanzamos error para que puedas identificar la inconsistencia.
         */
        throw affinityError;
    }

    return {
        answer,
        ranking
    };
}

export async function saveCitizenFeedback({ answerId, feedback}) {
    if (![1, -1, 0].includes(feedback)) {
        throw new Error("Feedback inválido.");
    }

    const { data, error } = await db
        .from("electoral_citizen_answers")
        .update({
            feedback,
            like_vote: feedback === 1 && true,
            dislike_vote: feedback === 0 && false,
        })
        .eq("id", answerId)
        .select("id, feedback")
        .single();

    if (error) throw error;

    return data;
}