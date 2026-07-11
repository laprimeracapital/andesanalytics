'use client';

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
    getCampaignParams,
    getDeviceData,
    getSessionId,
    getVisitorId
} from "@/helpers/analytics.helper";

import {
    registerAnalyticsSession,
    trackEvent
} from "@/services/analytics.service";

export function useAnalytics() {
    const pathname = usePathname();
    const initialized = useRef(false);

    const sendEvent = useCallback(
        async (eventName, eventData = {}) => {
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
        async function initialize() {
            try {
                const visitorKey = getVisitorId();
                const sessionKey = getSessionId();
                const campaign = getCampaignParams();
                const device = getDeviceData();

                await registerAnalyticsSession({
                    visitorKey,
                    sessionKey,
                    landingPath: pathname,
                    referrer: document.referrer || null,
                    ...campaign,
                    ...device
                });

                initialized.current = true;
            } catch (error) {
                console.error(
                    "Error iniciando analítica:",
                    error
                );
            }
        }

        if (!initialized.current) {
            initialize();
        }
    }, []);

    useEffect(() => {
        if (!initialized.current) return;

        sendEvent("page_view", {
            title: document.title
        });
    }, [pathname, sendEvent]);

    return {
        track: sendEvent
    };
}