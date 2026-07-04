import { Metadata } from "next";
import EmplacementClient from "./EmplacementClient";

export const metadata: Metadata = {
  title: "Emplacement & Contact | Salon de Coiffure à Laval",
  description: "Visitez le Salon Beauté Arias au 235 Boulevard des Laurentides, Laval. Trouvez-nous facilement sur la carte et prenez rendez-vous pour vos soins capillaires.",
  alternates: {
    canonical: "https://salonbeautearias.ca/emplacement",
  },
};

export default function EmplacementPage() {
  return <EmplacementClient />;
}
