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

const districts = [
    {
        "district_name": "Acolla"
    },
    {
        "district_name": "Apata"
    },
    {
        "district_name": "Ataura"
    },
    {
        "district_name": "Canchayllo"
    },
    {
        "district_name": "Curicaca"
    },
    {
        "district_name": "El Mantaro"
    },
    {
        "district_name": "Huamalí"
    },
    {
        "district_name": "Huaripampa"
    },
    {
        "district_name": "Huertas"
    },
    {
        "district_name": "Janjaillo"
    },
    {
        "district_name": "Jauja"
    },
    {
        "district_name": "Julcán"
    },
    {
        "district_name": "Leonor Ordoñez"
    },
    {
        "district_name": "Llocllapampa"
    },
    {
        "district_name": "Marco"
    },
    {
        "district_name": "Masma"
    },
    {
        "district_name": "Masma Chicche"
    },
    {
        "district_name": "Molinos"
    },
    {
        "district_name": "Monobamba"
    },
    {
        "district_name": "Muqui"
    },
    {
        "district_name": "Muquiyauyo"
    },
    {
        "district_name": "Paca"
    },
    {
        "district_name": "Paccha"
    },
    {
        "district_name": "Pancán"
    },
    {
        "district_name": "Parco"
    },
    {
        "district_name": "Pomacancha"
    },
    {
        "district_name": "Ricrán"
    },
    {
        "district_name": "San Lorenzo"
    },
    {
        "district_name": "San Pedro de Chunán"
    },
    {
        "district_name": "Sausa"
    },
    {
        "district_name": "Sincos"
    },
    {
        "district_name": "Tunan Marca"
    },
    {
        "district_name": "Yauli"
    },
    {
        "district_name": "Yauyos"
    }
]

export const questions = [
    {
        id: "gender",
        title: "¿Con qué género te identificas?",
        description: "Esta información nos ayuda a comprender mejor los resultados agregados.",
        type: "radio",
        required: true,
        options: [
            {
                key: "male",
                value: "Masculino"
            },
            {
                key: "female",
                value: "Femenino"
            },
            {
                key: "prefer_not_say",
                value: "Prefiero no decirlo"
            }
        ]
    },
    {
        id: "district_name",
        title: "¿En qué distrito resides?",
        description: "Solo utilizaremos esta información con fines estadísticos.",
        type: "radio",
        required: true,
        options: districts.map(item => ({
            key: item.district_name,
            value: item.district_name
        }))
    },
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