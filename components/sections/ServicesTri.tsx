"use client";

import Link from "next/link";

const staticServices = [
    {
        title: "Lissage de cheveux",
        subtitle: "Salon",
        description: "Marre de vos cheveux bouclés ? La kératine peut être votre solution pour une meilleure gestion de celles-ci.",
        type: "light",
    },
    {
        title: "Coloration",
        subtitle: "Beauté",
        description: "Nous avons une grande variété de couleurs, pour faire vivre vos cheveux avec joie. Prenez rendez-vous aujourd'hui ou appelez-nous.",
        type: "dark",
    },
    {
        title: "Traitements",
        subtitle: "Arias",
        description: "Nous travaillons avec les meilleurs produits du marché, pour que vos cheveux restent soyeux et soignés.",
        type: "light",
    },
];

export default function ServicesTri() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 bg-white">
            {staticServices.map((service, index) => (
                <div
                    key={index}
                    className={`px-10 py-20 flex flex-col items-center justify-center min-h-[400px] text-center transition-colors ${service.type === "dark" ? "bg-black text-white" : "bg-white text-black"
                        }`}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="font-['Aguafina_Script'] text-[80px] text-[#fce1d4] dark:text-[#69442a] leading-[0.2] mb-5 opacity-90">
                            {service.subtitle}
                        </span>
                        <h3 className="text-[16px] font-semibold uppercase tracking-wider mb-6">
                            {service.title}
                        </h3>
                        <p className={`text-[13px] leading-[1.8] mb-10 max-w-[280px] ${service.type === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}>
                            {service.description}
                        </p>
                        <Link
                            href="/services"
                            className={`text-[13px] font-semibold uppercase tracking-wider px-8 py-3 border transition-all ${service.type === "dark"
                                    ? "text-white border-white hover:bg-white hover:text-black"
                                    : "text-black border-black hover:bg-black hover:text-white"
                                }`}
                        >
                            Afficher Plus
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}
