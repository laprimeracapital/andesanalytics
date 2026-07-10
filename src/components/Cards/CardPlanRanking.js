import { useDB } from "@/context/DBContext";

export default function CardPlanRanking() {

    const { planRanking, loadingPlanRanking, errorPlanRanking } = useDB();

    if (loadingPlanRanking) {
        return (
            <div className="card text-center">
                <p className="text-sm text-muted">Cargando ranking técnico...</p>
            </div>
        );
    }

    if (errorPlanRanking) {
        return (
            <div className="card text-center">
                <p className="text-sm text-error">No se pudo cargar el ranking.</p>
            </div>
        );
    }

    if (!planRanking.length) {
        return (
            <div className="card text-center">
                <p className="text-sm text-muted">No hay análisis disponibles.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="w-full flex flex-col gap-md">
                {planRanking.map((item, index) => (
                    <article key={item.id_analysis} className="w-full flex items-center gap-md border-b pb-md last:border-b-0 last:pb-0">
                        <div className="avatar avatar-md">{index + 1}</div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium">{item.political_organization}</h3>
                            <p className="text-xs text-muted mt-1">{item.candidate_name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold">{Number(item.general_score || 0).toFixed(0)}</p>
                            <p className="text-xs text-muted">de 100</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}