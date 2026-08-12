'use client';

import { useDB } from "@/context/DBContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateAge, formatDate, getGenderLabel, getStatusClass } from "@/helpers/calculate-slug";
import Header from "@/components/layout/header";
import ProgressBar from "@/components/Progress/ProgressBar";
import Image from "next/image";

function getFirstRecord(value) {
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
}

function parseMaybeJson(value, fallback = null) {
    if (value === null || value === undefined || value === "") return fallback;
    if (Array.isArray(value) || typeof value === "object") return value;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function toArray(value) {
    const parsed = parseMaybeJson(value, []);

    if (Array.isArray(parsed)) return parsed.filter(Boolean);

    if (parsed && typeof parsed === "object") {
        return Object.entries(parsed).map(([key, item]) => ({
            label: formatLabel(key),
            value: item
        }));
    }

    if (parsed) return [String(parsed)];

    return [];
}

function toNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const number = Number(value);

    if (Number.isNaN(number)) return null;

    return number;
}

function formatScore(value) {
    const number = toNumber(value);

    if (number === null) return "No disponible";

    return number.toFixed(2);
}

function formatLabel(value = "") {
    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function scoreLevel(value) {
    const number = toNumber(value);

    if (number === null) return "Sin dato";
    if (number >= 90) return "Muy alto";
    if (number >= 80) return "Alto";
    if (number >= 70) return "Medio alto";
    if (number >= 60) return "Medio";
    return "Bajo";
}

function ScoreCard({ label, value, detail }) {
    const number = toNumber(value);
    const width = number === null ? 0 : Math.max(0, Math.min(100, number));

    return (
        <div className="border border-solid border-default rounded-md p-4">
            <div className="w-full flex items-start justify-between gap-md">
                <div>
                    <p className="text-xs text-muted">{label}</p>
                    <p className="text-2xl font-medium mt-2">{number === null ? "—" : number.toFixed(2)}</p>
                </div>
                <span className="badge badge-secondary">{scoreLevel(number)}</span>
            </div>

            <ProgressBar score={width} />

            {detail && ( <p className="text-xs text-muted mt-2">{detail}</p> )}
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="border border-solid border-default bg-surface-secondary rounded-md p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="text-sm font-medium mt-2">
                {value || "No disponible"}
            </p>
        </div>
    );
}

function SectionHeader({ label, title, description }) {
    return (
        <div>
            <p className="label text-primary">{label}</p>
            <h2 className="text-2xl font-medium mt-2">{title}</h2>
            {description && (
                <p className="text-sm text-muted mt-2 leading-normal">
                    {description}
                </p>
            )}
        </div>
    );
}

function EmptyAnalysis({ title = "Análisis no disponible" }) {
    return (
        <div className="card text-center">
            <p className="text-sm text-muted">
                {title}. Verifica que la consulta de Supabase esté trayendo esta relación.
            </p>
        </div>
    );
}

function TextList({ items, emptyText = "No hay información registrada." }) {
    const list = toArray(items);

    if (!list.length) {
        return (
            <p className="text-sm text-muted">
                {emptyText}
            </p>
        );
    }

    return (
        <ul className="w-full flex flex-col gap-sm">
            {list.map((item, index) => {
                if (typeof item === "object" && item?.label) {
                    return (
                        <li key={`${item.label}-${index}`} className="text-sm leading-normal">
                            <span className="font-medium">{item.label}:</span>{" "}
                            <span className="text-muted">{String(item.value)}</span>
                        </li>
                    );
                }

                return (
                    <li key={`${String(item)}-${index}`} className="text-sm leading-normal">
                        {String(item)}
                    </li>
                );
            })}
        </ul>
    );
}

function ProposalGrid({ proposals }) {
    const data = parseMaybeJson(proposals, {});
    const entries = Object.entries(data || {});

    if (!entries.length) {
        return (
            <p className="text-sm text-muted">
                No hay propuestas sectoriales registradas.
            </p>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
            {entries.map(([key, value]) => (
                <ScoreCard
                    key={key}
                    label={formatLabel(key)}
                    value={value}
                    detail="Cantidad o peso sectorial registrado"
                />
            ))}
        </div>
    );
}

function ProfessionalExperience({ items }) {
    const list = toArray(items);

    if (!list.length) {
        return (
            <p className="text-sm text-muted">
                No hay experiencia profesional registrada.
            </p>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
            {list.map((item, index) => {
                const title =
                    item.institution ||
                    item.centroTrabajo ||
                    item.label ||
                    "Experiencia registrada";

                const position =
                    item.position ||
                    item.ocupacionProfesion ||
                    item.value ||
                    "Cargo no disponible";

                const place = [
                    item.district,
                    item.province,
                    item.department
                ].filter(Boolean).join(", ");

                const years = [
                    item.year_from || item.anioTrabajoDesde,
                    item.year_to || item.anioTrabajoHasta
                ].filter(Boolean).join(" - ");

                return (
                    <article key={`${title}-${index}`} className="border rounded-md p-md">
                        <p className="text-xs text-muted">
                            {item.sector || "Experiencia"}
                        </p>
                        <h3 className="text-sm font-medium mt-2">
                            {title}
                        </h3>
                        <p className="text-sm text-muted mt-1">
                            {position}
                        </p>

                        <div className="w-full flex flex-wrap gap-sm mt-md">
                            {years && (
                                <span className="badge badge-secondary">
                                    {years}
                                </span>
                            )}
                            {place && (
                                <span className="badge badge-secondary">
                                    {place}
                                </span>
                            )}
                        </div>

                        {item.comment && (
                            <p className="text-xs text-muted leading-normal mt-md">
                                {item.comment}
                            </p>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

function AcademicBackground({ items }) {
    const list = toArray(items);

    if (!list.length) {
        return (
            <p className="text-sm text-muted">
                No hay formación académica registrada.
            </p>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
            {list.map((item, index) => {
                const institution =
                    item.institution ||
                    item.universidad ||
                    item.label ||
                    "Institución no disponible";

                const degree =
                    item.degree ||
                    item.carreraUni ||
                    item.value ||
                    "Grado no disponible";

                return (
                    <article key={`${institution}-${index}`} className="border rounded-md p-md">
                        <p className="text-xs text-muted">
                            {item.status || "Formación académica"}
                        </p>
                        <h3 className="text-sm font-medium mt-2">
                            {degree}
                        </h3>
                        <p className="text-sm text-muted mt-1">
                            {institution}
                        </p>

                        {item.year && (
                            <span className="badge badge-secondary mt-md">
                                {item.year}
                            </span>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

function TextBlock({ title, children }) {
    if (!children) return null;

    return (
        <div className="border rounded-md p-md">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-sm text-muted leading-normal mt-2">
                {children}
            </p>
        </div>
    );
}

export default function CandidatePage() {

    const { slug } = useParams();

    const { candidates = [], loadCandidates } = useDB();

    const electoralList = candidates.find(
        item => String(item.slug) === String(slug)
    );

    if (loadCandidates) {
        return (
            <main className="w-full min-h-screen grid place-items-center">
                <div className="card text-center">
                    <p className="text-sm text-muted">
                        Cargando información electoral...
                    </p>
                </div>
            </main>
        );
    }

    if (!electoralList) {
        return (
            <main className="w-full min-h-screen grid place-items-center">
                <div className="card text-center">
                    <h1 className="text-xl font-medium">
                        Lista no encontrada
                    </h1>

                    <p className="text-sm text-muted mt-2">
                        No encontramos información de esta organización política.
                    </p>

                    <Link
                        href="/#candidatos"
                        className="btn btn-primary mt-md"
                    >
                        Volver a candidatos
                    </Link>
                </div>
            </main>
        );
    }

    const members = electoralList.electoral_candidates || [];

    const mayor = members.find(candidate =>
        candidate.position_name
            ?.toUpperCase()
            .includes("ALCALDE")
    );

    const councilMembers = members
        .filter(candidate =>
            candidate.position_name
                ?.toUpperCase()
                .includes("REGIDOR")
        )
        .sort(
            (first, second) =>
                Number(first.candidate_number || 0) -
                Number(second.candidate_number || 0)
        );

    const politicalOrganization =
        electoralList.political_organization ||
        electoralList.organization_name ||
        "Organización política";

    const listStatus =
        electoralList.list_status ||
        mayor?.status ||
        "Sin estado";

    const workPlan =
        electoralList.work_plan || null;

    const mayorAge = calculateAge(
        mayor?.birth_date ||
        mayor?.date_of_birth
    );

    const planAnalysis = getFirstRecord(
        electoralList.electoral_plan_analysis ||
        electoralList.plan_analysis
    );

    const candidateAnalysis = getFirstRecord(
        electoralList.electoral_candidate_analysis ||
        mayor?.electoral_candidate_analysis ||
        electoralList.candidate_analysis
    );

    const integralAnalysis = getFirstRecord(
        electoralList.electoral_integral_analysis ||
        electoralList.integral_analysis
    );

    const planStrengths = toArray(planAnalysis?.strengths);
    const planWeaknesses = toArray(planAnalysis?.weaknesses);
    const mainProjects = toArray(planAnalysis?.main_projects);

    const candidateImage = electoralList?.candidate_image || electoralList?.electoral_lists?.candidate_image || null;
    
    const candidateStrengths = toArray(candidateAnalysis?.strengths);
    const candidateWeaknesses = toArray(candidateAnalysis?.weaknesses);
    const professionalExperience = toArray(candidateAnalysis?.professional_experience);
    const academicBackground = toArray(candidateAnalysis?.academic_background);
    const specializations = toArray(candidateAnalysis?.specializations);
    const recognitions = toArray(candidateAnalysis?.recognitions);

    console.log(specializations);

    return (
        <>
            <Header/>

            <main className="w-full">

                <section className="w-full bg-surface py-16" id="presentacion">

                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>

                        <div className="w-full">
                            
                            <div className="w-full md:col-span-2">
                                <div className="w-full flex flex-col items-start gap-md">
                                    <span className={getStatusClass(listStatus)}>{listStatus}</span>
                                    <div className="flex flex-col gap-md lg:flex-row">
                                        <div className="w h rounded-md" style={{"--w": "240px", "--mnw": "240px", "--h": "240px"}}>
                                            <Image src={candidateImage} width={240} height={240} alt={`${mayor?.position_name} ${mayor?.full_name}`} />
                                        </div>
                                        <div className="w-full">
                                            <p className="label text-primary">Candidato provincial</p>
                                            <h1 className="text-3xl font-medium">{mayor?.full_name || "Candidato no disponible"}</h1>
                                            <p className="text-sm text-muted">{politicalOrganization}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted leading-normal">Consulta la información oficial de la lista, su candidato a la alcaldía provincial, regidores, plan de trabajo y análisis técnico elaborado por Andes Analytics para las Elecciones Municipales 2026.</p>
                                    <aside className="w-full card card-subtle">

                                        <p className="label text-primary">Resumen</p>

                                        <div className="w-full grid grid-cols-1 gap-md mt-md lg:grid-cols-5">
                                            <div>
                                                <p className="text-xs text-muted">Cargo</p>
                                                <p className="text-sm font-medium mt-1">{mayor?.position_name || "Alcalde provincial"}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted">Organización</p>
                                                <p className="text-sm font-medium mt-1">{politicalOrganization}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted">Integrantes</p>
                                                <p className="text-sm font-medium mt-1">{members.length}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted">Estado de la lista</p>
                                                <p className="text-sm font-medium mt-1">{listStatus}</p>
                                            </div>

                                            {integralAnalysis?.integral_score && (
                                                <div>
                                                    <p className="text-xs text-muted">Índice integral</p>
                                                    <p className="text-sm font-medium mt-1">{formatScore(integralAnalysis.integral_score)} / 100</p>
                                                </div>
                                            )}

                                        </div>

                                    </aside>
                                    <div className="w-full flex flex-col gap-sm sm:flex-row">
                                        {workPlan && (
                                            <Link href={workPlan} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary" >Ver plan de trabajo</Link>
                                        )}
                                        <Link href="/#comparador" className="btn btn-lg btn-secondary" >Comparar propuestas</Link>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>

                <section
                    className="w m-auto py-16 lg:w"
                    id="perfil-candidato"
                    style={{"--w": "90%","--w-lg": "60%"}}
                >
                    <div className="w-full flex flex-col gap-lg">
                        <SectionHeader
                            label="Información oficial"
                            title="Perfil del candidato"
                        />

                        <div className="card">
                            <div className="w-full grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
                                <InfoCard
                                    label="Nombre completo"
                                    value={mayor?.full_name || "No disponible"}
                                />

                                <InfoCard
                                    label="Edad"
                                    value={mayorAge ? `${mayorAge} años` : "No disponible"}
                                />

                                <InfoCard
                                    label="Sexo"
                                    value={getGenderLabel(mayor?.gender || mayor?.sex)}
                                />

                                <InfoCard
                                    label="Estado"
                                    value={mayor?.status || listStatus}
                                />

                                {(mayor?.birth_date || mayor?.date_of_birth) && (
                                    <InfoCard
                                        label="Fecha de nacimiento"
                                        value={formatDate(mayor?.birth_date || mayor?.date_of_birth)}
                                    />
                                )}

                                <InfoCard
                                    label="Designado"
                                    value={mayor?.designated ? "Sí" : "No"}
                                />

                                <InfoCard
                                    label="Candidato nativo"
                                    value={mayor?.native_candidate ? "Sí" : "No"}
                                />

                                <InfoCard
                                    label="Número en la lista"
                                    value={mayor?.candidate_number ?? 0}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="analisis-integral">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <SectionHeader label="Inteligencia electoral" title="Análisis integral" description="Cruza el plan de gobierno, el perfil profesional y la capacidad de ejecución del candidato."/>
                            {integralAnalysis ? (
                                <>
                                    <div className="w-full grid grid-cols-1 gap-md md:grid-cols-3">
                                        <ScoreCard
                                            label="Índice integral"
                                            value={integralAnalysis.integral_score}
                                            detail="Resultado ponderado final"
                                        />

                                        <ScoreCard
                                            label="Plan de gobierno"
                                            value={integralAnalysis.plan_score}
                                            detail="Peso técnico del documento"
                                        />

                                        <ScoreCard
                                            label="Perfil del candidato"
                                            value={integralAnalysis.candidate_profile_score}
                                            detail="Trayectoria y capacidades"
                                        />

                                        <ScoreCard
                                            label="Alineamiento plan-perfil"
                                            value={integralAnalysis.plan_execution_alignment_score}
                                            detail="Coherencia entre propuesta y experiencia"
                                        />

                                        <ScoreCard
                                            label="Gobernabilidad"
                                            value={integralAnalysis.governance_score}
                                        />

                                        <ScoreCard
                                            label="Ejecución"
                                            value={integralAnalysis.execution_score}
                                        />

                                        <ScoreCard
                                            label="Consistencia técnica"
                                            value={integralAnalysis.technical_consistency_score}
                                        />

                                        <ScoreCard
                                            label="Respuesta territorial"
                                            value={integralAnalysis.territorial_response_score}
                                        />

                                        <ScoreCard
                                            label="Comunicación estratégica"
                                            value={integralAnalysis.strategic_communication_score}
                                        />
                                    </div>
                                </>
                            ) : (
                                <EmptyAnalysis title="Todavía no existe análisis integral" />
                            )}
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="analisis-plan" style={{"--w": "90%", "--w-lg": "60%"}}>

                    <div className="w-full flex flex-col gap-lg">
                        <SectionHeader label="Plan de gobierno" title="Análisis técnico del plan" description="Evaluación documental del plan de trabajo presentado por la organización política." />

                        {planAnalysis ? (
                            <>
                                <div className="w-full grid grid-cols-1 gap-md md:grid-cols-3">
                                    <ScoreCard
                                        label="Puntaje general"
                                        value={planAnalysis.general_score}
                                    />

                                    <ScoreCard
                                        label="Claridad"
                                        value={planAnalysis.clarity_score}
                                    />

                                    <ScoreCard
                                        label="Viabilidad"
                                        value={planAnalysis.viability_score}
                                    />

                                    <ScoreCard
                                        label="Innovación"
                                        value={planAnalysis.innovation_score}
                                    />

                                    <ScoreCard
                                        label="Impacto"
                                        value={planAnalysis.impact_score}
                                    />

                                    <ScoreCard
                                        label="Sustento técnico"
                                        value={planAnalysis.technical_support_score}
                                    />

                                    <ScoreCard
                                        label="Enfoque local"
                                        value={planAnalysis.local_focus_score}
                                    />

                                    <InfoCard
                                        label="Viabilidad presupuestal"
                                        value={planAnalysis.budget_viability}
                                    />

                                    <InfoCard
                                        label="Originalidad"
                                        value={planAnalysis.originality}
                                    />
                                </div>

                                {planAnalysis.summary && (
                                    <div className="card">
                                        <h3 className="text-sm font-medium">
                                            Resumen del plan
                                        </h3>
                                        <p className="text-sm text-muted leading-normal mt-2">
                                            {planAnalysis.summary}
                                        </p>
                                    </div>
                                )}

                                <div className="card">
                                    <h3 className="text-sm font-medium">
                                        Propuestas por sector
                                    </h3>
                                    <div className="mt-md">
                                        <ProposalGrid proposals={planAnalysis.proposals} />
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-1 gap-md md:grid-cols-3">
                                    <div className="card">
                                        <h3 className="text-sm font-medium">
                                            Fortalezas del plan
                                        </h3>
                                        <div className="mt-md">
                                            <TextList items={planStrengths} />
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="text-sm font-medium">
                                            Debilidades del plan
                                        </h3>
                                        <div className="mt-md">
                                            <TextList items={planWeaknesses} />
                                        </div>
                                    </div>

                                    <div className="card md:col-span-2">
                                        <h3 className="text-sm font-medium">
                                            Proyectos principales
                                        </h3>
                                        <div className="mt-md">
                                            <TextList items={mainProjects} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyAnalysis title="Todavía no existe análisis del plan de gobierno" />
                        )}
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="analisis-candidato" >
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <SectionHeader
                                label="Perfil profesional"
                                title="Análisis del candidato"
                                description="Evaluación de formación académica, trayectoria pública, experiencia ejecutiva y capacidad técnica."
                            />

                            {candidateAnalysis ? (
                                <>
                                    <div className="w-full grid grid-cols-1 gap-md md:grid-cols-3">
                                        <ScoreCard
                                            label="Perfil general"
                                            value={candidateAnalysis.general_score}
                                        />

                                        <ScoreCard
                                            label="Formación académica"
                                            value={candidateAnalysis.academic_training_score}
                                        />

                                        <ScoreCard
                                            label="Especialización"
                                            value={candidateAnalysis.specialization_score}
                                        />

                                        <ScoreCard
                                            label="Gestión pública"
                                            value={candidateAnalysis.public_management_score}
                                        />

                                        <ScoreCard
                                            label="Experiencia ejecutiva"
                                            value={candidateAnalysis.executive_experience_score}
                                        />

                                        <ScoreCard
                                            label="Experiencia municipal"
                                            value={candidateAnalysis.municipal_experience_score}
                                        />

                                        <ScoreCard
                                            label="Experiencia regional"
                                            value={candidateAnalysis.regional_experience_score}
                                        />

                                        <ScoreCard
                                            label="Sector privado"
                                            value={candidateAnalysis.private_sector_experience_score}
                                        />

                                        <ScoreCard
                                            label="Capacidad técnica"
                                            value={candidateAnalysis.technical_capacity_score}
                                        />

                                        <ScoreCard
                                            label="Conocimiento territorial"
                                            value={candidateAnalysis.territorial_knowledge_score}
                                        />

                                        <ScoreCard
                                            label="Liderazgo"
                                            value={candidateAnalysis.leadership_score}
                                        />

                                        <ScoreCard
                                            label="Gobernanza"
                                            value={candidateAnalysis.governance_capacity_score}
                                        />

                                        <ScoreCard
                                            label="Alineamiento con plan"
                                            value={candidateAnalysis.plan_alignment_score}
                                        />
                                    </div>

                                    <div className="w-full grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
                                        <InfoCard label="Profesión" value={candidateAnalysis.profession} />
                                        <InfoCard label="Nivel educativo" value={candidateAnalysis.education_level} />
                                        <InfoCard label="Cargo más alto" value={candidateAnalysis.highest_position} />
                                        <InfoCard label="Años de experiencia" value={candidateAnalysis.years_of_experience ? `${formatScore(candidateAnalysis.years_of_experience)} años` : "No disponible"}/>
                                        <InfoCard label="Años en sector público" value={candidateAnalysis.years_public_sector ? `${formatScore(candidateAnalysis.years_public_sector)} años` : "No disponible"}/>
                                        <InfoCard label="Cargos de gestión" value={candidateAnalysis.management_positions_count} />
                                        <InfoCard label="Entidades municipales" value={candidateAnalysis.municipal_entities_count} />
                                        <InfoCard label="Entidades públicas" value={candidateAnalysis.public_entities_count} />
                                    </div>

                                    <div className="w-full grid grid-cols-1 gap-md">
                                        <TextBlock title="Resumen del perfil">{candidateAnalysis.profile_summary}</TextBlock>
                                        <TextBlock title="Capacidad de ejecución">{candidateAnalysis.execution_capacity}</TextBlock>
                                        <TextBlock title="Riesgos del perfil">{candidateAnalysis.profile_risks}</TextBlock>
                                    </div>

                                    <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                                        <div className="card">
                                            <h3 className="text-sm font-medium mb-4">
                                                Fortalezas del candidato
                                            </h3>
                                            <div className="mt-md">
                                                <TextList items={candidateStrengths} />
                                            </div>
                                        </div>

                                        <div className="card">
                                            <h3 className="text-sm font-medium">
                                                Debilidades del candidato
                                            </h3>
                                            <div className="mt-md">
                                                <TextList items={candidateWeaknesses} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="text-sm font-medium">
                                            Experiencia profesional
                                        </h3>
                                        <div className="mt-md">
                                            <ProfessionalExperience items={professionalExperience} />
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 className="text-sm font-medium">
                                            Formación académica
                                        </h3>
                                        <div className="mt-md">
                                            <AcademicBackground items={academicBackground} />
                                        </div>
                                    </div>

                                    <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                                        <div className="card">
                                            <h3 className="text-sm font-medium">
                                                Especializaciones
                                            </h3>
                                            <div className="w-full flex flex-wrap gap-sm mt-md">
                                                {specializations.length ? (
                                                    specializations.map((item, index) => (
                                                        <span
                                                            key={`${item}-${index}`}
                                                            className="badge badge-secondary"
                                                        >
                                                            {String(item)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted">
                                                        No hay especializaciones registradas.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card">
                                            <h3 className="text-sm font-medium">
                                                Reconocimientos o hitos
                                            </h3>
                                            <div className="mt-md">
                                                <TextList items={recognitions} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <EmptyAnalysis title="Todavía no existe análisis del perfil del candidato" />
                            )}
                        </div>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="regidores">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div>
                                <p className="label text-primary">Equipo municipal</p>
                                <h2 className="text-2xl font-medium mt-2">
                                    Candidatos a regidores
                                </h2>
                                <p className="text-sm text-muted mt-2">
                                    Integrantes registrados en la lista provincial.
                                </p>
                            </div>

                            {councilMembers.length > 0 ? (
                                <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                                    {councilMembers.map((member, index) => {
                                        const age = calculateAge(member.birth_date || member.date_of_birth);

                                        return (
                                            <article
                                                key={member.id_candidate || `${member.full_name}-${index}`}
                                                className="card"
                                            >
                                                <div className="w-full flex items-start gap-md">
                                                    <div className="avatar avatar-md">
                                                        {member.candidate_number ?? index + 1}
                                                    </div>

                                                    <div className="flex-1 flex flex-col gap-sm">
                                                        <div className="w-full flex items-start justify-between gap-md">
                                                            <div>
                                                                <h3 className="text-sm font-medium">
                                                                    {member.full_name}
                                                                </h3>
                                                                <p className="text-xs text-muted mt-1">
                                                                    {member.position_name}
                                                                </p>
                                                            </div>

                                                            <span className={getStatusClass(member.status)}>
                                                                {member.status || listStatus}
                                                            </span>
                                                        </div>

                                                        <div className="w-full flex flex-wrap gap-sm mt-md">
                                                            <span className="badge badge-secondary">
                                                                {getGenderLabel(member.gender || member.sex)}
                                                            </span>

                                                            {age && (
                                                                <span className="badge badge-secondary">
                                                                    {age} años
                                                                </span>
                                                            )}

                                                            {member.designated && (
                                                                <span className="badge badge-secondary">
                                                                    Designado
                                                                </span>
                                                            )}

                                                            {member.native_candidate && (
                                                                <span className="badge badge-secondary">
                                                                    Nativo
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="card text-center">
                                    <p className="text-sm text-muted">
                                        No se encontraron regidores registrados.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className="w m-auto py-16 lg:w"
                    id="plan-de-trabajo"
                    style={{"--w": "90%", "--w-lg": "60%"}}
                >
                    <div className="card text-center flex flex-col gap-sm">
                        <span className="badge badge-primary">
                            Documento oficial
                        </span>

                        <h2 className="text-2xl font-medium">
                            Plan de trabajo municipal
                        </h2>

                        <p className="text-sm text-muted leading-normal">
                            Consulta el documento presentado por la organización
                            política. Andes Analytics publica este enlace con fines
                            informativos y de transparencia electoral.
                        </p>

                        {workPlan ? (
                            <div className="w-full flex flex-col justify-center gap-sm mt-lg sm:flex-row">
                                <Link
                                    href={workPlan}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-lg btn-primary"
                                >
                                    Abrir documento PDF
                                </Link>

                                <Link
                                    href="#analisis-plan"
                                    className="btn btn-lg btn-secondary"
                                >
                                    Ver análisis técnico
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-muted mt-md">
                                El plan de trabajo todavía no está disponible.
                            </p>
                        )}
                    </div>
                </section>

                <section className="w-full bg-black py-12">
                    <div
                        className="w m-auto text-center flex flex-col gap-sm lg:w"
                        style={{"--w": "90%","--w-lg": "60%"}}
                    >
                        <h2 className="text-xl text-white font-medium">
                            Información para una decisión ciudadana informada
                        </h2>

                        <p className="text-sm text-white leading-normal">
                            Andes Analytics no respalda ni promueve candidatos u
                            organizaciones políticas. La información presentada
                            proviene de registros y documentos electorales oficiales.
                        </p>

                        <Link
                            href="/pulso-ciudadano"
                            className="btn btn-lg bg-white text-black mt-lg"
                        >
                            Participar en Pulso Ciudadano
                        </Link>
                    </div>
                </section>

            </main>
        </>
    );
}