'use client';

import Link from 'next/link';

function getScoreLabel(score = 0) {
    if (score >= 90) return 'Muy alta';
    if (score >= 80) return 'Alta';
    if (score >= 70) return 'Buena';
    if (score >= 60) return 'Media';
    return 'Baja';
}

function ScoreRow({ label, value }) {
    const score = Number(value ?? 0);

    return (
        <div className="w-full flex flex-col gap-xs">
            <div className="w-full flex items-center justify-between gap-md">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-xs font-medium">{score.toFixed(0)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(score, 100)}%` }}/>
            </div>
        </div>
    );
}

export default function CardCandidateRanking({ item, position }) {
    const score = Number(item?.general_score ?? 0);

    const candidateImage = item?.candidate_image || item?.electoral_lists?.candidate_image || null;

    return (
        <article className="card flex flex-col gap-md">
            <div className="w-full flex items-start justify-between gap-md">
                <div className="flex items-center gap-sm min-w-0">
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
                        {position && (<p className="text-xs text-primary font-medium">Puesto #{position}</p>)}
                        <h3 className="text-md font-medium truncate" title={item?.candidate_name}>{item?.candidate_name}</h3>
                        <p className="text-xs text-muted mt-1 truncate" title={item?.political_organization}>{item?.political_organization}</p>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-3xl font-semibold">{score.toFixed(0)}</p>
                    <p className="text-xs text-muted">Hoja de vida</p>
                </div>
            </div>

            <div className="w-full flex items-center justify-between gap-md">
                <span className="badge badge-primary">{getScoreLabel(score)}</span>
                {item?.years_of_experience !== null &&
                    item?.years_of_experience !== undefined && (
                        <span className="text-xs text-muted">{Number(item.years_of_experience).toFixed(0)} años de experiencia</span>
                    )
                }
            </div>

            <div className="w-full flex flex-col gap-sm">
                <ScoreRow
                    label="Formación académica"
                    value={item?.academic_training_score}
                />

                <ScoreRow
                    label="Especialización"
                    value={item?.specialization_score}
                />

                <ScoreRow
                    label="Gestión pública"
                    value={item?.public_management_score}
                />

                <ScoreRow
                    label="Experiencia ejecutiva"
                    value={item?.executive_experience_score}
                />

                <ScoreRow
                    label="Conocimiento territorial"
                    value={item?.territorial_knowledge_score}
                />

                <ScoreRow
                    label="Liderazgo"
                    value={item?.leadership_score}
                />
            </div>

            <div className="w-full border-t pt-md">
                <div className="grid grid-cols-1 gap-sm">
                    {item?.profession && (
                        <div>
                            <p className="text-xs text-muted">Profesión</p>
                            <p className="text-sm mt-1">{item.profession}</p>
                        </div>
                    )}

                    {item?.highest_position && (
                        <div>
                            <p className="text-xs text-muted">Cargo de mayor responsabilidad</p>
                            <p className="text-sm mt-1">{item.highest_position}</p>
                        </div>
                    )}
                </div>
            </div>
            <Link href={`/candidatos/${item?.id_candidate}`} className="btn btn-secondary btn-md w-full">Ver análisis de hoja de vida</Link>
        </article>
    );
}