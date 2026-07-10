const VISITOR_KEY = "andes-analytics-visitor-id";
const ACTIVE_SESSION_KEY = "andes-analytics-active-session";
const LAST_RESULT_KEY = "andes-analytics-last-result";

const createUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const getVisitorId = () => {
    if (typeof window === "undefined") return null;

    let visitorId = localStorage.getItem(VISITOR_KEY);

    if (!visitorId) {
        visitorId = createUUID();
        localStorage.setItem(VISITOR_KEY, visitorId);
    }

    return visitorId;
};

export const createCitizenSession = () => {
    if (typeof window === "undefined") return null;

    const sessionId = createUUID();

    localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);

    return sessionId;
};

export const getCitizenSession = () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(ACTIVE_SESSION_KEY);
};

export const clearCitizenSession = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(ACTIVE_SESSION_KEY);
};

export const saveLastCitizenResult = (result) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
        LAST_RESULT_KEY,
        JSON.stringify(result)
    );
};

export const getLastCitizenResult = () => {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(LAST_RESULT_KEY);

        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};