'use client';

import { getAnalyticsDashboard } from "@/services/dashboard.service";
import { useCallback, useEffect, useState } from "react";

export const useDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAnalyticsDashboard(days);
            setAnalytics(data);
            return data;
        } catch (error) {
            console.error("Error cargando dashboard:", error);
            setError(error);
            setAnalytics(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    return {
        analytics,
        days,
        setDays,
        loading,
        error,
        refresh: loadAnalytics
    };
};