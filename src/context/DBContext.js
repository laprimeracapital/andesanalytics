'use client'
import { useCandidate } from "@/hooks/candidate.hook";
import { usePadron } from "@/hooks/padron.hook";
import { createContext, useContext, useEffect } from "react";

const DBContext = createContext();

export const DBProvider = ({ children }) => {

    const candidates = useCandidate();
    const padron = usePadron();

    useEffect(() => {
        (async () => {
            await Promise.all([
                candidates.getCandidatesList(),
            ])
        })();
    }, [])

    const contextValue = {
        candidates: candidates.candidates,
        loadCandidates: candidates.loading,
        ...padron
    }

    return (
        <DBContext.Provider value={contextValue}>{children}</DBContext.Provider>
    )

}

export const useDB = () => useContext(DBContext);