import type { Metadata } from "next";
import { Raleway, Aguafina_Script } from "next/font/google";
import "../globals.css";
import "../style.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const aguafina = Aguafina_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aguafina",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://salonbeautearias.ca"),
  title: {
    default: "Salon Beauté Arias | Meilleur Salon de Coiffure à Laval",
    template: "%s | Salon Beauté Arias"
  },
  description: "Découvrez le Salon de Beauté Arias à Laval. Coiffeuses expertes en lissage brésilien, tanin, botox capillaire, kératine et cheveux bouclés. Prenez rendez-vous !",
  icons: {
    icon: "/assets/favicon.svg",
  },
  keywords: [
    "salon de coiffure laval", 
    "coiffeur dominicain montreal", 
    "lissage bresilien laval", 
    "lissage au tanin laval",
    "botox capillaire laval",
    "traitement keratine laval", 
    "cheveux boucles", 
    "coiffeur cheveux crepus", 
    "coloration cheveux laval", 
    "salon beaute arias laval",
    "coiffeur boulevard des laurentides"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "fr-CA": "/fr",
      "en-CA": "/en",
      "es-CA": "/es",
    },
  },
  openGraph: {
    title: "Salon Beauté Arias | Salon de Coiffure à Laval",
    description: "Le salon d'excellence à Laval pour tous types de cheveux. Spécialistes en lissage, kératine et botox capillaire.",
    url: "https://salonbeautearias.ca",
    siteName: "Salon Beauté Arias",
    images: [
      {
        url: "/assets/favicon.png", 
        width: 1200,
        height: 630,
        alt: "Salon Beauté Arias",
      },
    ],
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salon Beauté Arias | Salon de Coiffure à Laval",
    description: "Le salon d'excellence à Laval pour tous types de cheveux.",
    images: ["/assets/favicon.png"],
  },
  robots: "index, follow",
};

import AntiCopy from "@/components/ui/AntiCopy";
import LanguageDetector from "@/components/ui/LanguageDetector";
import ScrollToTop from "@/components/ui/ScrollToTop";
import BookingModal from "@/components/booking/BookingModal";
import Script from "next/script";
import JsonLd from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "Salon Beauté Arias",
    "image": "https://salonbeautearias.ca/assets/favicon.png",
    "@id": "https://salonbeautearias.ca",
    "url": "https://salonbeautearias.ca",
    "telephone": "514-513-2494",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "235 Boulevard des Laurentides",
      "addressLocality": "Laval",
      "addressRegion": "QC",
      "postalCode": "H7G 2T7",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 45.5664415,
      "longitude": -73.6874937
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/p/Salon-de-beaute-Arias-100082990254280/",
      "https://www.instagram.com/arias_salon_beaute/"
    ]
  };

  return (
    <html lang="fr-CA">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <JsonLd data={jsonLd} />
      </head>
      <body
        className={`${raleway.variable} ${aguafina.variable} antialiased font-sans`}
      >
        <LanguageDetector />
        <BookingModal />
        {children}
        <ScrollToTop />
        <AntiCopy />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        {/* Hidden GTranslate widget */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="gtranslate-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.googleTranslateElementInit = function() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'fr', 
                includedLanguages: 'en,es,fr',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `
        }} />
      </body>

    </html>
  );
}
