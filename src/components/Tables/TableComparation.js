'use client';

import { topics, demoProposals } from "@/helpers/panel";
import { useMemo, useState } from "react";

export default function TableComparation() {

    const organizations = useMemo(
        () => Object.keys(demoProposals),
        []
    );

    const [firstOrganization, setFirstOrganization] = useState(
        organizations[0]
    );

    const [secondOrganization, setSecondOrganization] = useState(
        organizations[1]
    );

    const firstProposal =
        demoProposals[firstOrganization] ?? {};

    const secondProposal =
        demoProposals[secondOrganization] ?? {};

    const firstOptions = organizations.filter(
        organization => organization !== secondOrganization
    );

    const secondOptions = organizations.filter(
        organization => organization !== firstOrganization
    );

    const handleFirstChange = (event) => {
        const value = event.target.value;

        setFirstOrganization(value);

        if (value === secondOrganization) {
            const replacement = organizations.find(
                organization => organization !== value
            );

            setSecondOrganization(replacement);
        }
    };

    const handleSecondChange = (event) => {
        const value = event.target.value;

        setSecondOrganization(value);

        if (value === firstOrganization) {
            const replacement = organizations.find(
                organization => organization !== value
            );

            setFirstOrganization(replacement);
        }
    };

    return (
        <div className="card flex flex-col gap-lg">
            <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">
                <div className="field">
                    <label htmlFor="first-organization"className="label">Primera organización</label>
                    <select id="first-organization" className="input" value={firstOrganization} onChange={handleFirstChange}>
                        {firstOptions.map(organization => (
                            <option key={organization} value={organization}>{organization}</option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="second-organization" className="label">Segunda organización</label>
                    <select id="second-organization" className="input" value={secondOrganization} onChange={handleSecondChange}>
                        {secondOptions.map(organization => (
                            <option key={organization} value={organization}>{organization}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th className="text-center">{firstOrganization}</th>
                            <th className="text-center">{secondOrganization}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map(topic => {
                            const firstValue = Number(firstProposal[topic.key] || 0);
                            const secondValue = Number(secondProposal[topic.key] || 0);
                            const isEqual = firstValue === secondValue;
                            return (
                                <tr key={topic.key}>
                                    <td className="font-medium">{topic.label}</td>
                                    <td className="text-center">
                                        <span className={firstValue > secondValue ? "badge badge-success" : isEqual ? "badge badge-warning" : "badge badge-secondary"}>
                                            {firstValue}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className={secondValue > firstValue ? "badge badge-success" : isEqual ? "badge badge-warning" : "badge badge-secondary"}>{secondValue}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-muted">Los puntajes representan el nivel de desarrollo de cada tema dentro del plan de gobierno y no intención de voto.</p>
        </div>
    );
}