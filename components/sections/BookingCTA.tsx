"use client";

export default function BookingCTA() {
    return (
        <section
            className="relative py-[120px] bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: "url('/assets/Defrisage.webp')" }}
        >
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative z-10 max-w-[1300px] mx-auto px-10 flex flex-col md:flex-row justify-center items-center gap-[60px]">
                <div className="flex-1 text-center md:text-right">
                    <span className="text-[15px] tracking-[2px] font-medium">PRENEZ RENDEZ-VOUS</span>
                    <div className="w-[250px] h-[px] bg-white/30 my-5 mx-auto md:mr-0" />
                    <h2 className="text-[32px] font-bold leading-[1.3] uppercase">
                        UTILISEZ NOTRE SYSTÈME<br />DE RÉSERVATION ET<br />GAGNEZ DU TEMPS.
                    </h2>
                </div>

                <div className="flex-1 flex justify-center md:justify-start">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                        className="bg-white text-black px-[45px] py-[18px] font-semibold text-[16px] transition-all hover:bg-brand-primary hover:text-white"
                    >
                        Réservez Maintenant !
                    </button>
                </div>
            </div>
        </section>
    );
}
