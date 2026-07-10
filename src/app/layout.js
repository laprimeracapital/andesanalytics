import { Poppins } from "next/font/google";
import '@/assets/global.css'
import { DBProvider } from "@/context/DBContext";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-base",
    display: 'swap'
})

const BASE_URL = "https://andesanalytics-puce.vercel.app";

export const metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Andes Analytics | Transparencia Electoral de Jauja",
        template: "%s | Andes Analytics"
    },
    description: "Plataforma de transparencia y análisis electoral de la provincia de Jauja. Consulta candidatos, listas políticas, planes de gobierno, padrón electoral y comparaciones técnicas basadas en fuentes oficiales.",
    applicationName: "Andes Analytics",
    authors: [
        {
            name: "Andes Analytics",
            url: BASE_URL
        }
    ],
    creator: "Andes Analytics",
    publisher: "Andes Analytics",
    category: "Información electoral",
    keywords: [
        "Andes Analytics",
        "elecciones Jauja 2026",
        "candidatos Jauja",
        "alcaldía provincial de Jauja",
        "planes de gobierno Jauja",
        "transparencia electoral",
        "análisis electoral",
        "padrón electoral Jauja",
        "elecciones municipales 2026",
        "comparador de candidatos",
        "comparador de propuestas",
        "Jurado Nacional de Elecciones",
        "JNE",
        "Junín",
        "Jauja"
    ],
    alternates: {
        canonical: "/",
        languages: {
            "es-PE": "/"
        }
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },
    openGraph: {
        type: "website",
        locale: "es_PE",
        url: BASE_URL,
        siteName: "Andes Analytics",
        title: "Andes Analytics | Transparencia Electoral de Jauja",
        description: "Consulta candidatos provinciales, planes de gobierno, padrón electoral y análisis comparativos para las elecciones de Jauja 2026.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Andes Analytics — Transparencia Electoral de Jauja"
            }
        ]
    },

    twitter: {
        card: "summary_large_image",
        title: "Andes Analytics | Transparencia Electoral de Jauja",
        description: "Candidatos, planes de gobierno, padrón electoral y análisis comparativos de las elecciones provinciales de Jauja 2026.",
        images: ["/og-image.jpg"]
    },
    icons: {
        icon: [
            {
                url: "/favicon.ico"
            },
            {
                url: "/icon-32x32.png",
                sizes: "32x32",
                type: "image/png"
            },
            {
                url: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png"
            }
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png"
            }
        ]
    },
    manifest: "/manifest.webmanifest",
    referrer: "origin-when-cross-origin",
    verification: {
        google: "oOm1RQAHqfpvB7cpFamSIpM_MSEXu90vQiltXbEFw5Q"
    },
    other: {
        "geo.region": "PE-JUN",
        "geo.placename": "Jauja, Junín, Perú",
        "content-language": "es-PE"
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Andes Analytics",
    url: BASE_URL,
    description: "Plataforma de transparencia, análisis electoral y comparación de candidatos y planes de gobierno de la provincia de Jauja.",
    applicationCategory: "ReferenceApplication",
    operatingSystem: "Web",
    inLanguage: "es-PE",
    areaServed: {
        "@type": "AdministrativeArea",
        name: "Provincia de Jauja, Junín, Perú"
    },
    publisher: {
        "@type": "Organization",
        name: "Andes Analytics",
        url: BASE_URL
    },
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PEN"
    }
};

export default function RootLayout ({ children }) {
    return (
        <html lang="es" className={`${poppins.variable}`}>
            <body>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <DBProvider>
                    {children}
                </DBProvider>
            </body>
        </html>
    )
}