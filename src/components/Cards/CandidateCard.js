import Image from "next/image";
import Link from "next/link";

export default function CandidateCard ({ item }) {
    return (
        <article className="w-full border bg-surface rounded-md text-left">
            <div className="relative w-full h rounded-md" style={{"--h": "240px", "overflow": "hidden"}}>
                <Image src={'/placeholder.avif'} fill alt="" />
            </div>
            <div className="w-full p-5 flex flex-col gap-xs">
                <h3 className="font-medium">{item.electoral_candidates[0].full_name}</h3>
                <p className="text-xs text-muted font-medium">{item.electoral_candidates[0].position_name}</p>
                <p className="text-xs text-muted mb-4">{item.political_organization}</p>
                <Link href={item.work_plan} target="_blank" className="flex w-full bg-black text-white rounded-sm text-xs items-center justify-center py-3">Ver plan de trabajo</Link>
            </div>
        </article>
    )
}