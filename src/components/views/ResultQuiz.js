'use client'
import { topicLabels } from "@/helpers/quiz.helper";
import Link from "next/link";
import Header from "../layout/header";

export default function ResultQuiz ({ citizenProfile, affinityResult, restartQuiz, feedbackLoading, handleFeedback }) {
    
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

    return (
        <>
            <Header/>

            <main className="w-full">
                <section className="w m-auto py-16 lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div className="text-center">
                                <span className="badge badge-primary">Resultado</span>
                                <h1 className="text-3xl font-medium mt-4">Tu perfil ciudadano</h1>
                                <p className="text-sm text-muted mt-3">Este resultado refleja afinidad programática con planes de gobierno oficiales. No constituye una recomendación de voto.</p>
                            </div>

                            <div className="card text-center">
                                <p className="label text-primary">Perfil predominante</p>
                                <h2 className="text-2xl font-medium mt-2">{citizenProfile.citizen_profile}</h2>
                                <p className="text-sm text-muted mt-3">Tu principal prioridad es:</p>
                                <p className="text-xl font-semibold mt-2">{citizenProfile.primary_priority}</p>
                            </div>

                            <div className="card flex flex-col gap-md">
                                <div>
                                    <h2 className="text-xl font-medium">Tus prioridades</h2>
                                    <p className="text-sm text-muted mt-2">Temas que concentran mayor interés según tus respuestas.</p>
                                </div>
                                {citizenProfile.priorities.map(
                                    (priority, index) => {
                                        const maxScore = citizenProfile.priorities[0] ?.score || 1;
                                        const width = (priority.score / maxScore) * 100;

                                        return (
                                            <div key={priority.key} className="w-full flex flex-col gap-xs">
                                                <div className="w-full flex items-center justify-between gap-md">
                                                    <span className="text-sm font-medium">{index + 1}.{" "} {priority.label}</span>
                                                    <span className="text-xs text-muted">{priority.score}{" "} {priority.score === 1 ? "punto" : "puntos"}</span>
                                                </div>
                                                <div className="w-full bg-surface rounded-full overflow-hidden" style={{height: "10px"}}>
                                                    <div className="bg-black rounded-full transition-all" style={{width: `${width}%`, height: "100%"}}/>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            <div className="card flex flex-col gap-md">
                                <div>
                                    <p className="label text-primary">Afinidad programática</p>
                                    <h2 className="text-xl font-medium mt-2">Organizaciones más cercanas a tus prioridades</h2>
                                    <p className="text-sm text-muted mt-2">La afinidad se calcula comparando tus respuestas con el desarrollo temático de los planes de gobierno.</p>
                                </div>
                                {affinityResult?.top_three?.length > 0 ? (
                                    affinityResult.top_three.map(
                                        (item, index) => (
                                            <article key={item.list_id} className="w-full border rounded-md p-md flex flex-col gap-sm">
                                                <div className="w-full flex items-start justify-between gap-md">
                                                    <div>
                                                        <span className="badge badge-secondary">Puesto {index + 1}</span>
                                                        <h3 className="text-md font-medium mt-3">{item.political_organization}</h3>
                                                        <p className="text-xs text-muted mt-1">{item.candidate_name}</p>
                                                    </div>
                                                    <p className="text-2xl font-semibold">{Number(item.affinity || 0).toFixed(1)}%</p>
                                                </div>
                                                <div className="w-full bg-surface rounded-full overflow-hidden mt-md" style={{height: "10px"}}>
                                                    <div className="bg-black rounded-full transition-all" style={{width:`${Math.min( Number(item.affinity || 0), 100)}%`, height: "100%"}}/>
                                                </div>
                                                {item.topic_breakdown
                                                    ?.slice(0, 3)
                                                    .length > 0 && (
                                                    <div className="w-full flex flex-wrap gap-sm mt-md">
                                                        {item.topic_breakdown
                                                            .slice(0, 3)
                                                            .map(topic => (
                                                                <span key={topic.topic} className="badge badge-secondary">{topicLabels[topic.topic] || topic.topic}</span>
                                                            ))}
                                                    </div>
                                                )}
                                            </article>
                                        )
                                    )
                                ) : (
                                    <div className="border rounded-md p-md text-center">
                                        <p className="text-sm text-muted">No se pudo generar el ranking de afinidad.</p>
                                    </div>
                                )}
                            </div>

                            <div className="card text-center">
                                <h2 className="text-lg font-medium">¿Este resultado representa tus ideas?</h2>
                                <p className="text-sm text-muted mb-2">Tu respuesta es opcional y nos ayuda a mejorar el análisis.</p>
                                <div className="w-full flex flex-col justify-center gap-sm mt-md md:flex-row">
                                    <button type="button" className={`btn btn-lg ${affinityResult?.feedback === 1 ? "btn-primary" : "btn-secondary"}`} disabled={feedbackLoading} onClick={() => handleFeedback(1)}>Me representa</button>
                                    <button type="button" className={`btn btn-lg ${affinityResult?.feedback === -1 ? "btn-primary" : "btn-secondary"}`} disabled={feedbackLoading} onClick={() => handleFeedback(-1)}>No me representa</button>
                                    {affinityResult?.feedback !== undefined &&
                                        affinityResult?.feedback !== 0 && (
                                            <button type="button" className="btn btn-ghost btn-sm mt-sm" disabled={feedbackLoading} onClick={() => handleFeedback(0)}>Quitar opinión</button>
                                        )
                                    }
                                </div>
                                {feedbackLoading && (<p className="text-xs text-muted mt-sm">Guardando tu opinión...</p>)}
                            </div>

                            <div className="card card-subtle">
                                <h2 className="text-lg font-medium">Sobre este resultado</h2>
                                <p className="text-sm text-muted mt-2">El porcentaje mide coincidencia temática entre tus prioridades y los planes analizados. No mide honestidad, experiencia, intención de voto ni garantiza el cumplimiento de las propuestas.</p>
                            </div>

                            <div className="w-full flex flex-col gap-sm md:flex-row md:justify-center">
                                <button type="button" className="btn btn-lg btn-secondary" onClick={shareReferral}> Compartir por WhatsAPP</button>
                                <Link href="/" className="btn btn-lg btn-primary">Volver al observatorio</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </>
    )
}