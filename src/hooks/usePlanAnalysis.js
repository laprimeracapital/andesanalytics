'use client';

import { getPlanAnalysisRanking, getPlanComparation} from "@/services/plan-analysis.service";
import { useCallback, useEffect, useState} from "react";

export const usePlanAnalysis = () => {

    const [planRanking, setPlanRanking] = useState([]);
    const [loadingPlanRanking, setLoadingPlanRanking] = useState(false);
    const [errorPlanRanking, setErrorPlanRanking] = useState(null);

    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(false);
    const [errorProposals, setErrorProposals] = useState(null);

    const loadPlanRanking = useCallback(async () => {
        try {
            setLoadingPlanRanking(true);
            setErrorPlanRanking(null);

            const data = await getPlanAnalysisRanking();
            console.log(data);
            
            setPlanRanking(Array.isArray(data) ? data : []);

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(
                "Error cargando ranking de planes:",
                error
            );

            setErrorPlanRanking(error);
            setPlanRanking([]);

            return [];
        } finally {
            setLoadingPlanRanking(false);
        }
    }, []);

    const loadComparationProposals = useCallback(async () => {
        try {
            setLoadingProposals(true);
            setErrorProposals(null);

            const data = await getPlanComparation();

            setProposals(Array.isArray(data) ? data : []);

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error cargando propuestas para comparación:", error);
            setErrorProposals(error);
            setProposals([]);
            return [];
        } finally {
            setLoadingProposals(false);
        }
    }, []);

    useEffect(() => {
        loadPlanRanking();
        loadComparationProposals();
    }, [loadPlanRanking, loadComparationProposals]);

    return {
        planRanking,
        loadingPlanRanking,
        errorPlanRanking,
        refreshPlanRanking: loadPlanRanking,

        proposals,
        loadingProposals,
        errorProposals,
        refreshProposals: loadComparationProposals
    };
};