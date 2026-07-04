import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Meilleur Salon de Coiffure à Laval | Lissage & Kératine",
  description: "Bienvenue au Salon Beauté Arias. Spécialistes en lissage brésilien, tanin, botox capillaire et soins pour cheveux bouclés à Laval. Excellence et professionnalisme.",
  alternates: {
    canonical: "https://salonbeautearias.ca",
  },
};

export default function Home() {
  return <HomeClient />;
}
