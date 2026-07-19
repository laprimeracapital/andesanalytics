'use client';

import { getPlanAnalysisRanking, getPlanComparation, getCandidateIntegral, getCandidateRanking } from '@/services/plan-analysis.service';
import { useCallback, useEffect, useState } from 'react';

const EMPTY_LIST = [];

const normalizeList = (value) => (
    Array.isArray(value) ? value : EMPTY_LIST
);

const useAsyncList = (fetcher, errorMessage) => {
    const [state, setState] = useState({
        data: EMPTY_LIST,
        loading: false,
        error: null,
    });

    const refresh = useCallback(async () => {
        setState((currentState) => ({
            ...currentState,
            loading: true,
            error: null,
        }));

        try {
            const response = await fetcher();
            const data = normalizeList(response);

            setState({
                data,
                loading: false,
                error: null,
            });

            return data;
        } catch (error) {
            console.error(errorMessage, error);

            setState({
                data: EMPTY_LIST,
                loading: false,
                error,
            });

            return EMPTY_LIST;
        }
    }, [fetcher, errorMessage]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {
        ...state,
        refresh,
    };
};

export const usePlanAnalysis = () => {
    
    const ranking = useAsyncList(getPlanAnalysisRanking, 'Error cargando ranking de planes:');
    const comparisonProposals = useAsyncList(getPlanComparation, 'Error cargando propuestas para comparación:');
    const candidateRanking = useAsyncList(getCandidateRanking, 'Error cargando el ranking de candidatos:');
    const integralRanking = useAsyncList(getCandidateIntegral, 'Error cargando ranking integral:')


    return {
        planRanking: ranking.data,
        loadingPlanRanking: ranking.loading,
        errorPlanRanking: ranking.error,
        refreshPlanRanking: ranking.refresh,

        proposals: comparisonProposals.data,
        loadingProposals: comparisonProposals.loading,
        errorProposals: comparisonProposals.error,
        refreshProposals: comparisonProposals.refresh,

        candidateRanking: candidateRanking.data,
        loadingRanking: candidateRanking.loading,
        errorRanking: candidateRanking.error,
        refreshRanking: candidateRanking.refresh,

        integralRanking: integralRanking.data,
        loadingIntegralRanking: integralRanking.loading,
        errorIntegralRanking: integralRanking.error,
        refreshIntegralRanking: integralRanking.refresh,

        loading: ranking.loading || comparisonProposals.loading || candidateRanking.loading || integralRanking.loading,

        hasError: Boolean(
            ranking.error ||
            comparisonProposals.error ||
            candidateRanking.error ||
            integralRanking.error
        ),
    };
};