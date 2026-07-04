"use client";

import { useEffect } from "react";

export default function LanguageDetector() {
    useEffect(() => {
        // Only run if GTranslate hasn't been initialized by user preference
        const currentCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));

        if (!currentCookie) {
            const browserLang = navigator.language.slice(0, 2).toLowerCase();
            // Base is French (/fr/fr means no translation, just base).
            // We support En and Es. Default to En if not Fr or Es.
            let targetLang = "fr";
            if (browserLang === "en") targetLang = "en";
            else if (browserLang === "es") targetLang = "es";
            else if (browserLang !== "fr") targetLang = "en";

            if (targetLang !== "fr") {
                document.cookie = `googtrans=/fr/${targetLang}; path=/`;
                // Reload to apply translation immediately if it was just set
                window.location.reload();
            }
        }
    }, []);

    return null;
}
