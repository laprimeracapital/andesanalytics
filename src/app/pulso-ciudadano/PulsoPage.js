'use client';

import { questions } from "@/db/db";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCitizenPulse } from "@/hooks/useCitizenPulse";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateCitizenProfile } from "@/helpers/quiz.helper";
import { toast } from "sonner";
import { useQuiz } from "@/hooks/useQuiz";
import ResultQuiz from "@/components/views/ResultQuiz";

export default function Page() {

    const { track } = useAnalytics();
    
    const { result: affinityResult, loading, feedbackLoading, analyzeAndSave, sendFeedback } = useCitizenPulse();

    const [finished, setFinished] = useState(false);

    const handleFinish = useCallback(
        async formData => {
            try {
                const result = await analyzeAndSave(formData);
                const topResult = result?.top_three?.[0];

                await track("quiz_completed", {
                    answer_id: result?.answer_id ?? null,
                    gender: form.gender,
                    district_name: form.district_name,
                    age_range: form.age_range,
                    top_candidate: topResult?.candidate_name ?? null,
                    organization: topResult?.political_organization ?? null,
                    affinity: Number(topResult?.affinity || 0)
                });

                setFinished(true);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } catch (error) {
                toast.error("No se pudo procesar el resultado",{description:error?.message ||"Inténtalo nuevamente."});
            }
        },
        [analyzeAndSave, track]
    );

    const { step, form, nextStep, prevStep, progress, currentQuestion, restartQuiz, updateAnswer } = useQuiz({loading, onFinish: handleFinish});

    const citizenProfile = useMemo(() => {
        if (!finished) return null;
        return calculateCitizenProfile(form);
    }, [finished, form]);

    useEffect(() => {
        track("quiz_started");
    }, [track]);

    useEffect(() => {
        track("quiz_step", {
            step: step + 1,
            question_id: currentQuestion?.id ?? null
        });
    }, [step, currentQuestion?.id, track]);

    const handleFeedback = async value => {
        try {
            await sendFeedback(value);
            const topResult = affinityResult?.top_three?.[0];
            const eventName = value === 1 ? "candidate_like" : value === -1 ? "candidate_dislike" : "candidate_feedback_removed";
            await track(eventName, {
                list_id: topResult?.list_id ?? null,
                candidate: topResult?.candidate_name ?? null,
                organization: topResult?.political_organization ?? null
            });
            toast.success(value === 1 ? "Gracias por confirmar tu afinidad." : value === -1 ? "Gracias. Usaremos tu opinión para mejorar." : "Tu opinión fue retirada.");
        } catch (error) {
            toast.error("No se pudo guardar tu opinión", {description: error?.message || "Inténtalo nuevamente."});
        }
    };

    const handleRestartQuiz = () => {
        restartQuiz();
        setFinished(false);
    };

    const shareReferral = async () => {
        const url =
            `${window.location.origin}/pulso-ciudadano` +
            `?ref=${affinityResult.referral_code}` +
            `&utm_source=whatsapp` +
            `&utm_medium=referral` +
            `&utm_campaign=pulso_ciudadano`;

        const text = "Participa en Pulso Ciudadano Jauja y descubre qué planes de gobierno se acercan más a tus prioridades.";

        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank");
    };

    if (!questions.length) {
        return (
            <main className="w-full min-h-screen grid place-items-center">
                <div className="card text-center">
                    <h1 className="text-xl font-medium"> hay preguntas disponibles</h1>
                    <p className="text-sm text-muted mt-2">Inténtalo nuevamente más tarde.</p>
                </div>
            </main>
        );
    }

    if (finished && citizenProfile) {
        return <ResultQuiz citizenProfile={citizenProfile} affinityResult={affinityResult} feedbackLoading={feedbackLoading} restartQuiz={handleRestartQuiz} handleFeedback={handleFeedback} />
    }

    return (
        <>
            <header className="w-full h-16 bg-white border-b">
                <div className="w m-auto h-full flex items-center justify-between lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <Link href="/" className="text-lg font-medium">Andes Analytics</Link>
                    <div className="flex items-center gap-sm">
                        <span className="badge badge--success">Pulso Ciudadano</span>
                        <button type="button" className="btn btn-lg btn-primary" onClick={shareReferral}>Enviar por WhatsApp</button>
                    </div>
                </div>
            </header>

            <main className="w-full">

                <section className="w m-auto py-12 text-center lg:w" style={{"--w": "90%","--w-lg": "60%"}}>
                    <div className="w-full flex flex-col items-center gap-md">
                        <span className="badge badge-secondary">Participación ciudadana</span>
                        <h1 className="text-3xl font-medium leading-tight">Descubre cuáles son tus<br />prioridades para Jauja</h1>
                        <p className="text-sm text-muted leading-normal">Responde algunas preguntas y conoce tu perfil ciudadano. Tus respuestas serán procesadas de manera anónima y agregada.</p>
                    </div>
                </section>

                <section
                    className="w m-auto pb-16 lg:w"
                    style={{
                        "--w": "90%",
                        "--w-lg": "60%"
                    }}
                >
                    <div className="w-full flex flex-col gap-md">

                        <div className="w-full flex items-center justify-between">
                            <p className="text-xs text-muted">
                                Pregunta {step + 1} de{" "}
                                {questions.length}
                            </p>

                            <p className="text-xs font-medium">
                                {progress}%
                            </p>
                        </div>

                        <div
                            className="w-full bg-surface rounded-full overflow-hidden"
                            style={{
                                height: "8px"
                            }}
                        >
                            <div
                                className="bg-black transition-all"
                                style={{
                                    width: `${progress}%`,
                                    height: "100%"
                                }}
                            />
                        </div>

                        <div className="card flex flex-col gap-lg">

                            <div>
                                <p className="label text-primary">
                                    Pregunta {step + 1}
                                </p>

                                <h2 className="text-xl font-medium mt-2">
                                    {currentQuestion.title}
                                </h2>

                                {currentQuestion.description && (
                                    <p className="text-sm text-muted mt-2">
                                        {currentQuestion.description}
                                    </p>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-sm">
                                {currentQuestion.options.map(option => {
                                    const selected =
                                        currentQuestion.type ===
                                        "checkbox"
                                            ? form[
                                                currentQuestion.id
                                            ]?.includes(option.key)
                                            : form[
                                                currentQuestion.id
                                            ] === option.key;

                                    return (
                                        <label
                                            key={option.key}
                                            className={`
                                                w-full border rounded-md
                                                flex items-center gap-md
                                                cursor-pointer py-3 px-2
                                                transition-all
                                                ${
                                                    selected
                                                        ? "bg-black text-white"
                                                        : "bg-white"
                                                }
                                            `}
                                        >
                                            <input
                                                type={
                                                    currentQuestion.type
                                                }
                                                name={
                                                    currentQuestion.id
                                                }
                                                value={option.key}
                                                checked={selected}
                                                disabled={loading}
                                                className={
                                                    currentQuestion.type ===
                                                    "checkbox"
                                                        ? "checkbox"
                                                        : "radio"
                                                }
                                                onChange={() =>
                                                    updateAnswer(
                                                        currentQuestion,
                                                        option.key
                                                    )
                                                }
                                            />

                                            <span className="text-sm font-medium">
                                                {option.value}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="w-full flex justify-between gap-md">
                                <button type="button" className="btn btn-lg btn-secondary" onClick={prevStep} disabled={step === 0 || loading}>Volver</button>
                                <button type="button" className="btn btn-lg btn-primary" onClick={nextStep} disabled={loading}>{loading ? "Procesando..." : step === questions.length - 1 ? "Ver resultado" : "Continuar"}</button>
                            </div>

                        </div>

                        <p className="text-xs text-muted text-center">
                            Esta consulta abierta no constituye una encuesta
                            probabilística ni representa por sí sola a toda la
                            población electoral.
                        </p>

                    </div>
                </section>

            </main>
        </>
    );
}