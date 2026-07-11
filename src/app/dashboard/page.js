'use client';

import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";

const formatNumber = value => {
    return new Intl.NumberFormat("es-PE").format(
        Number(value || 0)
    );
};

const calculatePercentage = (value, total) => {
    const safeValue = Number(value || 0);
    const safeTotal = Number(total || 0);

    if (!safeTotal) return 0;

    return Number(
        ((safeValue / safeTotal) * 100).toFixed(1)
    );
};

export default function Page() {

    const {analytics, days, setDays, loading, error, refresh} = useDashboard();

    const uniqueVisitors = Number(
        analytics?.unique_visitors || 0
    );

    const sessions = Number(
        analytics?.sessions || 0
    );

    const pageViews = Number(
        analytics?.page_views || 0
    );

    const quizStarted = Number(
        analytics?.quiz_started || 0
    );

    const quizCompleted = Number(
        analytics?.quiz_completed || 0
    );

    const completionRate = calculatePercentage(
        quizCompleted,
        quizStarted
    );

    const pagesPerSession = sessions
        ? Number((pageViews / sessions).toFixed(1))
        : 0;

    const topSources = Array.isArray(
        analytics?.top_sources
    )
        ? analytics.top_sources
        : [];

    const topPages = Array.isArray(
        analytics?.top_pages
    )
        ? analytics.top_pages
        : [];

    const maxSourceSessions = Math.max(
        ...topSources.map(item =>
            Number(item.sessions || 0)
        ),
        1
    );

    const maxPageViews = Math.max(
        ...topPages.map(item =>
            Number(item.views || 0)
        ),
        1
    );

    const metrics = [
        {
            label: "Visitantes únicos",
            value: formatNumber(uniqueVisitors),
            description: `Últimos ${days} días`
        },
        {
            label: "Sesiones",
            value: formatNumber(sessions),
            description: uniqueVisitors ? `${(sessions / uniqueVisitors).toFixed(1)} sesiones por visitante` : "0 sesiones por visitante"
        },
        {
            label: "Páginas vistas",
            value: formatNumber(pageViews),
            description: `${pagesPerSession} por sesión`
        },
        {
            label: "Quiz completados",
            value: formatNumber(quizCompleted),
            description: `${completionRate}% de finalización`
        }
    ];

    return (
        <>
            <header className="w-full h-16 bg-white border-b">
                <div className="w m-auto h-full flex flex-row items-center justify-between lg:w" style={{"--w": "94%","--w-lg": "80%"}}>
                    <div>
                        <Link href="/dashboard" className="text-lg font-medium">Andes Analytics</Link>
                        <span className="block text-xs text-muted ml-3">Panel interno</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <Link href="/" className="btn btn-sm btn-secondary">Ir a la web</Link>
                        <button type="button" className="btn btn-sm btn-primary" onClick={refresh} disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</button>
                    </div>
                </div>
            </header>

            <main className="w-full bg-surface min-h-screen py-8">
                <div className="w m-auto flex flex-col gap-lg lg:w" style={{"--w": "94%", "--w-lg": "80%"}}>
                    <section className="w-full flex flex-col gap-md md:flex-row md:items-end lg:justify-between">
                        <div className="lg:w" style={{"--mnw-lg": "40%"}}>
                            <p className="label text-primary">Analítica</p>
                            <h1 className="text-3xl font-medium mt-2">Dashboard general</h1>
                            <p className="text-sm text-muted mt-2">Rendimiento de la plataforma, participación ciudadana y fuentes de tráfico.</p>
                        </div>
                        <div className="field">
                            <label htmlFor="period" className="label">Periodo</label>
                            <select id="period" className="input lg:w" style={{"--mxw-lg": "60%"}} value={days} onChange={event => setDays(Number(event.target.value))} disabled={loading}>
                                <option value={7}>Últimos 7 días</option>
                                <option value={15}>Últimos 15 días</option>
                                <option value={30}>Últimos 30 días</option>
                                <option value={90}>Últimos 90 días</option>
                            </select>
                        </div>
                    </section>
                    {error ? (
                        <section className="card text-center">
                            <h2 className="text-lg font-medium">No se pudieron cargar las métricas</h2>
                            <p className="text-sm text-muted mt-2">{error?.message || "Verifica la función RPC y los permisos de Supabase."}</p>
                            <button type="button" className="btn btn-primary mt-md" onClick={refresh}>Reintentar</button>
                        </section>
                    ) : (
                        <>
                            <section className="w-full grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
                                {metrics.map(item => (
                                    <article key={item.label} className="card card-kpi">
                                        <p className="text-muted">{item.label}</p>
                                        <p className="text-xl font-medium">{loading ? "—" : item.value}</p>
                                        <p className="text-xs text-muted">{item.description}</p>
                                    </article>
                                ))}
                            </section>

                            <section className="w-full grid grid-cols-1 gap-md lg:grid-cols-3">
                                <article className="card lg:col-span-2">
                                    <div className="card-header mb-4">
                                        <div>
                                            <h2 className="text-lg font-medium">Conversión de Pulso Ciudadano</h2>
                                            <p className="text-xs text-muted">Usuarios que iniciaron y finalizaron el cuestionario.</p>
                                        </div>
                                        <span className={`badge ${completionRate >= 60 ? "badge--success" : "badge-secondary"}`}>{completionRate}%</span>
                                    </div>
                                    <div className="w-full grid grid-cols-1 gap-md my-4 md:grid-cols-2">
                                        <div className="border rounded-md p-md bg-white">
                                            <p className="text-xs text-muted">Quiz iniciados</p>
                                            <p className="text-3xl font-semibold mt-2">{formatNumber(quizStarted)}</p>
                                            <div className="w-full bg-surface-secondary rounded-full overflow-hidden mt-md" style={{height: "10px"}}>
                                                <div className="bg-black rounded-full" style={{width: "100%", height: "100%"}}/>
                                            </div>
                                        </div>
                                        <div className="border rounded-md p-md bg-white">
                                            <p className="text-xs text-muted">Quiz completados</p>
                                            <p className="text-3xl font-semibold mt-2">{formatNumber(quizCompleted)}</p>
                                            <div className="w-full bg-surface-secondary rounded-full overflow-hidden mt-md" style={{height: "10px"}}>
                                                <div className="bg-black rounded-full" style={{width:`${completionRate}%`,height: "100%"}}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-subtle mt-md">
                                        <p className="text-sm font-medium">Lectura rápida</p>
                                        <p className="text-xs text-muted mt-2">De cada 100 personas que comienzan Pulso Ciudadano, aproximadamente{" "} <strong>{completionRate}</strong>{" "} terminan el cuestionario.</p>
                                    </div>
                                </article>
                                <article className="card">
                                    <div className="card-header mb-4">
                                        <h2 className="text-lg font-medium">Rendimiento</h2>
                                        <p className="text-xs text-muted">Métricas generales de uso.</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-md">
                                        <div className="w-full flex items-center justify-between border-b pb-md">
                                            <span className="text-sm text-muted">Sesiones por visitante</span>
                                            <strong className="text-lg">{uniqueVisitors ? (sessions / uniqueVisitors).toFixed(1) : 0}</strong>
                                        </div>
                                        <div className="w-full flex items-center justify-between border-b pb-md">
                                            <span className="text-sm text-muted">Páginas por sesión</span>
                                            <strong className="text-lg">{pagesPerSession}</strong>
                                        </div>
                                        <div className="w-full flex items-center justify-between border-b pb-md">
                                            <span className="text-sm text-muted">Conversión del quiz</span>
                                            <strong className="text-lg">{completionRate}%</strong>
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-sm text-muted">Abandono del quiz</span>
                                            <strong className="text-lg">{quizStarted ? Number((100 - completionRate).toFixed(1)): 0}%</strong>
                                        </div>
                                    </div>
                                </article>
                            </section>

                            <section className="w-full grid grid-cols-1 gap-md lg:grid-cols-2">
                                <article className="card">
                                    <div className="card-header mb-4">
                                        <h2 className="text-lg font-medium">Fuentes de tráfico</h2>
                                        <p className="text-xs text-muted">Desde dónde llegan los visitantes.</p>
                                    </div>
                                    {topSources.length > 0 ? (
                                        <div className="w-full flex flex-col gap-md">
                                            {topSources.map(item => {
                                                const count = Number(item.sessions || 0);
                                                const width = (count / maxSourceSessions) * 100;
                                                return (
                                                    <div key={item.source} className="w-full flex flex-col gap-sm">
                                                        <div className="w-full flex items-center justify-between gap-md">
                                                            <span className="text-sm font-medium capitalize">{item.source || "Directo"}</span>
                                                            <span className="text-xs text-muted">{formatNumber(count)}{" "}sesiones</span>
                                                        </div>
                                                        <div className="w-full bg-surface-secondary rounded-full overflow-hidden" style={{ height:"10px"}}>
                                                            <div className="bg-black rounded-full" style={{width:`${width}%`,height:"100%"}}/>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted">Todavía no existen fuentes registradas. </p>
                                    )}
                                </article>
                                <article className="card">
                                    <div className="card-header mb-4">
                                        <h2 className="text-lg font-medium">Páginas más visitadas</h2>
                                        <p className="text-xs text-muted">Contenidos con mayor tráfico.</p>
                                    </div>
                                    {topPages.length > 0 ? (
                                        <div className="w-full flex flex-col gap-md">
                                            {topPages.map(item => {
                                                const views = Number(item.views || 0);
                                                const width = (views / maxPageViews) * 100;
                                                return (
                                                    <div key={item.page_path} className="w-full flex flex-col gap-sm">
                                                        <div className="w-full flex items-center justify-between gap-md">
                                                            <span className="text-sm font-medium">{item.page_path || "/"}</span>
                                                            <span className="text-xs text-muted">{formatNumber(views)}{" "} vistas</span>
                                                        </div>
                                                        <div className="w-full bg-surface-secondary rounded-full overflow-hidden" style={{height: "10px"}}>
                                                            <div className="bg-black rounded-full" style={{width: `${width}%`, height: "100%"}}/>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted">Todavía no existen páginas registradas.</p>
                                    )}
                                </article>
                            </section>

                            <section className="card">
                                <div className="card-header mb-4">
                                    <h2 className="text-lg font-medium">Accesos rápidos</h2>
                                    <p className="text-xs text-muted">Herramientas de seguimiento y control.</p>
                                </div>
                                <div className="w-full grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
                                    <Link href="/pulso-ciudadano" className="border rounded-md p-4 bg-surface-secondary">
                                        <p className="text-sm font-medium">Pulso Ciudadano</p>
                                        <p className="text-xs text-muted mt-1">Probar cuestionario</p>
                                    </Link>
                                    <Link href="/" className="border rounded-md p-4 bg-surface-secondary">
                                        <p className="text-sm font-medium">Observatorio</p>
                                        <p className="text-xs text-muted mt-1">Ver página pública</p>
                                    </Link>
                                    <button type="button" className="border rounded-md p-4 bg-surface-secondary text-left" onClick={refresh}>
                                        <p className="text-sm font-medium">Actualizar datos</p>
                                        <p className="text-xs text-muted mt-1">Recargar métricas</p>
                                    </button>
                                    <div className="border rounded-md p-4 bg-surface-secondary">
                                        <p className="text-sm font-medium">Periodo activo</p>
                                        <p className="text-xs text-muted mt-1">Últimos {days} días</p>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}