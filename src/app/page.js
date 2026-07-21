'use client';

import CandidateCard from "@/components/Cards/CandidateCard";
import { useDB } from "@/context/DBContext";
import Link from "next/link";
import { metodologia } from "@/db/db";
import TablePadron from "@/components/Tables/TablePadron";
import TableComparation from "@/components/Tables/TableComparation";
import CardPlanRanking from "@/components/Cards/CardPlanRanking";
import CardCandidateRanking from "@/components/Cards/CardCandidateRanking";
import CardIntegralRanking from "@/components/Cards/CardIntegralRanking";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CandidateReviewSection from "@/components/Sections/CandidateReviewSection";

export default function Page() {

    const { candidates = [], summary, candidateRanking = [], integralRanking = [] } = useDB();

    const electoralSummary = [
        {
            label: "Listas provinciales",
            value: summary?.total_lists ?? "-"
        },
        {
            label: "Candidatos registrados",
            value: summary?.total_candidates ?? "-"
        },
        {
            label: "Planes analizados",
            value: summary?.total_plans ?? "-"
        },
        {
            label: "Distritos evaluados",
            value: summary?.total_districts ?? "-"
        }
    ];

    return (
        <>
            <Header/>

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
                            <Link href="/pulso-ciudadano" className="btn btn--secondary btn-lg">Empezar evaluación</Link>
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
                            <CardPlanRanking/>
                            <p className="text-xs text-muted text-center">El índice no representa intención de voto ni predice resultados electorales.</p>
                        </div>
                    </div>
                </section>

                <section className="w-full py-16" id="candidate-ranking">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div className="text-center">
                                <p className="label text-primary">Perfil profesional</p>
                                <h2 className="text-2xl mt-2">Índice de capacidad profesional de los candidatos</h2>
                                <p className="text-sm text-muted mt-3">Esta evaluación analiza la trayectoria académica y profesional de cada candidato a partir de la hoja de vida presentada al JNE. Se consideran aspectos como formación, especialización, experiencia en gestión pública, liderazgo, conocimiento territorial y capacidad técnica para el ejercicio del cargo.</p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
                                {candidateRanking.map((item, index) => (
                                    <CardCandidateRanking key={item.id_candidate_analysis} item={item} position={index + 1} />
                                ))}
                            </div>
                            <p className="text-xs text-muted text-center">El puntaje refleja únicamente la capacidad profesional acreditada documentalmente y no constituye una recomendación de voto.</p>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-surface py-16" id="integral-ranking">
                    <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="w-full flex flex-col gap-lg">
                            <div className="text-center">
                                <p className="label text-primary">Inteligencia electoral</p>
                                <h2 className="text-2xl mt-2">Índice Integral de Gobernabilidad</h2>
                                <p className="text-sm text-muted mt-3">Este índice integra la evaluación técnica del plan de gobierno con el análisis de la hoja de vida del candidato, midiendo la correspondencia entre las propuestas planteadas y la capacidad demostrada para ejecutarlas de manera eficiente.</p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
                                {integralRanking.map((item, index) => (
                                    <CardIntegralRanking key={item.id_integral_analysis} item={item} position={index + 1} />
                                ))}
                            </div>
                            <p className="text-xs text-muted text-center">El Índice Integral de Gobernabilidad es una evaluación técnica basada en información oficial y criterios documentales. No representa intención de voto ni predice resultados electorales.</p>
                        </div>
                    </div>
                </section>

                <section className="w-full py-16" id="electorado">
                    <div className="w m-auto flex flex-col gap-lg lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                        <div className="text-center">
                            <p className="label text-primary">Padrón electoral</p>
                            <h2 className="text-2xl mt-2">Radiografía del electorado de Jauja</h2>
                            <p className="text-sm text-muted mt-3">Información consolidada de los 34 distritos de la provincia.</p>
                        </div>
                        <TablePadron/>
                    </div>
                </section>

                <CandidateReviewSection/>

                <section className="w-full py-16" id="metodologia">
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

                <section className="w-full m-auto bg-surface py-16" id="fuentes">
                    <div className="w m-auto lg:w" style={{"--w": "90%","--w-lg": "60%"}}>
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

            <Footer/>
        </>
    );
}