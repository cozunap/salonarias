"use client";

export default function InfoBanner() {
    return (
        <section
            className="relative py-[120px] px-5 text-center bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/assets/nappy.webp')" }}
        >
            {/* 
        Note: Next.js images in /public are served from /assets/... if moved there.
        I moved them to /public/assets earlier.
      */}
            <div className="max-w-[900px] mx-auto relative z-10">
                <span className="text-[13px] font-bold text-white uppercase tracking-[2px] mb-5 block">
                    Montréal • Depuis 2017
                </span>
                <h2 className="text-[36px] md:text-[42px] font-black leading-[1.25] mb-8 text-white uppercase tracking-[0.5px]">
                    NOUS SOMMES SPÉCIALISTES DES<br />CHEVEUX BOUCLÉS OU CRÉPUS.
                </h2>
                <p className="text-[16px] text-white leading-[1.8] font-medium">
                    Vous rêvez de cheveux lisses, d'apparence saine, parfaits, prêts à basculer en toute occasion ? Nous ferons de vos rêves une réalité.
                </p>
            </div>
        </section>
    );
}
