'use client';

import CandidateCard from "@/components/Cards/CandidateCard";
import { useDB } from "@/context/DBContext";
import Link from "next/link";
import { useMemo, useState } from "react";
import { demoProposals, electoralSummary, demoRanking, electorate, topics } from "@/helpers/panel";
import { metodologia } from "@/db/db";
import TablePadron from "@/components/Tables/TablePadron";
import TableComparation from "@/components/Tables/TableComparation";

export default function Page() {

    const { candidates = [] } = useDB();

    const organizations = useMemo(() => {
        return candidates.map(item => item.political_organization);
    }, [candidates]);

    const [firstOrganization, setFirstOrganization] = useState(
        organizations[0] || "PODEMOS PERU"
    );

    const [secondOrganization, setSecondOrganization] = useState(
        organizations[1] || "ALIANZA PARA EL PROGRESO"
    );

    const firstProposal = demoProposals[firstOrganization] || {};
    const secondProposal = demoProposals[secondOrganization] || {};

    return (
        <>
            <header className="w-full h-16 bg-white border-b">
                <div className="w m-auto flex items-center justify-between h-full lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <Link href="/" className="text-lg font-medium">Andes Analytics</Link>
                    <span className="badge badge-success badge--success">Activo</span>
                </div>
            </header>

            <main className="w-full">

                <section className="w m-auto text-center h grid place-items-center lg:w" id="inicio" style={{"--w": "90%", "--w-lg": "60%", "--h": "calc(100dvh - var(--space-16))"}}>
                    <div className="w-full flex flex-col items-center gap-lg">
                        <span className="badge badge-primary">Elecciones provinciales 2026</span>
                        <div className="w-full flex flex-col gap-md">
                            <h1 className="text-4xl font-regular leading-tight">
                                Análisis de los{" "}
                                <b>candidatos provinciales</b>
                                <br />
                                de Jauja
                            </h1>
                            <p className="text-muted text-sm leading-normal lg:text-md">
                                Analizamos información oficial, planes de gobierno,
                                padrón electoral y estudios de opinión para facilitar
                                una decisión ciudadana informada.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-md">
                            <Link href="#candidatos" className="btn btn-primary btn-lg">Candidatos</Link>
                            <Link href="#comparador" className="btn btn-secondary btn-lg">Comparar propuestas</Link>
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-12 lg:w" id="resumen" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <div className="w-full flex flex-col gap-lg">
                        <div className="text-center">
                            <p className="label text-primary">Panorama electoral</p>
                            <h2 className="text-2xl mt-2">Información general del proceso</h2>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-md lg:grid-cols-4">
                            {electoralSummary.map(item => (
                                <article key={item.label} className="card card-compact text-center">
                                    <p className="text-3xl font-semibold">{item.value}</p>
                                    <p className="text-xs text-muted mt-2">{item.label}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="candidatos">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div className="text-center">
                                <p className="label text-primary">Listas electorales</p>
                                <h2 className="text-2xl mt-2">Candidatos provinciales</h2>
                                <p className="text-sm text-muted mt-3">Consulta las listas, candidatos y planes de trabajo presentados ante los organismos electorales.</p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
                                {candidates.length > 0 ? (
                                    candidates.map(item => (
                                        <CandidateCard key={item.id_list} item={item}/>
                                    ))
                                ) : (
                                    <div className="card col-span-full text-center">
                                        <p className="text-muted">No hay candidatos disponibles.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="comparador" style={{"--w": "90%","--w-lg": "60%"}}>
                    <div className="w-full flex flex-col gap-lg">
                        <div className="text-center">
                            <p className="label text-primary">Comparador</p>
                            <h2 className="text-2xl mt-2">Compara las propuestas</h2>
                            <p className="text-sm text-muted mt-3">Los puntajes representan el nivel de presencia y desarrollo de cada tema dentro del plan de gobierno.</p>
                        </div>
                        <TableComparation/>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="ranking">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div className="text-center">
                                <p className="label text-primary">Evaluación documental</p>
                                <h2 className="text-2xl mt-2">Índice técnico de planes de gobierno</h2>
                                <p className="text-sm text-muted mt-3">Este índice evalúa claridad, viabilidad, impacto, innovación, sustento técnico y enfoque local.</p>
                            </div>
                            <div className="card">
                                <div className="w-full flex flex-col gap-md">
                                    {demoRanking.map((item, index) => (
                                        <article key={item.organization} className="w-full flex items-center gap-md border-b pb-md">
                                            <div className="avatar avatar-md">{index + 1}</div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium">{item.organization}</h3>
                                                <p className="text-xs text-muted mt-1">{item.candidate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-semibold">{item.score}</p>
                                                <p className="text-xs text-muted">de 100</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted text-center">El índice no representa intención de voto ni predice resultados electorales.</p>
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="electorado" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <div className="w-full flex flex-col gap-lg">
                        <div className="text-center">
                            <p className="label text-primary">Padrón electoral</p>
                            <h2 className="text-2xl mt-2">Radiografía del electorado de Jauja</h2>
                            <p className="text-sm text-muted mt-3">Información consolidada de los 34 distritos de la provincia.</p>
                        </div>
                        <TablePadron/>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="metodologia">
                    <div className="w m-auto lg:w" style={{"--w": "90%","--w-lg": "60%" }}>
                        <div className="w-full grid grid-cols-1 gap-lg lg:grid-cols-2">
                            <div className="flex flex-col gap-md">
                                <p className="label text-primary">Transparencia</p>
                                <h2 className="text-2xl">¿Cómo analizamos la información?</h2>
                                <p className="text-sm text-muted leading-normal">
                                    Utilizamos información electoral oficial,
                                    documentos públicos y modelos de análisis
                                    estructurados. Los resultados documentales no
                                    representan preferencias políticas ni intención
                                    de voto.
                                </p>
                                <Link href="/metodologia" className="btn btn-secondary btn-md">Ver metodología completa</Link>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-md">
                                {metodologia.map(item => (
                                    <article key={item.number} className="card card-compact flex-row items-start">
                                        <div className="avatar avatar-sm">{item.number}</div>
                                        <div>
                                            <h3 className="text-sm font-medium">{item.title}</h3>
                                            <p className="text-xs text-muted mt-1 leading-normal">{item.description}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w m-auto py-16 lg:w" id="fuentes" style={{"--w": "90%","--w-lg": "60%"}}>
                    <div className="card text-center">
                        <div className="w-full flex flex-col items-center gap-md">
                            <span className="badge badge-success">Datos verificados</span>
                            <h2 className="text-2xl">Fuentes oficiales y datos abiertos</h2>
                            <p className="text-sm text-muted leading-normal">
                                Los datos publicados provienen de documentos
                                oficiales, padrón electoral y planes de gobierno
                                presentados por las organizaciones políticas.
                            </p>
                            <div className="flex flex-wrap justify-center gap-sm">
                                {["JNE","ONPE","RENIEC","Planes oficiales","Padrón electoral"].map(source => (
                                    <span key={source}className="badge badge-outline">{source}</span>
                                ))}
                            </div>
                            <p className="text-xs text-muted">Última actualización: julio de 2026</p>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-black py-16">
                    <div className="w m-auto text-center lg:w" style={{"--w": "90%","--w-lg": "60%" }} >
                        <div className="w-full flex flex-col items-center gap-md">
                            <h2 className="text-3xl text-white font-medium">Participa en Pulso Ciudadano</h2>
                            <p className="text-sm text-white">
                                Responde preguntas sobre las principales
                                preocupaciones de Jauja y descubre qué propuestas
                                se acercan más a tus prioridades.
                            </p>
                            <Link href="/pulso-ciudadano" className="btn btn-lg bg-white text-black">Empezar evaluación</Link>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="w-full bg-white border-t py-8">
                <div className="w m-auto flex flex-col gap-md text-center md:flex-row md:justify-between md:text-left lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <div>
                        <p className="text-xl font-medium">Andes Analytics</p>
                        <p className="text-xs text-muted mt-1">Información electoral para una decisión ciudadana informada. </p>
                    </div>

                    <div className="flex justify-center gap-md">
                        <Link href="/metodologia" className="text-xs text-muted">Metodología</Link>
                        <Link href="/privacidad" className="text-xs text-muted">Privacidad</Link>
                        <Link href="/fuentes" className="text-xs text-muted">Fuentes</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}