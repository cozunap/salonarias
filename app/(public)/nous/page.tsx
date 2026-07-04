import { Metadata } from "next";
import NousClient from "./NousClient";

export const metadata: Metadata = {
  title: "À Propos de Nous | Salon de Beauté Arias Laval",
  description: "Découvrez l'histoire et l'expertise du Salon Beauté Arias. Coiffeurs dominicains spécialisés dans tous les types de cheveux à Laval depuis 2017.",
  alternates: {
    canonical: "https://salonbeautearias.ca/nous",
  },
};

export default function NousPage() {
  return <NousClient />;
}
