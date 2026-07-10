import Image from "next/image";
import Link from "next/link";

export default function CandidateCard({ item }) {

    const mayor = item.electoral_candidates?.find(
        candidate => candidate.position_name === "ALCALDE PROVINCIAL"
    );

    return (
        <article className="card">
            <div className="relative w-full h bg-surface" style={{"--h": "240px", "borderRadius": "inherit"}}>
                <Image src={item.candidate_image ? item.candidate_image : `/placeholder.avif`} fill alt={`Candidato ${mayor?.full_name} por Jauja` || "Candidato provincial"} className="object-cover"/>
            </div>
            <div className="w-full p-5 flex flex-col gap-sm">
                <span className="badge badge-secondary">{item.list_status}</span>
                <div>
                    <h3 className="font-medium">{mayor?.full_name || "Candidato no disponible"}</h3>
                    <p className="text-xs text-muted font-medium mt-1">{mayor?.position_name || "Alcaldía provincial"}</p>
                    <p className="text-xs text-muted mt-1">{item.political_organization}</p>
                </div>
                <div className="w-full flex gap-sm mt-sm">
                    <Link href={`/candidatos/${item.id_list}`}className="btn btn-secondary btn-sm btn-block">Ver lista</Link>
                    {item.work_plan && (
                        <Link href={item.work_plan} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm btn-block">Ver plan</Link>
                    )}
                </div>
            </div>
        </article>
    );
}