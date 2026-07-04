import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Nos Services | Lissage, Botox Capillaire & Kératine Laval",
  description: "Découvrez nos services spécialisés : lissage brésilien, lissage au tanin, botox capillaire, coloration et soins pour cheveux bouclés à Laval.",
  alternates: {
    canonical: "https://salonbeautearias.ca/services",
  },
  keywords: ["lissage bresilien laval", "botox capillaire laval", "lissage tanin laval", "soins cheveux boucles", "coiffeur laval"],
};

export default function ServicesPage() {
  return <ServicesClient />;
}
