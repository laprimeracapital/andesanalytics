const TOPIC_MAP = {
    tourism: "turismo",
    agriculture: "agricultura",
    health: "salud",
    education: "educacion",
    security: "seguridad",
    environment: "medio_ambiente",
    infrastructure: "infraestructura",
    digital_government: "gestion_publica",

    // No existe una columna exacta para empleo.
    // Para el MVP lo aproximamos con agricultura y gestión pública.
    employment: ["agricultura", "gestion_publica"]
};

const normalizeScore = (value, max) => {
    if (!max) return 0;

    return (Number(value || 0) / max) * 100;
};

const addTopicWeight = (weights, topic, weight) => {
    const mapped = TOPIC_MAP[topic];

    if (!mapped) return;

    if (Array.isArray(mapped)) {
        mapped.forEach(key => {
            weights[key] = (weights[key] || 0) + weight / mapped.length;
        });

        return;
    }

    weights[mapped] = (weights[mapped] || 0) + weight;
};

const buildCitizenWeights = (form) => {
    const weights = {};

    // La principal preocupación tiene el mayor peso.
    addTopicWeight(weights, form.main_concern, 5);

    // Cada prioridad adicional pesa 3.
    (form.priority_topics || []).forEach(topic => {
        addTopicWeight(weights, topic, 3);
    });

    // Preferencia de gestión.
    if (form.preferred_management === "technical") {
        weights.gestion_publica =
            (weights.gestion_publica || 0) + 3;
    }

    if (form.preferred_management === "modern") {
        weights.gestion_publica =
            (weights.gestion_publica || 0) + 4;
    }

    if (form.preferred_management === "social") {
        weights.salud = (weights.salud || 0) + 2;
        weights.educacion = (weights.educacion || 0) + 2;
    }

    if (form.preferred_management === "business") {
        weights.agricultura =
            (weights.agricultura || 0) + 2;

        weights.infraestructura =
            (weights.infraestructura || 0) + 2;
    }

    return weights;
};

export const calculateAffinity = (form, planAnalysis) => {
    const citizenWeights = buildCitizenWeights(form);

    const proposalKeys = [
        "turismo",
        "agricultura",
        "salud",
        "educacion",
        "seguridad",
        "medio_ambiente",
        "infraestructura",
        "gestion_publica"
    ];

    const maximums = proposalKeys.reduce((acc, key) => {
        acc[key] = Math.max(
            ...planAnalysis.map(item =>
                Number(item.proposals?.[key] || 0)
            ),
            1
        );

        return acc;
    }, {});

    const ranking = planAnalysis.map(plan => {
        let weightedScore = 0;
        let totalWeight = 0;

        Object.entries(citizenWeights).forEach(([topic, weight]) => {
            const proposalScore =
                Number(plan.proposals?.[topic] || 0);

            const normalized = normalizeScore(
                proposalScore,
                maximums[topic]
            );

            weightedScore += normalized * weight;
            totalWeight += weight;
        });

        let affinity = totalWeight
            ? weightedScore / totalWeight
            : 0;

        /*
         * El plan de gobierno sí importa para el ciudadano:
         * añadimos una corrección pequeña por calidad general.
         */
        if (form.work_plan_importance === "very_important") {
            affinity =
                affinity * 0.85 +
                Number(plan.general_score || 0) * 0.15;
        }

        if (form.work_plan_importance === "important") {
            affinity =
                affinity * 0.90 +
                Number(plan.general_score || 0) * 0.10;
        }

        affinity = Math.max(
            0,
            Math.min(100, Number(affinity.toFixed(2)))
        );

        const topicBreakdown = Object.entries(citizenWeights)
            .map(([topic, weight]) => ({
                topic,
                weight,
                proposal_score:
                    Number(plan.proposals?.[topic] || 0),
                normalized_score: Number(
                    normalizeScore(
                        plan.proposals?.[topic],
                        maximums[topic]
                    ).toFixed(2)
                )
            }))
            .sort(
                (a, b) =>
                    b.normalized_score - a.normalized_score
            );

        return {
            list_id: plan.id_list,
            candidate_name: plan.candidate_name,
            political_organization:
                plan.political_organization,
            affinity,
            topic_breakdown: topicBreakdown
        };
    });

    return ranking.sort(
        (a, b) => b.affinity - a.affinity
    );
};