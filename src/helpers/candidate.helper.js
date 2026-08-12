export function getFirstRecord(value) {
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
}

export function parseMaybeJson(value, fallback = null) {
    if (value === null || value === undefined || value === "") return fallback;
    if (Array.isArray(value) || typeof value === "object") return value;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

export function toArray(value) {
    const parsed = parseMaybeJson(value, []);

    if (Array.isArray(parsed)) return parsed.filter(Boolean);

    if (parsed && typeof parsed === "object") {
        return Object.entries(parsed).map(([key, item]) => ({
            label: formatLabel(key),
            value: item
        }));
    }

    if (parsed) return [String(parsed)];

    return [];
}

export function toNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const number = Number(value);

    if (Number.isNaN(number)) return null;

    return number;
}

export function formatScore(value) {
    const number = toNumber(value);

    if (number === null) return "No disponible";

    return number.toFixed(2);
}

export function formatLabel(value = "") {
    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

export function scoreLevel(value) {
    const number = toNumber(value);

    if (number === null) return "Sin dato";
    if (number >= 90) return "Muy alto";
    if (number >= 80) return "Alto";
    if (number >= 70) return "Medio alto";
    if (number >= 60) return "Medio";
    return "Bajo";
}