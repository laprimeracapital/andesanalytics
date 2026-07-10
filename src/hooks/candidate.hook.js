'use client'
import { getCandidates } from "@/services/candidates.service";
import { useCallback, useState } from "react"

export const useCandidate = () => {
    
    const [ candidates, setCandidates ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState(null);

    const getCandidatesList = useCallback(async () => {

        try {
            setLoading(true);
            setError(null);

            const data = await getCandidates();

            setCandidates(data ?? []);

            return data ?? [];

        } catch (error) {

            console.error("Error al obtener candidatos:", error);

            setError(error);
            setCandidates([]);

            return [];

        } finally {

            setLoading(false);

        }

    }, []);

    return {
        candidates,
        loading,
        error,
        getCandidatesList
    }

}