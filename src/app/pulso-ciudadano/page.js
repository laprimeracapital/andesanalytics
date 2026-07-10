import PulsoPage from "./PulsoPage";

const BASE_URL = "https://andesanalytics-puce.vercel.app";
const PAGE_URL = `${BASE_URL}/pulso-ciudadano`;

export const metadata = {
    title: "Pulso Ciudadano | Afinidad con candidatos de Jauja",
    description: "Responde un cuestionario ciudadano y descubre qué planes de gobierno de los candidatos provinciales de Jauja tienen mayor afinidad con tus prioridades.",
    keywords: [
        "Pulso Ciudadano",
        "candidatos Jauja 2026",
        "elecciones Jauja",
        "afinidad política",
        "planes de gobierno Jauja",
        "comparador de candidatos",
        "quiz electoral",
        "elecciones municipales 2026",
        "Jauja",
        "Junín",
        "Andes Analytics"
    ],
    alternates: {
        canonical: "/pulso-ciudadano"
    },
    openGraph: {
        type: "website",
        locale: "es_PE",
        url: PAGE_URL,
        siteName: "Andes Analytics",
        title: "Pulso Ciudadano | Descubre tu afinidad programática",
        description: "Compara tus principales preocupaciones con los planes de gobierno oficiales de los candidatos provinciales de Jauja.",
        images: [
            {
                url: "/og-pulso-ciudadano.jpg",
                width: 1200,
                height: 630,
                alt: "Pulso Ciudadano de Andes Analytics"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Pulso Ciudadano | Andes Analytics",
        description: "Descubre qué planes de gobierno de Jauja se acercan más a tus prioridades ciudadanas.",
        images: ["/og-pulso-ciudadano.jpg"]
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
        }
    },
    category: "Participación ciudadana",
    other: {
        "geo.region": "PE-JUN",
        "geo.placename": "Jauja, Junín, Perú",
        "content-language": "es-PE"
    }
};

export default function Page () {
    return <PulsoPage/>;
}