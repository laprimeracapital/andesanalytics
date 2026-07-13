'use client';

import { useDB } from "@/context/DBContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateAge, formatDate, getGenderLabel, getStatusClass } from "@/helpers/calculate-slug";

export default function CandidatePage() {

    const { slug } = useParams();

    const { candidates = [], loadCandidates } = useDB();

    const electoralList = candidates.find(
        item => String(item.id_list) === String(slug)
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

    return (
        <>
            <header className="w-full h-16 bg-white border-b">
                <div className="w m-auto h-full flex items-center justify-between lg:w" style={{"--w": "90%","--w-lg": "60%"}}>
                    <Link href="/" className="text-lg font-medium">Andes Analytics</Link>
                    <Link href="/#candidatos" className="btn btn-sm btn-secondary">Volver</Link>
                </div>
            </header>

            <main className="w-full">

                <section className="w-full bg-surface py-16" id="presentacion">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full grid grid-cols-1 gap-lg md:grid-cols-2">
                            <div className="w-full md:col-span-2">
                                <div className="w-full flex flex-col items-start gap-md">
                                    <span className={getStatusClass(listStatus)}>{listStatus}</span>
                                    <div className="flex flex-col gap-sm">
                                        <p className="label text-primary">Candidato provincial</p>
                                        <h1 className="text-3xl font-medium">{mayor?.full_name || "Candidato no disponible"}</h1>
                                        <p className="text-sm text-muted">{politicalOrganization}</p>
                                    </div>
                                    <p className="text-sm text-muted leading-normal">
                                        Consulta la información oficial de la lista,
                                        su candidato a la alcaldía provincial,
                                        regidores y plan de trabajo presentado para
                                        las Elecciones Municipales 2026.
                                    </p>
                                    <div className="w-full flex flex-col gap-sm sm:flex-row">
                                        {workPlan && (
                                            <Link href={workPlan} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary">Ver plan de trabajo</Link>
                                        )}
                                        <Link href="/#comparador" className="btn btn-lg btn-secondary">Comparar propuestas</Link>
                                    </div>
                                </div>
                            </div>
                            <aside className="card card-subtle">
                                <p className="label text-primary">Resumen</p>
                                <div className="w-full flex flex-col gap-md mt-md">
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
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="perfil-candidato" style={{"--w": "90%","--w-lg": "60%"}}>
                    <div className="w-full flex flex-col gap-lg">
                        <div>
                            <p className="label text-primary">Información oficial</p>
                            <h2 className="text-2xl font-medium mt-2">Perfil del candidato</h2>
                        </div>
                        <div className="card">
                            <div className="w-full grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Nombre completo</p>
                                    <p className="text-sm font-medium mt-2">{mayor?.full_name || "No disponible"}</p>
                                </div>
                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Edad</p>
                                    <p className="text-sm font-medium mt-2">{mayorAge ? `${mayorAge} años` : "No disponible"}</p>
                                </div>
                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Sexo</p>
                                    <p className="text-sm font-medium mt-2">{getGenderLabel(mayor?.gender || mayor?.sex)}</p>
                                </div>
                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Estado</p>
                                    <p className="text-sm font-medium mt-2">{mayor?.status || listStatus}</p>
                                </div>

                                {mayor?.birth_date && (
                                    <div className="border rounded-md p-md">
                                        <p className="text-xs text-muted">Fecha de nacimiento</p>
                                        <p className="text-sm font-medium mt-2">{formatDate(mayor.birth_date)}</p>
                                    </div>
                                )}

                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Designado</p>
                                    <p className="text-sm font-medium mt-2">{mayor?.designated ? "Sí" : "No"}</p>
                                </div>

                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Candidato nativo</p>
                                    <p className="text-sm font-medium mt-2">{mayor?.native_candidate ? "Sí" : "No"}</p>
                                </div>

                                <div className="border rounded-md p-md">
                                    <p className="text-xs text-muted">Número en la lista</p>
                                    <p className="text-sm font-medium mt-2">{mayor?.candidate_number ?? 0}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="regidores">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div>
                                <p className="label text-primary">Equipo municipal</p>
                                <h2 className="text-2xl font-medium mt-2">Candidatos a regidores</h2>
                                <p className="text-sm text-muted mt-2">Integrantes registrados en la lista provincial.</p>
                            </div>
                            {councilMembers.length > 0 ? (
                                <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                                    {councilMembers.map((member, index) => {
                                        const age = calculateAge(member.birth_date || member.date_of_birth);
                                        return (
                                            <article key={member.id_candidate || `${member.full_name}-${index}`} className="card">
                                                <div className="w-full flex items-start gap-md">
                                                    <div className="avatar avatar-md">{member.candidate_number ?? index + 1}</div>
                                                    <div className="flex-1 flex flex-col gap-sm">
                                                        <div className="w-full flex items-start justify-between gap-md">
                                                            <div>
                                                                <h3 className="text-sm font-medium">{member.full_name}</h3>
                                                                <p className="text-xs text-muted mt-1">{member.position_name}</p>
                                                            </div>
                                                            <span className={getStatusClass(member.status)}>{member.status || listStatus}</span>
                                                        </div>
                                                        <div className="w-full flex flex-wrap gap-sm mt-md">
                                                            <span className="badge badge-secondary">{getGenderLabel(member.gender || member.sex)}</span>
                                                            {age && (<span className="badge badge-secondary">{age} años</span>)}
                                                            {member.designated && (<span className="badge badge-secondary">Designado</span>)}
                                                            {member.native_candidate && (<span className="badge badge-secondary">Nativo</span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="card text-center">
                                    <p className="text-sm text-muted">No se encontraron regidores registrados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="plan-de-trabajo" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <div className="card text-center flex flex-col gap-sm">
                        <span className="badge badge-primary">Documento oficial</span>
                        <h2 className="text-2xl font-medium">Plan de trabajo municipal</h2>
                        <p className="text-sm text-muted leading-normal">
                            Consulta el documento presentado por la organización
                            política. Andes Analytics publica este enlace con fines
                            informativos y de transparencia electoral.
                        </p>
                        {workPlan ? (
                            <div className="w-full flex flex-col justify-center gap-sm mt-lg sm:flex-row">
                                <Link href={workPlan} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary">Abrir documento PDF</Link>
                                <Link href="/#ranking" className="btn btn-lg btn-secondary">Ver análisis técnico</Link>
                            </div>
                        ) : (
                            <p className="text-sm text-muted mt-md">El plan de trabajo todavía no está disponible.</p>
                        )}
                    </div>
                </section>

                <section className="w-full bg-black py-12">
                    <div className="w m-auto text-center flex flex-col gap-sm lg:w" style={{"--w": "90%","--w-lg": "60%"}}>
                        <h2 className="text-xl text-white font-medium">Información para una decisión ciudadana informada</h2>
                        <p className="text-sm text-white leading-normal">
                            Andes Analytics no respalda ni promueve candidatos u
                            organizaciones políticas. La información presentada
                            proviene de registros y documentos electorales oficiales.
                        </p>
                        <Link href="/pulso-ciudadano" className="btn btn-lg bg-white text-black mt-lg">Participar en Pulso Ciudadano</Link>
                    </div>
                </section>

            </main>
        </>
    );
}