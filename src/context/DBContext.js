'use client'
import { useCandidate } from "@/hooks/candidate.hook";
import { createContext, useContext, useEffect } from "react";

const DBContext = createContext();

export const DBProvider = ({ children }) => {

    const candidates = useCandidate();

    useEffect(() => {
        (async () => {
            await Promise.all([
                candidates.getCandidatesList()
            ])
        })();
    }, [])

    const contextValue = {
        candidates: candidates.candidates,
        loadCandidates: candidates.loading
    }

    return (
        <DBContext.Provider value={contextValue}>{children}</DBContext.Provider>
    )

}

export const useDB = () => useContext(DBContext);