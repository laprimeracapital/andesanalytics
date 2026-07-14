"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function MetaPixelPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();

    useEffect(() => {
        const currentUrl = `${pathname}${
            queryString ? `?${queryString}` : ""
        }`;

        // Evita registrar dos veces la misma página.
        if (window.__META_PIXEL_LAST_URL__ === currentUrl) {
            return;
        }

        if (typeof window.fbq !== "function") {
            return;
        }

        window.fbq("track", "PageView");
        window.__META_PIXEL_LAST_URL__ = currentUrl;
    }, [pathname, queryString]);

    return null;
}