const BASE_URL = "https://andesanalytics-puce.vercel.app";

export default function sitemap() {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1
        },
        {
            url: `${BASE_URL}/transparencia`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.95
        },
        {
            url: `${BASE_URL}/candidatos`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },
        {
            url: `${BASE_URL}/comparador`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
        },
        {
            url: `${BASE_URL}/planes-de-gobierno`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.85
        },
        {
            url: `${BASE_URL}/metodologia`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7
        },
        {
            url: `${BASE_URL}/contacto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        }
    ];
}