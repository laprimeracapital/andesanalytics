'use client';

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCampaignParams, getDeviceData, getSessionId, getVisitorId } from "@/helpers/analytics.helper";
import { registerAnalyticsSession, trackEvent } from "@/services/analytics.service";
import { ENV } from "@/config";

const EXCLUDED_PATHS = [
    "/dashboard",
    "/admin",
    "/login"
];

const shouldTrack = pathname => {
    if (!pathname) return false;

    if (ENV !== "production") {
        return false;
    }

    return !EXCLUDED_PATHS.some(route =>
        pathname.startsWith(route)
    );
};

export function useAnalytics() {
    const pathname = usePathname();
    const initialized = useRef(false);

    const trackingEnabled = shouldTrack(pathname);

    const sendEvent = useCallback(
        async (eventName, eventData = {}) => {
            if (!shouldTrack(pathname)) return;

            try {
                const visitorKey = getVisitorId();
                const sessionKey = getSessionId();

                if (!visitorKey || !sessionKey) return;

                await trackEvent({
                    visitorKey,
                    sessionKey,
                    eventName,
                    pagePath: pathname,
                    eventData
                });
            } catch (error) {
                console.error(
                    "Error registrando evento:",
                    error
                );
            }
        },
        [pathname]
    );

    useEffect(() => {
        if (!trackingEnabled) {
            initialized.current = false;
            return;
        }

        async function initialize() {
            try {
                const visitorKey = getVisitorId();
                const sessionKey = getSessionId();
                const campaign = getCampaignParams();
                const device = getDeviceData();

                if (!visitorKey || !sessionKey) return;

                await registerAnalyticsSession({
                    visitorKey,
                    sessionKey,
                    landingPath: pathname,
                    referrer: document.referrer || null,
                    ...campaign,
                    ...device
                });

                initialized.current = true;

                await trackEvent({
                    visitorKey,
                    sessionKey,
                    eventName: "page_view",
                    pagePath: pathname,
                    eventData: {
                        title: document.title
                    }
                });
            } catch (error) {
                console.error(
                    "Error iniciando analítica:",
                    error
                );
            }
        }

        initialize();
    }, [pathname, trackingEnabled]);

    return {
        track: sendEvent,
        trackingEnabled
    };
}