"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/sections/HeroSlider";
import Link from "next/link";
import Testimonials from "@/components/sections/Testimonials";
import CookieConsent from "@/components/ui/CookieConsent";

export default function HomeClient() {
  return (
    <main>
      <Header />
      <CookieConsent />

      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. 3 Columns Services */}
      <section className="services-tri">
        <div className="service-box light">
          <div className="service-box-content">
            <div className="script-title">Salon</div>
            <h3>Lissage de cheveux</h3>
            <p>Marre de vos cheveux bouclés ? La kératine peut être votre solution pour une meilleure gestion de celles-ci.</p>
            <Link href="/services" className="btn-box">Afficher Plus</Link>
          </div>
        </div>
        <div className="service-box dark">
          <div className="service-box-content">
            <div className="script-title">Beauté</div>
            <h3>Coloration</h3>
            <p>Nous avons une grande variété de couleurs, pour faire vivre vos cheveux avec joie. Prenez rendez-vous aujourd&apos;hui ou appelez-nous.</p>
            <Link href="/services" className="btn-box">Afficher Plus</Link>
          </div>
        </div>
        <div className="service-box light">
          <div className="service-box-content">
            <div className="script-title">Arias</div>
            <h3>Traitements</h3>
            <p>Nous travaillons avec les meilleurs produits du marché, pour que vos cheveux restent soyeux et soignés.</p>
            <Link href="/services" className="btn-box">Afficher Plus</Link>
          </div>
        </div>
      </section>

      {/* 3. Info Banner */}
      <section className="info-banner">
        <div className="info-banner-container">
          <span id="index-info-subtitle" className="info-banner-tag">Montréal &bull; Depuis 2017</span>
          <h2 id="index-info-title" className="info-banner-title">NOUS SOMMES SPÉCIALISTES DES<br />CHEVEUX BOUCLÉS OU CRÉPUS.</h2>
          <p id="index-info-text" className="info-banner-text">Vous rêvez de cheveux lisses, d&apos;apparence saine, parfaits, prêts à basculer en toute occasion ? Nous ferons de vos rêves une réalité.</p>
        </div>
      </section>

      {/* 4. Booking CTA */}
      <section className="booking-cta">
        <div className="booking-cta-container">
          <div className="booking-cta-left">
            <span className="booking-cta-sub">PRENEZ RENDEZ-VOUS</span>
            <div className="booking-cta-line"></div>
            <h2 className="booking-cta-title" style={{ color: "#fff" }}>UTILISEZ NOTRE SYSTÈME<br />DE RÉSERVATION ET<br />GAGNEZ DU TEMPS.</h2>
          </div>
          <div className="booking-cta-right">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
              id="global-booking-btn"
              className="btn-cta"
            >
              Réservez Maintenant !
            </button>
          </div>
        </div>
      </section>

      {/* 5. Gallery Feature */}
      <section className="gallery-feature">
        <div className="gallery-feature-container">
          <div className="gallery-grid" id="gallery-grid">
            <img src="/assets/Defrisage-1.webp" alt="Defrisage 1" loading="lazy" />
            <img src="/assets/Defrisage-2.webp" alt="Defrisage 2" loading="lazy" />
            <img src="/assets/Defrisage-3.webp" alt="Defrisage 3" loading="lazy" />
            <img src="/assets/Defrisage-4.webp" alt="Defrisage 4" loading="lazy" />
          </div>
          <div className="gallery-content">
            <h2 id="index-gallery-title" className="gallery-title" style={{ color: "#fff" }}>NOUS FAISONS DÉFRISAGE</h2>
            <p id="index-gallery-text" className="gallery-text" style={{ color: "#fff" }}>Il existe quelques variables que vous devez considérer avant de lisser vos cheveux. Confiez vos cheveux brillants et soyeux à des professionnels.</p>
          </div>
        </div>
      </section>

      {/* 6. Testimonials component (JS Block) */}
      <Testimonials />

      <Footer />
    </main>
  );
}
