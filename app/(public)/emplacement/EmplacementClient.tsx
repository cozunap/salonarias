"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./Emplacement.module.css";

const MAPS_URL =
    "https://www.google.com/maps/dir//Salon+Beaute+arias,+235+Boulevard+des+Laurentides,+Laval,+QC+H7G+2T7/@45.5664415,-73.6874937,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x4cc92204a2bf113f:0xef09dabfb3901ab7!2m2!1d-73.6874937!2d45.5664415";

export default function EmplacementClient() {
    return (
        <main>
            <Header />

            <h1 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                Notre Emplacement à Laval | Salon Beauté Arias
            </h1>

            {/* Map + custom SVG marker overlay — centered with bounce effect */}
            <div className={styles.mapContainer}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.8340156942007!2d-73.6961445!3d45.5737894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91f1b6237590d%3A0xe542fa75b8a011ed!2s235%20Boul.%20des%20Laurentides%2C%20Laval%2C%20QC%20H7G%202T7!5e0!3m2!1sfr!2sca!4v1700000000000!5m2!1sfr!2sca"
                    className={styles.mapIframe}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Salon Beauté Arias — Google Maps"
                />

                {/* Custom salon-marker.svg — positioned over the salon location with bounce effect */}
                <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.markerOverlay}
                    title="Obtenir l'itinéraire – Salon Beauté Arias"
                >
                    <img
                        src="/assets/salon-marker.svg"
                        alt="Marker"
                        className={styles.markerIcon}
                    />
                </a>
            </div>

            <Footer />
        </main>
    );
}
