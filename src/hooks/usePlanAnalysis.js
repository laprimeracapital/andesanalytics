'use client';

import { getPlanAnalysisRanking } from "@/services/plan-analysis.service";
import { useCallback, useEffect, useState } from "react";

export const usePlanAnalysis = () => {
    const [planRanking, setPlanRanking] = useState([]);
    const [loadingPlanRanking, setLoadingPlanRanking] = useState(false);
    const [errorPlanRanking, setErrorPlanRanking] = useState(null);

    const loadPlanRanking = useCallback(async () => {
        try {
            setLoadingPlanRanking(true);
            setErrorPlanRanking(null);

            const data = await getPlanAnalysisRanking();

            setPlanRanking(data);

            return data;
        } catch (error) {
            console.error("Error cargando ranking:", error);

            setErrorPlanRanking(error);
            setPlanRanking([]);

            return [];
        } finally {
            setLoadingPlanRanking(false);
        }
    }, []);

    useEffect(() => {
        loadPlanRanking();
    }, [loadPlanRanking]);

    return {
        planRanking,
        loadingPlanRanking,
        errorPlanRanking,
        refreshPlanRanking: loadPlanRanking
    };
};