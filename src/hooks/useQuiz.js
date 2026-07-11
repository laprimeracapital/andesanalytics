'use client';

import { questions } from "@/db/db";
import { INITIAL_FORM } from "@/helpers/quiz.helper";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const useQuiz = ({loading = false, onFinish} = {}) => {

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);

    const currentQuestion = questions[step];

    const progress = useMemo(() => {
        if (!questions.length) return 0;
        return Math.round(((step + 1) / questions.length) * 100);
    }, [step]);

    const updateAnswer = (question, value) => {
        if (loading) return;

        if (question.type === "checkbox") {
            const currentValues = form[question.id] || [];
            const exists = currentValues.includes(value);

            if (!exists && question.max && currentValues.length >= question.max) return toast.error("Límite alcanzado", {description: `Puedes seleccionar como máximo ${question.max} opciones.`});

            setForm(prev => ({
                ...prev,
                [question.id]: exists
                    ? currentValues.filter(item => item !== value)
                    : [...currentValues, value]
            }));

            return;
        }

        setForm(prev => ({
            ...prev,
            [question.id]: value
        }));
    };

    const validateCurrentQuestion = () => {
        if (!currentQuestion) return false;
        const value = form[currentQuestion.id];
        const isEmpty = value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
        if (currentQuestion.required && isEmpty) {
            toast.error("Respuesta requerida", {description: "Selecciona una opción para continuar."});
            return false;
        }
        return true;
    };

    const nextStep = async () => {
        if (loading) return;
        if (!validateCurrentQuestion()) return;

        const isLastStep = step === questions.length - 1;

        if (isLastStep) {
            await onFinish?.(form);
            return;
        }

        setStep(prev => Math.min(prev + 1, questions.length - 1));
    };

    const prevStep = () => {
        if (loading) return;
        setStep(prev => Math.max(prev - 1, 0));
    };

    const restartQuiz = () => {
        setForm(INITIAL_FORM);
        setStep(0);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return {
        step,
        form,
        progress,
        currentQuestion,
        updateAnswer,
        validateCurrentQuestion,
        nextStep,
        prevStep,
        restartQuiz
    };
};