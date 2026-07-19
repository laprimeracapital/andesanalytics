import { db } from "@/libs/supabase";
import CandidatePage from "./CandidatePage";

const BASE_URL = "https://andesanalytics-puce.vercel.app";

export async function generateMetadata({ params }) {

    const { slug } = await params;

    const { data } = await db
        .from("electoral_lists")
        .select(`
            political_organization,
            work_plan,
            electoral_candidates (
                full_name,
                position_name
            )
        `)
        .eq("slug", slug)
        .single();

    const mayor = data?.electoral_candidates?.find(candidate =>
        candidate.position_name?.toUpperCase().includes("ALCALDE")
    );

    const candidateName =
        mayor?.full_name ??
        "Candidato Provincial";

    const organization =
        data?.political_organization ??
        "Organización Política";

    const title =
        `${candidateName} | ${organization} | Andes Analytics`;

    const description =
        `Conoce el perfil del candidato ${candidateName}, su plan de gobierno, la lista de regidores y el análisis técnico realizado por Andes Analytics para las Elecciones Municipales Provinciales de Jauja 2026.`;

    const url =
        `${BASE_URL}/candidatos/${slug}`;

    return {
        title,
        description,

        keywords: [
            candidateName,
            organization,
            "Elecciones Jauja 2026",
            "Candidato Provincial",
            "Plan de Gobierno",
            "JNE",
            "Andes Analytics",
            "Jauja",
            "Junín"
        ],

        alternates: {
            canonical: url
        },

        openGraph: {
            type: "article",
            locale: "es_PE",
            url,
            siteName: "Andes Analytics",

            title,

            description,

            images: [
                {
                    url: `${BASE_URL}/api/og/candidato/${slug}`,
                    width: 1200,
                    height: 630,
                    alt: candidateName
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [
                `${BASE_URL}/api/og/candidato/${slug}`
            ]
        },

        robots: {
            index: true,
            follow: true
        },

        category: "Información Electoral",

        other: {
            "geo.region": "PE-JUN",
            "geo.placename": "Jauja, Junín",
            "content-language": "es-PE"
        }
    };
}

export default function Page() {
    return <CandidatePage />;
}