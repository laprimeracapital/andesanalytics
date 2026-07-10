'use client';

import { getPadronSummary } from "@/services/transparency.service";
import { useCallback, useEffect, useState } from "react";

export const usePadron = () => {
    const [padron, setPadron] = useState(null);
    const [loadingPadron, setLoadingPadron] = useState(false);
    const [errorPadron, setErrorPadron] = useState(null);

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

    useEffect(() => {
        loadPadron();
    }, [loadPadron]);

    return {
        padron,
        loadingPadron,
        errorPadron,
        refreshPadron: loadPadron
    };
};