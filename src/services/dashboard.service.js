import { db } from "@/libs/supabase";

export async function getAnalyticsDashboard(days = 30) {
    const { data, error } = await db.rpc(
        "get_web_analytics_summary",
        {
            p_days: days
        }
    );

    if (error) {
        console.error("Error obteniendo métricas:", error);
        throw error;
    }

    return data ?? null;
}