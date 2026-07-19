'use client';

import Link from 'next/link';

function getScoreLabel(score = 0) {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muy sólido';
    if (score >= 70) return 'Sólido';
    if (score >= 60) return 'Intermedio';
    return 'Por fortalecer';
}

function Metric({ label, value }) {
    const score = Number(value ?? 0);

    return (
        <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-md">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-xs font-medium">{score.toFixed(0)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(score, 100)}%` }}/>
            </div>
        </div>
    );
}

export default function CardIntegralRanking({ item, position }) {
    
    const integralScore = Number(item?.integral_score ?? 0);
    const candidateImage = item?.candidate_image || item?.electoral_lists?.candidate_image || null;

    return (
        <article className="card flex flex-col gap-md">
            <div className="w-full flex items-start justify-between gap-md">
                <div className="flex items-center gap-md min-w-0">
                    <div className="avatar avatar-lg overflow-hidden">
                        {candidateImage ? (
                            <img src={candidateImage} alt={item?.candidate_name || 'Candidato'} className="w-full h-full object-cover"/>
                        ) : (
                            <span>
                                {item?.candidate_name
                                    ?.split(' ')
                                    ?.slice(0, 2)
                                    ?.map(name => name[0])
                                    ?.join('')}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0">
                        {position && (
                            <p className="text-xs text-primary font-medium">
                                Puesto #{position}
                            </p>
                        )}

                        <h3 className="text-md font-medium truncate">
                            {item?.candidate_name}
                        </h3>

                        <p className="text-xs text-muted mt-1 truncate">
                            {item?.political_organization}
                        </p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-4xl font-semibold">
                        {integralScore.toFixed(0)}
                    </p>

                    <p className="text-xs text-muted">
                        Índice integral
                    </p>
                </div>
            </div>

            <div className="w-full flex items-center justify-between">
                <span className="badge badge-success">
                    {getScoreLabel(integralScore)}
                </span>

                <span className="text-xs text-muted">
                    Escala de 0 a 100
                </span>
            </div>

            <div className="w-full grid grid-cols-3 gap-sm">
                <div className="card card-compact text-center">
                    <p className="text-xl font-semibold">
                        {Number(item?.plan_score ?? 0).toFixed(0)}
                    </p>

                    <p className="text-xs text-muted mt-1">
                        Plan
                    </p>
                </div>

                <div className="card card-compact text-center">
                    <p className="text-xl font-semibold">
                        {Number(item?.candidate_profile_score ?? 0).toFixed(0)}
                    </p>

                    <p className="text-xs text-muted mt-1">
                        Hoja de vida
                    </p>
                </div>

                <div className="card card-compact text-center">
                    <p className="text-xl font-semibold">
                        {Number(item?.plan_execution_alignment_score ?? 0).toFixed(0)}
                    </p>

                    <p className="text-xs text-muted mt-1">
                        Correspondencia
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-sm">
                <Metric
                    label="Gobernabilidad"
                    value={item?.governance_score}
                />

                <Metric
                    label="Capacidad de ejecución"
                    value={item?.execution_score}
                />

                <Metric
                    label="Consistencia técnica"
                    value={item?.technical_consistency_score}
                />

                <Metric
                    label="Respuesta territorial"
                    value={item?.territorial_response_score}
                />

                <Metric
                    label="Comunicación estratégica"
                    value={item?.strategic_communication_score}
                />
            </div>

            {item?.integral_summary && (
                <p className="text-xs text-muted leading-normal line-clamp-3">
                    {item.integral_summary}
                </p>
            )}

            <Link
                href={`/candidatos/${item?.id_candidate}`}
                className="btn btn-primary btn-md w-full"
            >
                Ver evaluación integral
            </Link>
        </article>
    );
}