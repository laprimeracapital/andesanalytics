'use client';

import { useDB } from "@/context/DBContext";
import { topics } from "@/helpers/panel";
import { useEffect, useMemo, useState } from "react";

export default function TableComparation() {

    const { proposals = [], loadingProposals, errorProposals } = useDB();

    const [firstId, setFirstId] = useState("");
    const [secondId, setSecondId] = useState("");

    const organizations = useMemo(() => {
        return proposals
            .filter(item => item?.electoral_lists)
            .map(item => ({
                id: String(item.id_list),
                name: item.electoral_lists.political_organization
            }));
    }, [proposals]);

    useEffect(() => {
        if (organizations.length < 2) {
            setFirstId("");
            setSecondId("");
            return;
        }

        const firstExists = organizations.some(
            organization => organization.id === firstId
        );

        const secondExists = organizations.some(
            organization => organization.id === secondId
        );

        if (!firstExists) {
            setFirstId(organizations[0].id);
        }

        if (
            !secondExists ||
            secondId === organizations[0].id
        ) {
            setSecondId(organizations[1].id);
        }
    }, [organizations, firstId, secondId]);

    const firstProposal = useMemo(() => {
        return proposals.find(
            item => String(item.id_list) === firstId
        ) ?? null;
    }, [proposals, firstId]);

    const secondProposal = useMemo(() => {
        return proposals.find(
            item => String(item.id_list) === secondId
        ) ?? null;
    }, [proposals, secondId]);

    const firstOptions = useMemo(() => {
        return organizations.filter(
            organization => organization.id !== secondId
        );
    }, [organizations, secondId]);

    const secondOptions = useMemo(() => {
        return organizations.filter(
            organization => organization.id !== firstId
        );
    }, [organizations, firstId]);

    const handleFirstChange = event => {
        const value = event.target.value;

        setFirstId(value);

        if (value === secondId) {
            const replacement = organizations.find(
                organization => organization.id !== value
            );

            setSecondId(replacement?.id ?? "");
        }
    };

    const handleSecondChange = event => {
        const value = event.target.value;

        setSecondId(value);

        if (value === firstId) {
            const replacement = organizations.find(
                organization => organization.id !== value
            );

            setFirstId(replacement?.id ?? "");
        }
    };

    if (loadingProposals) {
        return (
            <div className="card">
                <p className="text-sm text-muted text-center">
                    Cargando propuestas...
                </p>
            </div>
        );
    }

    if (errorProposals) {
        return (
            <div className="card flex flex-col gap-md items-center">
                <p className="text-sm text-muted text-center">
                    No se pudieron cargar las propuestas.
                </p>
            </div>
        );
    }

    if (organizations.length < 2) {
        return (
            <div className="card">
                <p className="text-sm text-muted text-center">
                    Se necesitan al menos dos organizaciones con análisis
                    vigente para realizar la comparación.
                </p>
            </div>
        );
    }

    return (
        <div className="card flex flex-col gap-lg">
            <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                <div className="field">
                    <label htmlFor="first-organization" className="label">Primera organización</label>
                    <select id="first-organization" className="input" value={firstId} onChange={handleFirstChange}>
                        {firstOptions.map(organization => (
                            <option key={organization.id} value={organization.id}>{organization.name}</option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="second-organization" className="label">Segunda organización</label>
                    <select id="second-organization" className="input" value={secondId} onChange={handleSecondChange}>
                        {secondOptions.map(organization => (
                            <option key={organization.id} value={organization.id}>{organization.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th className="text-center">{firstProposal?.electoral_lists?.political_organization}</th>
                            <th className="text-center">{secondProposal?.electoral_lists?.political_organization}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {topics.map(topic => {
                            const firstValue = Number(firstProposal?.proposals?.[topic.key] ?? 0);
                            const secondValue = Number(secondProposal?.proposals?.[topic.key] ?? 0);
                            const isEqual = firstValue === secondValue;
                            
                            const firstBadgeClass =
                                firstValue > secondValue
                                    ? "badge badge-success"
                                    : isEqual
                                        ? "badge badge-warning"
                                        : "badge badge-secondary";

                            const secondBadgeClass =
                                secondValue > firstValue
                                    ? "badge badge-success"
                                    : isEqual
                                        ? "badge badge-warning"
                                        : "badge badge-secondary";

                            return (
                                <tr key={topic.key}>
                                    <td className="font-medium">{topic.label}</td>
                                    <td className="text-center">
                                        <span className={firstBadgeClass} >{firstValue}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className={secondBadgeClass}>{secondValue}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-muted">
                Los puntajes representan el nivel de desarrollo de cada
                tema dentro del plan de gobierno y no constituyen
                intención de voto.
            </p>
        </div>
    );
}