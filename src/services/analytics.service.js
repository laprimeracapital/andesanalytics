import { db } from "@/libs/supabase";

export async function registerAnalyticsSession(payload) {
    const { error } = await db.rpc(
        "register_web_session",
        {
            p_visitor_key: payload.visitorKey,
            p_session_key: payload.sessionKey,
            p_landing_path: payload.landingPath,
            p_referrer: payload.referrer,
            p_source: payload.source,
            p_medium: payload.medium,
            p_campaign: payload.campaign,
            p_content: payload.content,
            p_term: payload.term,
            p_browser: payload.browser,
            p_operating_system: payload.operatingSystem,
            p_device_type: payload.deviceType,
            p_language: payload.language,
            p_screen_width: payload.screenWidth,
            p_screen_height: payload.screenHeight
        }
    );

    if (error) throw error;
}

export async function trackEvent({visitorKey, sessionKey, eventName, pagePath, eventData = {}}) {
    const { error } = await db
        .from("web_events")
        .insert({
            visitor_key: visitorKey,
            session_key: sessionKey,
            event_name: eventName,
            page_path: pagePath,
            event_data: eventData
        });

    if (error) throw error;
}