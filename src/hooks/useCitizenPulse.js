'use client';

import { useState } from "react";
import { getPlanAnalysisForAffinity, saveCitizenAnswer, saveCitizenFeedback } from "@/services/citizen-pulse.service";
import { calculateAffinity } from "@/helpers/calculate-affinity.helper";
import { createCitizenSession, getVisitorId, saveLastCitizenResult } from "@/helpers/citizen-session.helper";

export const useCitizenPulse = () => {
    const [result, setResult] = useState(null);
    const [answerId, setAnswerId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeAndSave = async form => {
        try {
            setLoading(true);
            setError(null);

            const visitorId = getVisitorId();
            const sessionId = createCitizenSession();

            const plans = await getPlanAnalysisForAffinity();

            if (!plans.length) {
                throw new Error(
                    "No existen planes analizados."
                );
            }

            const ranking = calculateAffinity(form, plans);

            const response = await saveCitizenAnswer({
                visitorId,
                sessionId,
                form,
                ranking
            });

            const payload = {
                answer_id: response.answer.id,
                session_id: sessionId,
                ranking,
                top_three: ranking.slice(0, 3),
                demographic: {
                    gender: form.gender,
                    district_name: form.district_name,
                    age_range: form.age_range
                },
                created_at: new Date().toISOString()
            };

            setAnswerId(response.answer.id);
            setResult(payload);

            saveLastCitizenResult(payload);

            return payload;
        } catch (error) {
            console.error("Error procesando Pulso Ciudadano:",error);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const sendFeedback = async value => {
        if (!answerId) {
            throw new Error(
                "No existe una respuesta registrada."
            );
        }

        try {
            setFeedbackLoading(true);

            const response =
                await saveCitizenFeedback({
                    answerId,
                    feedback: value
                });

            setResult(prev => ({
                ...prev,
                feedback: response.feedback
            }));

            return response;
        } finally {
            setFeedbackLoading(false);
        }
    };

    return {
        result,
        answerId,
        loading,
        feedbackLoading,
        error,

        analyzeAndSave,
        sendFeedback
    };
};