"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    const [settings, setSettings] = useState<Record<string, string>>({
        contact_phone: "514-513-2494",
        contact_email: "info@salonbeautearias.com",
        contact_address: "235 Boulevard des Laurentides, Laval, Quebec H7G 2T7",
        hours_weekdays: "Lundi - Vendredi: 10h - 18h",
        hours_saturday: "Samedi: 10h - 17h",
        hours_sunday: "Dimanche: Nous Sommes Fermé"
    });

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase.from('settings').select('key, value');
            if (data) {
                const map = { ...settings };
                data.forEach(item => {
                    // strip surrounding quotes from jsonb strings
                    map[item.key] = typeof item.value === 'string' ? item.value.replace(/^"|"$/g, '') : item.value;
                });
                setSettings(map);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="footer">
            {/* ── Top brown bar: APPELEZ-NOUS | E-MAIL | ADRESSE ── */}
            <div className="footer-top-bar">
                <div className="footer-top-container">
                    <a href={`tel:${settings.contact_phone?.replace(/\D/g, '')}`} className="top-bar-item">
                        <i className="fas fa-phone-alt" /> APPELEZ-NOUS
                    </a>
                    <span className="top-bar-item" style={{ cursor: "default" }} title={settings.contact_email}>
                        <i className="fas fa-envelope" /> COURRIEL
                    </span>
                    <Link href="/emplacement" className="top-bar-item">
                        <i className="fas fa-car" /> ADRESSE
                    </Link>
                </div>
            </div>

            {/* ── Main dark footer ── */}
            <div className="footer-main">
                <div className="footer-overlay" />
                <div className="footer-container">
                    {/* 3 columns */}
                    <div className="footer-grid">
                        {/* Logo centred — full width above 3 columns, same as original */}
                        <div className="footer-logo" style={{ textAlign: "center", marginBottom: "40px", gridColumn: "1 / -1" }}>
                            <Link href="/">
                                <img
                                    src="/assets/salonbeautecarmenwhite.svg"
                                    alt="Salon Beauté Arias"
                                    style={{ maxWidth: "180px", display: "inline-block" }}
                                />
                            </Link>
                        </div>

                        {/* Col 1 — CONTACTEZ-NOUS */}
                        <div className="footer-col">
                            <h3 className="footer-title">CONTACTEZ-NOUS</h3>
                            <div className="footer-info">
                                <p className="footer-address">
                                    <strong>Adresse :</strong><br />
                                    {(() => {
                                        const addr = settings.contact_address || "";
                                        const idx = addr.indexOf(',');
                                        return idx !== -1 ? (
                                            <>
                                                {addr.substring(0, idx + 1)}<br />
                                                {addr.substring(idx + 1).trim()}
                                            </>
                                        ) : addr;
                                    })()}
                                </p>
                                <p className="footer-phone"><strong>Téléphone :</strong> {settings.contact_phone}</p>
                                <p>
                                    <a href={`mailto:${settings.contact_email}`} className="footer-link footer-email-link" style={{ cursor: "pointer", textDecoration: 'none' }}>
                                        Envoyez-nous un email
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Col 2 — HORAIRES D'OUVERTURES */}
                        <div className="footer-col">
                            <h3 className="footer-title">HORAIRES D&apos;OUVERTURES</h3>
                            <div className="footer-info">
                                <p className="footer-hours-mon-fri">{settings.hours_weekdays}</p>
                                <p className="footer-hours-sat">{settings.hours_saturday}</p>
                                <p className="footer-hours-sun">{settings.hours_sunday}</p>
                            </div>
                        </div>

                        {/* Col 3 — RESTER EN CONTACT */}
                        <div className="footer-col">
                            <h3 className="footer-title">RESTER EN CONTACT</h3>
                            <div className="footer-info">
                                <div className="footer-social-links" style={{ display: 'flex', gap: '15px', fontSize: '24px' }}>
                                    <a href="https://www.instagram.com/arias_salon_beaute/" target="_blank" rel="noopener noreferrer" className="footer-link hover:text-white transition-colors">
                                        <i className="fab fa-instagram" />
                                    </a>
                                    <a href="https://www.facebook.com/p/Salon-de-beaute-Arias-100082990254280/" target="_blank" rel="noopener noreferrer" className="footer-link hover:text-white transition-colors">
                                        <i className="fab fa-facebook-f" />
                                    </a>
                                </div>
                                <p className="mt-4 text-sm text-gray-400">
                                    Suivez-nous sur nos réseaux sociaux pour découvrir nos dernières créations et offres exclusives.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="footer-bottom">
                        <p>
                            Copyright &copy; {new Date().getFullYear()} Salon De Beauté Arias |{" "}
                            <a href="https://cozuna.com" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal' }}>
                                Design by cozuna
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
