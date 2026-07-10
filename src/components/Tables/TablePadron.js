'use client'
import { useDB } from "@/context/DBContext"

export default function TablePadron () {

    const { padron, loadingPadron, errorPadron } = useDB();

    const electorate = [
        {
            label: "Electores registrados",
            value: padron?.total_electors ?? 0,
            description: "Padrón electoral provincial"
        },
        {
            label: "Mujeres",
            value: `${padron?.female_percentage ?? 0}%`,
            description: `${padron?.female_electors ?? 0} electoras`
        },
        {
            label: "Hombres",
            value: `${padron?.male_percentage ?? 0}%`,
            description: `${padron?.male_electors ?? 0} electores`
        },
        {
            label: "Electores de 18 a 39",
            value: padron
                ? padron.electors_18_29 + padron.electors_30_39
                : 0,
            description: "Segmento joven"
        }
    ];

    const formatNumber = (value) => {
        return new Intl.NumberFormat("es-PE").format(Number(value || 0));
    };

    const ageGroups = [
        {
            label: "18 - 29 años",
            percentage: Number(padron?.age_18_29_percentage || 0),
            total: padron?.electors_18_29
        },
        {
            label: "30 - 39 años",
            percentage: Number(padron?.age_30_39_percentage || 0),
            total: padron?.electors_30_39
        },
        {
            label: "40 - 49 años",
            percentage: Number(padron?.age_40_49_percentage || 0),
            total: padron?.electors_40_49
        },
        {
            label: "50 - 59 años",
            percentage: Number(padron?.age_50_59_percentage || 0),
            total: padron?.electors_50_59
        },
        {
            label: "60+ años",
            percentage: Number(padron?.age_60_plus_percentage || 0),
            total: padron?.electors_60_plus
        }
    ];

    return (
        loadingPadron ? (
            <div className="card text-center">
                <p className="text-muted">Cargando padrón electoral...</p>
            </div>
        ) : errorPadron ? (
            <div className="card text-center">
                <p className="text-error">No se pudo cargar el padrón electoral.</p>
            </div>
        ) : (
            <>
                <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-4">
                    {electorate.map(item => (
                        <article key={item.label} className="card card-kpi">
                            <p className="text-sm">{item.label}</p>
                            <p className="text-lg font-medium">{item.value}</p>
                            <p className="text-xs text-muted">{item.description}</p>
                        </article>
                    ))}
                </div>

                <div className="card card-subtle">
                    <div className="card-header">
                        <div className="mb-4">
                            <h3 className="text-xl">Distribución por edades</h3>
                            <p className="text-xs text-muted">Segmentación del padrón electoral provincial.</p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-md">
                        {ageGroups.map((item) => (
                            <div key={item.label} className="w-full flex flex-col gap-xs">
                                <div className="w-full flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-sm text-muted">{item.percentage}% · {formatNumber(item.total)}</span>
                                </div>
                                <div className="w-full rounded-full bg-gray-200 overflow-hidden" style={{ height: 12 }}>
                                    <div className="bg-black rounded-full transition-all duration-500" style={{width: `${item.percentage}%`, height: "100%"}}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    )
}