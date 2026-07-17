'use client';

import { getElectoralSummary } from "@/services/candidates.service";
import { getPadronSummary } from "@/services/transparency.service";
import { useCallback, useEffect, useState } from "react";

export const usePadron = () => {

    const [padron, setPadron] = useState(null);
    const [loadingPadron, setLoadingPadron] = useState(false);
    const [errorPadron, setErrorPadron] = useState(null);

    const [summary, setSummary] = useState(null);

    const loadPadron = useCallback(async () => {
        try {
            setLoadingPadron(true);
            setErrorPadron(null);
            const data = await getPadronSummary();
            setPadron(data ?? null);
            return data;
        } catch (error) {
            console.error("Error al obtener el padrón:", error);
            setErrorPadron(error);
            setPadron(null);

            return null;
        } finally {
            setLoadingPadron(false);
        }
    }, []);

    const loadSummary = useCallback(async () => {
        const data = await getElectoralSummary();
        setSummary(data);
    }, []);

    useEffect(() => {
        loadPadron();
        loadSummary();
    }, [loadPadron, loadSummary]);

    return {
        padron,
        loadingPadron,
        errorPadron,
        refreshPadron: loadPadron,
        summary
    };
};