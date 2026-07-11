import { questions } from "@/db/db";

export const INITIAL_FORM = questions.reduce((acc, question) => {
    acc[question.id] = question.type === "checkbox" ? [] : "";
    return acc;
}, {});

export const topicLabels = {
    tourism: "Turismo y cultura",
    agriculture: "Agricultura y ganadería",
    health: "Salud",
    education: "Educación",
    security: "Seguridad ciudadana",
    employment: "Empleo y economía local",
    environment: "Medio ambiente",
    digital_government: "Modernización municipal",
    infrastructure: "Infraestructura y vías",

    turismo: "Turismo y cultura",
    agricultura: "Agricultura y ganadería",
    salud: "Salud",
    educacion: "Educación",
    seguridad: "Seguridad ciudadana",
    gestion_publica: "Modernización municipal",
    medio_ambiente: "Medio ambiente",
    infraestructura: "Infraestructura y vías"
};

export function calculateCitizenProfile(form) {
    const topics = [
        form.main_concern,
        ...(form.priority_topics || [])
    ].filter(Boolean);

    const counts = topics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {});

    const priorities = Object.entries(counts)
        .sort(([, first], [, second]) => second - first)
        .map(([key, count]) => ({
            key,
            label: topicLabels[key] || key,
            score: count
        }));

    const profileMap = {
        technical: "Perfil técnico y orientado a resultados",
        participatory: "Perfil participativo y ciudadano",
        modern: "Perfil moderno, digital y transparente",
        social: "Perfil orientado al desarrollo social",
        business: "Perfil orientado al desarrollo económico"
    };

    return {
        primary_priority: priorities[0]?.label || "Sin prioridad definida",
        priorities,
        citizen_profile: profileMap[form.preferred_management] || "Perfil ciudadano equilibrado",
        candidate_value: form.candidate_value,
        vote_status: form.vote_decision
    };
}