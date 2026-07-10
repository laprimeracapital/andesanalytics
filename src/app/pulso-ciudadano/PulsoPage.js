'use client';

import { questions } from "@/db/db";
import { useCitizenPulse } from "@/hooks/useCitizenPulse";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const INITIAL_FORM = questions.reduce((acc, question) => {
    acc[question.id] = question.type === "checkbox" ? [] : "";
    return acc;
}, {});

const topicLabels = {
    tourism: "Turismo y cultura",
    agriculture: "Agricultura y ganadería",
    health: "Salud",
    education: "Educación",
    security: "Seguridad ciudadana",
    employment: "Empleo y economía local",
    environment: "Medio ambiente",
    digital_government: "Modernización municipal",
    infrastructure: "Infraestructura y vías",

    turismo: "Turismo y cultura",
    agricultura: "Agricultura y ganadería",
    salud: "Salud",
    educacion: "Educación",
    seguridad: "Seguridad ciudadana",
    gestion_publica: "Modernización municipal",
    medio_ambiente: "Medio ambiente",
    infraestructura: "Infraestructura y vías"
};

function calculateCitizenProfile(form) {
    const topics = [
        form.main_concern,
        ...(form.priority_topics || [])
    ].filter(Boolean);

    const counts = topics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {});

    const priorities = Object.entries(counts)
        .sort(([, first], [, second]) => second - first)
        .map(([key, count]) => ({
            key,
            label: topicLabels[key] || key,
            score: count
        }));

    const profileMap = {
        technical: "Perfil técnico y orientado a resultados",
        participatory: "Perfil participativo y ciudadano",
        modern: "Perfil moderno, digital y transparente",
        social: "Perfil orientado al desarrollo social",
        business: "Perfil orientado al desarrollo económico"
    };

    return {
        primary_priority:
            priorities[0]?.label || "Sin prioridad definida",

        priorities,

        citizen_profile:
            profileMap[form.preferred_management] ||
            "Perfil ciudadano equilibrado",

        candidate_value: form.candidate_value,
        vote_status: form.vote_decision
    };
}

export default function Page() {

    const {
        result: affinityResult,
        loading,
        feedbackLoading,
        analyzeAndSave,
        sendFeedback
    } = useCitizenPulse();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [finished, setFinished] = useState(false);

    const currentQuestion = questions[step];

    const progress = useMemo(() => {
        if (!questions.length) return 0;

        return Math.round(
            ((step + 1) / questions.length) * 100
        );
    }, [step]);

    const citizenProfile = useMemo(() => {
        if (!finished) return null;

        return calculateCitizenProfile(form);
    }, [finished, form]);

    const updateAnswer = (question, value) => {
        if (loading) return;

        if (question.type === "checkbox") {
            const currentValues = form[question.id] || [];
            const exists = currentValues.includes(value);

            if (
                !exists &&
                question.max &&
                currentValues.length >= question.max
            ) {
                toast.error("Límite alcanzado", {
                    description:
                        `Puedes seleccionar como máximo ${question.max} opciones.`
                });

                return;
            }

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

        const isEmpty =
            !value ||
            (
                Array.isArray(value) &&
                value.length === 0
            );

        if (currentQuestion.required && isEmpty) {
            toast.error("Respuesta requerida", {
                description:
                    "Selecciona una opción para continuar."
            });

            return false;
        }

        return true;
    };

    const nextStep = async () => {
        if (!validateCurrentQuestion()) return;

        if (step < questions.length - 1) {
            setStep(prev =>
                Math.min(prev + 1, questions.length - 1)
            );

            return;
        }

        await handleFinish();
    };

    const prevStep = () => {
        if (loading) return;

        setStep(prev => Math.max(prev - 1, 0));
    };

    const handleFinish = async () => {
        if (!validateCurrentQuestion()) return;

        try {
            await analyzeAndSave(form);
            setFinished(true);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (error) {
            toast.error(
                "No se pudo procesar el resultado",
                {
                    description:
                        error?.message ||
                        "Inténtalo nuevamente."
                }
            );
        }
    };

    const handleFeedback = async value => {
        try {
            await sendFeedback(value);

            toast.success(
                value === 1
                    ? "Gracias por confirmar tu afinidad."
                    : value === -1
                        ? "Gracias. Usaremos tu opinión para mejorar."
                        : "Tu opinión fue retirada."
            );
        } catch (error) {
            toast.error("No se pudo guardar tu opinión", {
                description:
                    error?.message ||
                    "Inténtalo nuevamente."
            });
        }
    };

    const restartQuiz = () => {
        setForm(INITIAL_FORM);
        setStep(0);
        setFinished(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!questions.length) {
        return (
            <main className="w-full min-h-screen grid place-items-center">
                <div className="card text-center">
                    <h1 className="text-xl font-medium">
                        No hay preguntas disponibles
                    </h1>

                    <p className="text-sm text-muted mt-2">
                        Inténtalo nuevamente más tarde.
                    </p>
                </div>
            </main>
        );
    }

    if (finished && citizenProfile) {
        return (
            <>
                <header className="w-full h-16 bg-white border-b">
                    <div
                        className="w m-auto h-full flex items-center justify-between lg:w"
                        style={{
                            "--w": "90%",
                            "--w-lg": "60%"
                        }}
                    >
                        <Link
                            href="/"
                            className="text-lg font-medium"
                        >
                            Andes Analytics
                        </Link>

                        <span className="badge badge--success">
                            Pulso Ciudadano
                        </span>
                    </div>
                </header>

                <main className="w-full">
                    <section
                        className="w m-auto py-16 lg:w"
                        style={{
                            "--w": "90%",
                            "--w-lg": "60%"
                        }}
                    >
                        <div className="w-full flex flex-col gap-lg">

                            <div className="text-center">
                                <span className="badge badge-primary">
                                    Resultado
                                </span>

                                <h1 className="text-3xl font-medium mt-4">
                                    Tu perfil ciudadano
                                </h1>

                                <p className="text-sm text-muted mt-3">
                                    Este resultado refleja afinidad
                                    programática con planes de gobierno
                                    oficiales. No constituye una recomendación
                                    de voto.
                                </p>
                            </div>

                            <div className="card text-center">
                                <p className="label text-primary">
                                    Perfil predominante
                                </p>

                                <h2 className="text-2xl font-medium mt-2">
                                    {citizenProfile.citizen_profile}
                                </h2>

                                <p className="text-sm text-muted mt-3">
                                    Tu principal prioridad es:
                                </p>

                                <p className="text-xl font-semibold mt-2">
                                    {citizenProfile.primary_priority}
                                </p>
                            </div>

                            <div className="card flex flex-col gap-md">
                                <div>
                                    <h2 className="text-xl font-medium">
                                        Tus prioridades
                                    </h2>

                                    <p className="text-sm text-muted mt-2">
                                        Temas que concentran mayor interés
                                        según tus respuestas.
                                    </p>
                                </div>

                                {citizenProfile.priorities.map(
                                    (priority, index) => {
                                        const maxScore =
                                            citizenProfile
                                                .priorities[0]
                                                ?.score || 1;

                                        const width =
                                            (
                                                priority.score /
                                                maxScore
                                            ) * 100;

                                        return (
                                            <div
                                                key={priority.key}
                                                className="w-full flex flex-col gap-xs"
                                            >
                                                <div className="w-full flex items-center justify-between gap-md">
                                                    <span className="text-sm font-medium">
                                                        {index + 1}.{" "}
                                                        {priority.label}
                                                    </span>

                                                    <span className="text-xs text-muted">
                                                        {priority.score}{" "}
                                                        {priority.score === 1
                                                            ? "punto"
                                                            : "puntos"}
                                                    </span>
                                                </div>

                                                <div
                                                    className="w-full bg-surface rounded-full overflow-hidden"
                                                    style={{
                                                        height: "10px"
                                                    }}
                                                >
                                                    <div
                                                        className="bg-black rounded-full transition-all"
                                                        style={{
                                                            width:
                                                                `${width}%`,
                                                            height: "100%"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            <div className="card flex flex-col gap-md">
                                <div>
                                    <p className="label text-primary">
                                        Afinidad programática
                                    </p>

                                    <h2 className="text-xl font-medium mt-2">
                                        Organizaciones más cercanas a tus
                                        prioridades
                                    </h2>

                                    <p className="text-sm text-muted mt-2">
                                        La afinidad se calcula comparando tus
                                        respuestas con el desarrollo temático
                                        de los planes de gobierno.
                                    </p>
                                </div>

                                {affinityResult?.top_three?.length > 0 ? (
                                    affinityResult.top_three.map(
                                        (item, index) => (
                                            <article
                                                key={item.list_id}
                                                className="w-full border rounded-md p-md flex flex-col gap-sm"
                                            >
                                                <div className="w-full flex items-start justify-between gap-md">
                                                    <div>
                                                        <span className="badge badge-secondary">
                                                            Puesto {index + 1}
                                                        </span>

                                                        <h3 className="text-md font-medium mt-3">
                                                            {
                                                                item.political_organization
                                                            }
                                                        </h3>

                                                        <p className="text-xs text-muted mt-1">
                                                            {
                                                                item.candidate_name
                                                            }
                                                        </p>
                                                    </div>

                                                    <p className="text-2xl font-semibold">
                                                        {Number(
                                                            item.affinity || 0
                                                        ).toFixed(1)}
                                                        %
                                                    </p>
                                                </div>

                                                <div className="w-full bg-surface rounded-full overflow-hidden mt-md"
                                                    style={{
                                                        height: "10px"
                                                    }}
                                                >
                                                    <div
                                                        className="bg-black rounded-full transition-all"
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    Number(
                                                                        item.affinity ||
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`,
                                                            height: "100%"
                                                        }}
                                                    />
                                                </div>

                                                {item.topic_breakdown
                                                    ?.slice(0, 3)
                                                    .length > 0 && (
                                                    <div className="w-full flex flex-wrap gap-sm mt-md">
                                                        {item.topic_breakdown
                                                            .slice(0, 3)
                                                            .map(topic => (
                                                                <span
                                                                    key={
                                                                        topic.topic
                                                                    }
                                                                    className="badge badge-secondary"
                                                                >
                                                                    {topicLabels[
                                                                        topic.topic
                                                                    ] ||
                                                                        topic.topic}
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}
                                            </article>
                                        )
                                    )
                                ) : (
                                    <div className="border rounded-md p-md text-center">
                                        <p className="text-sm text-muted">
                                            No se pudo generar el ranking de
                                            afinidad.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="card text-center">
                                <h2 className="text-lg font-medium">
                                    ¿Este resultado representa tus ideas?
                                </h2>

                                <p className="text-sm text-muted mt-2">
                                    Tu respuesta es opcional y nos ayuda a
                                    mejorar el análisis.
                                </p>

                                <div className="w-full flex flex-col justify-center gap-sm mt-md md:flex-row">
                                    <button
                                        type="button"
                                        className={`btn btn-lg ${
                                            affinityResult?.feedback === 1
                                                ? "btn-primary"
                                                : "btn-secondary"
                                        }`}
                                        disabled={feedbackLoading}
                                        onClick={() =>
                                            handleFeedback(1)
                                        }
                                    >
                                        Me representa
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn btn-lg ${
                                            affinityResult?.feedback === -1
                                                ? "btn-primary"
                                                : "btn-secondary"
                                        }`}
                                        disabled={feedbackLoading}
                                        onClick={() =>
                                            handleFeedback(-1)
                                        }
                                    >
                                        No me representa
                                    </button>
                                </div>

                                {affinityResult?.feedback !== undefined &&
                                    affinityResult?.feedback !== 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm mt-sm"
                                            disabled={feedbackLoading}
                                            onClick={() =>
                                                handleFeedback(0)
                                            }
                                        >
                                            Quitar opinión
                                        </button>
                                    )}

                                {feedbackLoading && (
                                    <p className="text-xs text-muted mt-sm">
                                        Guardando tu opinión...
                                    </p>
                                )}
                            </div>

                            <div className="card card-subtle">
                                <h2 className="text-lg font-medium">
                                    Sobre este resultado
                                </h2>

                                <p className="text-sm text-muted mt-2">
                                    El porcentaje mide coincidencia temática
                                    entre tus prioridades y los planes
                                    analizados. No mide honestidad,
                                    experiencia, intención de voto ni garantiza
                                    el cumplimiento de las propuestas.
                                </p>
                            </div>

                            <div className="w-full flex flex-col gap-sm md:flex-row md:justify-center">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-secondary"
                                    onClick={restartQuiz}
                                >
                                    Responder nuevamente
                                </button>

                                <Link
                                    href="/"
                                    className="btn btn-lg btn-primary"
                                >
                                    Volver al observatorio
                                </Link>
                            </div>

                        </div>
                    </section>
                </main>
            </>
        );
    }

    return (
        <>
            <header className="w-full h-16 bg-white border-b">
                <div
                    className="w m-auto h-full flex items-center justify-between lg:w"
                    style={{
                        "--w": "90%",
                        "--w-lg": "60%"
                    }}
                >
                    <Link
                        href="/"
                        className="text-lg font-medium"
                    >
                        Andes Analytics
                    </Link>

                    <span className="badge badge--success">
                        Pulso Ciudadano
                    </span>
                </div>
            </header>

            <main className="w-full">

                <section
                    className="w m-auto py-12 text-center lg:w"
                    style={{
                        "--w": "90%",
                        "--w-lg": "60%"
                    }}
                >
                    <div className="w-full flex flex-col items-center gap-md">
                        <span className="badge badge-secondary">
                            Participación ciudadana
                        </span>

                        <h1 className="text-3xl font-medium leading-tight">
                            Descubre cuáles son tus
                            <br />
                            prioridades para Jauja
                        </h1>

                        <p className="text-sm text-muted leading-normal">
                            Responde algunas preguntas y conoce tu perfil
                            ciudadano. Tus respuestas serán procesadas de
                            manera anónima y agregada.
                        </p>
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
                                <button
                                    type="button"
                                    className="btn btn-lg btn-secondary"
                                    onClick={prevStep}
                                    disabled={
                                        step === 0 ||
                                        loading
                                    }
                                >
                                    Volver
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-lg btn-primary"
                                    onClick={nextStep}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Procesando..."
                                        : step ===
                                          questions.length - 1
                                            ? "Ver resultado"
                                            : "Continuar"}
                                </button>
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