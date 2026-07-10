export const metodologia = [
    {
        number: "01",
        title: "Obtención de datos",
        description: "Recolectamos información del padrón, listas, candidatos y planes oficiales."
    },
    {
        number: "02",
        title: "Normalización",
        description: "Ordenamos y validamos los datos antes de procesarlos."
    },
    {
        number: "03",
        title: "Análisis técnico",
        description: "Evaluamos claridad, viabilidad, impacto, innovación y enfoque local."
    },
    {
        number: "04",
        title: "Publicación",
        description: "Mostramos resultados resumidos, metodología y fecha de actualización."
    }
]

export const questions = [
    {
        id: "main_concern",
        title: "¿Cuál es el principal problema que debería atender la próxima gestión provincial?",
        description: "Selecciona una opción.",
        type: "radio",
        required: true,
        options: [
            { key: "security", value: "Seguridad ciudadana" },
            { key: "agriculture", value: "Agricultura y ganadería" },
            { key: "health", value: "Salud" },
            { key: "education", value: "Educación" },
            { key: "tourism", value: "Turismo" },
            { key: "employment", value: "Empleo y emprendimiento" },
            { key: "infrastructure", value: "Infraestructura y vías" }
        ]
    },
    {
        id: "priority_topics",
        title: "¿Qué temas deberían ser prioritarios para Jauja?",
        description: "Selecciona hasta 3 opciones.",
        type: "checkbox",
        required: true,
        max: 3,
        options: [
            { key: "tourism", value: "Turismo y cultura" },
            { key: "agriculture", value: "Agricultura y ganadería" },
            { key: "health", value: "Salud pública" },
            { key: "education", value: "Educación" },
            { key: "security", value: "Seguridad ciudadana" },
            { key: "employment", value: "Empleo y economía local" },
            { key: "environment", value: "Medio ambiente" },
            { key: "digital_government", value: "Modernización municipal" }
        ]
    },
    {
        id: "candidate_value",
        title: "¿Qué valoras más en un candidato?",
        description: "Selecciona una opción.",
        type: "radio",
        required: true,
        options: [
            { key: "experience", value: "Experiencia en gestión" },
            { key: "honesty", value: "Honestidad y transparencia" },
            { key: "youth", value: "Renovación y juventud" },
            { key: "technical_team", value: "Equipo técnico preparado" },
            { key: "leadership", value: "Liderazgo y autoridad" },
            { key: "proposals", value: "Calidad de sus propuestas" }
        ]
    },
    {
        id: "preferred_management",
        title: "¿Qué tipo de gestión prefieres?",
        description: "Selecciona una opción.",
        type: "radio",
        required: true,
        options: [
            { key: "technical", value: "Técnica y orientada a resultados" },
            { key: "participatory", value: "Participativa y cercana a la población" },
            { key: "business", value: "Enfocada en inversión y desarrollo económico" },
            { key: "social", value: "Enfocada en programas sociales" },
            { key: "modern", value: "Moderna, digital y transparente" }
        ]
    },
    {
        id: "work_plan_importance",
        title: "¿Qué tan importante es para ti el plan de gobierno?",
        description: "Selecciona una opción.",
        type: "radio",
        required: true,
        options: [
            { key: "very_important", value: "Muy importante" },
            { key: "important", value: "Importante" },
            { key: "medium", value: "Medianamente importante" },
            { key: "low", value: "Poco importante" },
            { key: "none", value: "No lo considero importante" }
        ]
    },
    {
        id: "candidate_knowledge",
        title: "¿Cuánto conoces a los candidatos provinciales?",
        description: "Selecciona una opción.",
        type: "radio",
        required: true,
        options: [
            { key: "all", value: "Conozco a la mayoría" },
            { key: "some", value: "Conozco a algunos" },
            { key: "one", value: "Solo conozco a uno" },
            { key: "none", value: "Todavía no conozco a ninguno" }
        ]
    },
    {
        id: "vote_decision",
        title: "¿Ya decidiste tu voto?",
        description: "La respuesta será utilizada únicamente de forma agregada.",
        type: "radio",
        required: true,
        options: [
            { key: "decided", value: "Sí, ya decidí" },
            { key: "considering", value: "Estoy evaluando opciones" },
            { key: "undecided", value: "Aún no he decidido" },
            { key: "not_vote", value: "No tengo intención de votar" }
        ]
    },
    {
        id: "age_range",
        title: "¿Cuál es tu rango de edad?",
        description: "Este dato ayuda a segmentar los resultados.",
        type: "radio",
        required: true,
        options: [
            { key: "18_29", value: "18 a 29 años" },
            { key: "30_39", value: "30 a 39 años" },
            { key: "40_49", value: "40 a 49 años" },
            { key: "50_59", value: "50 a 59 años" },
            { key: "60_plus", value: "60 años a más" }
        ]
    }
];