'use client';

import { disableInternalUser, enableInternalUser, isInternalUser } from "@/helpers/analytics.helper";
import { useEffect, useState } from "react";

export default function Page() {
    const [internal, setInternal] = useState(false);

    useEffect(() => {
        setInternal(isInternalUser());
    }, []);

    const enable = () => {
        enableInternalUser();
        setInternal(true);
    };

    const disable = () => {
        disableInternalUser();
        setInternal(false);
    };

    return (
        <main className="w-full min-h-screen grid place-items-center bg-surface">
            <div className="card text-center">
                <p className="label text-primary">Analítica interna</p>
                <h1 className="text-2xl font-medium mt-2">Excluir este dispositivo</h1>
                <p className="text-sm text-muted mt-3">Estado actual:{" "}<strong>{internal ? "Excluido de las métricas" : "Contabilizado normalmente"}</strong></p>
                <div className="w-full flex flex-col gap-sm mt-lg">
                    <button type="button" className="btn btn-lg btn-primary" onClick={enable} disabled={internal}>Excluir este navegador</button>
                    <button type="button" className="btn btn-lg btn-secondary" onClick={disable} disabled={!internal}>Volver a contar este navegador</button>
                </div>
            </div>
        </main>
    );
}