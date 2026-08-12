import { formatLabel, parseMaybeJson, scoreLevel, toArray, toNumber } from "@/helpers/candidate.helper";
import ProgressBar from "@/components/Progress/ProgressBar";

export function ScoreCard({ label, value, detail }) {
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

export function InfoCard({ label, value }) {
    return (
        <div className="border border-solid border-default bg-surface-secondary rounded-md p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="text-sm font-medium mt-2">
                {value || "No disponible"}
            </p>
        </div>
    );
}

export function SectionHeader({ label, title, description }) {
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

export function EmptyAnalysis({ title = "Análisis no disponible" }) {
    return (
        <div className="card text-center">
            <p className="text-sm text-muted">
                {title}. Verifica que la consulta de Supabase esté trayendo esta relación.
            </p>
        </div>
    );
}

export function TextList({ items, emptyText = "No hay información registrada." }) {
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

export function ProposalGrid({ proposals }) {
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

export function ProfessionalExperience({ items }) {
    const list = toArray(items);

    if (!list.length) {
        return (
            <p className="text-sm text-muted">
                No hay experiencia profesional registrada.
            </p>
        );
    }

    return (
        <div className="w-full grid grid-cols-1 gap-md md:grid-cols-4">
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

export function AcademicBackground({ items }) {
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

export function TextBlock({ title, children }) {
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