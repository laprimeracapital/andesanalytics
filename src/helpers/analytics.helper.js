const VISITOR_KEY = "andes_visitor_id";
const SESSION_KEY = "andes_session_id";
const SESSION_TIME_KEY = "andes_session_time";

const SESSION_DURATION = 30 * 60 * 1000;

const INTERNAL_USER_KEY = "andes_internal_user";

const REFERRAL_STORAGE_KEY = 'andes_referral_code';

function createUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    throw new Error("El navegador no permite generar UUID.");
}

export function getVisitorId() {
    if (typeof window === "undefined") return null;

    let visitorId = localStorage.getItem(VISITOR_KEY);

    if (!visitorId) {
        visitorId = createUUID();
        localStorage.setItem(VISITOR_KEY, visitorId);
    }

    return visitorId;
}

export function getSessionId() {
    if (typeof window === "undefined") return null;

    const storedSession = sessionStorage.getItem(SESSION_KEY);
    const storedTime = Number(
        sessionStorage.getItem(SESSION_TIME_KEY) || 0
    );

    const expired =
        !storedSession ||
        !storedTime ||
        Date.now() - storedTime > SESSION_DURATION;

    if (expired) {
        const sessionId = createUUID();

        sessionStorage.setItem(SESSION_KEY, sessionId);
        sessionStorage.setItem(
            SESSION_TIME_KEY,
            String(Date.now())
        );

        return sessionId;
    }

    sessionStorage.setItem(
        SESSION_TIME_KEY,
        String(Date.now())
    );

    return storedSession;
}

export function getReferralCode(length = 8) {

    const storedReferralCode = localStorage.getItem( REFERRAL_STORAGE_KEY );

    if (!storedReferralCode) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const code = Array.from(
            { length },
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join("");
        localStorage.setItem( REFERRAL_STORAGE_KEY, code);
        return code;
    }

    return storedReferralCode

}

export function getCampaignParams() {
    if (typeof window === "undefined") return {};

    const params = new URLSearchParams(window.location.search);

    return {
        source:
            params.get("utm_source") ||
            detectSource(document.referrer),

        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
        content: params.get("utm_content"),
        term: params.get("utm_term")
    };
}

function detectSource(referrer) {
    if (!referrer) return "direct";

    try {
        const hostname = new URL(referrer).hostname;

        if (hostname.includes("facebook")) return "facebook";
        if (hostname.includes("instagram")) return "instagram";
        if (hostname.includes("tiktok")) return "tiktok";
        if (hostname.includes("google")) return "google";
        if (hostname.includes("whatsapp")) return "whatsapp";

        return hostname;
    } catch {
        return "unknown";
    }
}

export function getDeviceData() {
    if (typeof window === "undefined") return {};

    const userAgent = navigator.userAgent.toLowerCase();

    const deviceType =
        /mobile|android|iphone|ipad/.test(userAgent)
            ? "mobile"
            : "desktop";

    let browser = "other";

    if (userAgent.includes("edg")) browser = "edge";
    else if (userAgent.includes("chrome")) browser = "chrome";
    else if (userAgent.includes("firefox")) browser = "firefox";
    else if (userAgent.includes("safari")) browser = "safari";

    let operatingSystem = "other";

    if (userAgent.includes("windows")) operatingSystem = "windows";
    else if (userAgent.includes("android")) operatingSystem = "android";
    else if (
        userAgent.includes("iphone") ||
        userAgent.includes("ipad")
    ) {
        operatingSystem = "ios";
    } else if (userAgent.includes("mac")) {
        operatingSystem = "macos";
    } else if (userAgent.includes("linux")) {
        operatingSystem = "linux";
    }

    return {
        browser,
        operatingSystem,
        deviceType,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
    };
}

export function isInternalUser() {
    if (typeof window === "undefined") return false;

    return localStorage.getItem(INTERNAL_USER_KEY) === "true";
}

export function enableInternalUser() {
    if (typeof window === "undefined") return;

    localStorage.setItem(INTERNAL_USER_KEY, "true");
}

export function disableInternalUser() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(INTERNAL_USER_KEY);
}