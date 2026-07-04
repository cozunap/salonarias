"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("salon-arias-cookie-consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("salon-arias-cookie-consent", "accepted-all");
        setIsVisible(false);
        // Here you would initialize your tracking scripts (GA, Pixel, etc.)
    };

    const handleDecline = () => {
        localStorage.setItem("salon-arias-cookie-consent", "declined-non-essential");
        setIsVisible(false);
        // Here you would ensure no non-essential scripts are loaded
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button
                    onClick={handleClose}
                    className={styles.closeBtn}
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                <h3 className={styles.title}>COOKIES</h3>
                <p className={styles.text}>
                    Nous utilisons des cookies essentiels au fonctionnement du site et des cookies optionnels pour améliorer votre expérience.
                    En cliquant sur "Accepter", vous acceptez notre utilisation des cookies.
                </p>

                <div className={styles.buttons}>
                    <button
                        onClick={handleAcceptAll}
                        className={styles.btnPrimary}
                    >
                        Accepter
                    </button>
                    <button
                        onClick={handleDecline}
                        className={styles.btnSecondary}
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    );
}
