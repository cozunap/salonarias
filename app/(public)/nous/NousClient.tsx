"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BOOKING_SERVICES = [
    "Sélectionner",
    "Coupe Ajustement", "Brushing Cheveux Courts", "Coupe Femme", "Brushing Cheveux Mi-Longs",
    "Brushing Cheveux Longs", "Coupe+Brushing Cheveux Court", "Brushing Cheveux Très Longs",
    "Coupe + Brushing Cheveux Mi-Long", "Coupe + Brushing Cheveux Long",
    "Défrisant Protective", "Défrisant Affirm", "Défrisant Olive Oil", "Défrisant Motions", "Défrisant Mizani",
    "Coloration Tête Complète", "Mèches Dessus Tête", "Coloration Racine", "Coloration Extra",
    "Coloration Mousse", "Mèches Par Papier", "Mèches Demi Tête", "Mèches Tête Complète",
    "Olaplex + Brusing", "Traitement Keratine Long", "Traitement Keratine Court",
    "Traitement Kerastraight Moisture", "Traitement Kerastraight Proteine", "Traitement Moroccanoil",
];

export default function NousClient() {
    const [selectedService, setSelectedService] = useState("Sélectionner");

    return (
        <main>
            <Header />

            {/* ── 1. TIJERAS SECTION ── */}
            <section className="page-content tijeras-section" style={{ paddingTop: "180px" }}>
                <div className="page-container">
                    <h1 id="nous-intro-title" style={{
                        fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(22px,4vw,36px)",
                        fontWeight: 800, textTransform: "uppercase", color: "#1a1a1a",
                        textAlign: "center", marginBottom: "40px", letterSpacing: "1px",
                    }}>
                        POURQUOI SALON DE BEAUTÉ ARIAS?
                    </h1>
                    <p style={{
                        fontFamily: "'Montserrat',sans-serif", fontSize: "14px", lineHeight: 2,
                        color: "#555", textAlign: "center", maxWidth: "800px", margin: "0 auto 20px",
                    }}>
                        De plus en plus de femmes au Canada ont entendu parler de la façon dont les femmes dominicaines peuvent
                        travailler avec tous les types de cheveux et avec quelle facilité et habilement elles travaillent, parce que
                        les cheveux de la République dominicaine sont un mélange de cheveux d&apos;origine européenne, indigène et les
                        Africains, il y a que les coiffeurs dominicains peuvent travailler toutes sortes de cheveux. Les coiffeurs
                        dominicains ont une vaste connaissance des produits qui vous conviennent le mieux, en fonction de la texture
                        et du type de cheveux de chaque client.
                    </p>
                    <p style={{
                        fontFamily: "'Montserrat',sans-serif", fontSize: "14px", lineHeight: 2,
                        color: "#555", textAlign: "center", maxWidth: "800px", margin: "0 auto",
                    }}>
                        Plus qu&apos;un coiffeur, dans un salon de beauté, ils détiendront des secrets qui changeront votre façon de vous
                        occuper de vous-même, ils pourraient vous accorder des heures et des heures d&apos;attention, ils pourraient même
                        nouer des amitiés qui dureront toute une vie. Bien que trouver le salon idéal puisse prendre du temps, nous
                        vous donnons maintenant quelques conseils pour en faire votre petit refuge.
                    </p>
                </div>
            </section>

            {/* ── 2. PERSONNEL PROFESSIONNEL ── */}
            <section className="split-section">
                <div id="nous-professional" className="half-img"
                    style={{ backgroundImage: "url('/assets/tigeras.webp')" }} />
                <div className="half-text">
                    <h4 id="nous-professional-subtitle" className="split-subtitle">SALON DE BEAUTÉ ARIAS</h4>
                    <h2 id="nous-professional-title" className="split-title">PERSONNEL PROFESSIONNEL</h2>
                    <div id="nous-professional-text" className="split-text dropcap-paragraph">
                        <p className="split-text">
                            Au Salon De Beauté Arias nous croyons dans la transformation que nous créons pour nos clients, mais aussi
                            dans l&apos;élégance que peut véhiculer un coiffeur.
                        </p>
                        <p className="split-text">
                            Nous apportons harmonie, beauté et innovation à notre travail dans un lieu plein de créativité et
                            d&apos;atmosphère intime de passion. Nous sommes l&apos;avenir de la coiffure moderne, puisque nous sommes
                            spécialisés dans tous les types de cheveux, nous sommes situés à Laval.
                        </p>
                        <p className="split-text">
                            La qualité et le professionnalisme qui nous a distingués depuis le début et nous maintient à la pointe
                            de l&apos;industrie coiffure et beauté sont primordiaux. Nous cherchons toujours à satisfaire nos clients et
                            à les conseiller spécifiquement sur la façon de prendre soin de leurs beaux et rayonnants cheveux.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 3. POURQUOI SALON DE BEAUTÉ ARIAS? ── */}
            <section className="split-section" style={{ flexDirection: "row-reverse" }}>
                <div id="nous-why" className="half-img"
                    style={{ backgroundImage: "url('/assets/Coupe-de-cheveux.webp')" }} />
                <div className="half-text">
                    <h4 id="nous-why-subtitle" className="split-subtitle">SALON DE BEAUTÉ ARIAS</h4>
                    <h2 id="nous-why-title" className="split-title">EXPERTISE DOMINICAINE</h2>
                    <div id="nous-why-text" className="split-text dropcap-paragraph">
                        <p className="split-text">
                            De plus en plus de femmes au Canada ont entendu parler de la façon dont les femmes dominicaines peuvent
                            travailler avec tous les types de cheveux et avec quelle facilité et habilement elles travaillent.
                        </p>
                        <p className="split-text">
                            Plus qu&apos;un simple salon, nous sommes un refuge où nous détiendrons des secrets qui changeront votre façon de
                            vous occuper de vous-même. Spécialistes en lissage brésilien et botox capillaire à Laval.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 4. BOOKING PARALLAX ── */}
            <section className="booking-parallax">
                <div className="booking-container">
                    <h4 id="nous-booking-subtitle" className="split-subtitle" style={{ textAlign: "center" }}>
                        PRENEZ RENDEZ-VOUS
                    </h4>
                    <h2 id="nous-booking-title" className="split-title"
                        style={{ textAlign: "center", fontSize: "28px" }}>
                        UTILISEZ NOTRE<br />SYSTÈME DE<br />RÉSERVATION ET GAGNEZ DU TEMPS.
                    </h2>
                    <div className="booking-form-box">
                        <p className="split-subtitle" style={{ fontSize: "11px", marginBottom: "5px", fontWeight: 600 }}>
                            SÉLECTIONNEZ UN SERVICE
                        </p>
                        <select
                            className="booking-select"
                            id="booking-service-select"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            {BOOKING_SERVICES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            className="booking-btn"
                            id="booking-next-btn"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-booking', { detail: { service: selectedService } }))}
                        >
                            Prendre un rendez-vous
                        </button>
                    </div>
                </div>
            </section>

            {/* ── 5. MIZANI SECTION ── */}
            <section className="mizani-section">
                <div className="mizani-container">
                    <div className="mizani-text">
                        <h2 id="nous-mizani-title">MIZANI RELAXER</h2>
                        <h4 id="nous-mizani-subtitle">DÉFRISANT AU MÉLENGE DE BEURRE - CHEVEUX MOYENS ET NORMAUX</h4>
                        <div className="services-list-divider" style={{ width: "60px", margin: "20px 0" }} />
                        <p>Un traitement lissant qui lisse les cheveux cassants et frisottis.</p>
                    </div>
                    <div className="mizani-image">
                        <img id="nous-mizani" src="/assets/mizani-relaxer.webp" alt="Mizani Relaxer" />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
