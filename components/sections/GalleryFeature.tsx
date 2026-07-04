"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
    id: number;
    src: string;
    alt: string;
}

export default function GalleryFeature() {
    const [images, setImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        async function fetchGallery() {
            const { data, error } = await supabase
                .from("gallery")
                .select("*")
                .eq("active", true)
                .order("sort_order", { ascending: true })
                .limit(4);

            if (error) {
                console.error("Error fetching gallery:", error);
            } else {
                setImages(data || []);
            }
        }
        fetchGallery();
    }, []);

    return (
        <section
            className="relative py-[100px] bg-cover bg-center bg-fixed text-white min-h-[600px] flex items-center"
            style={{ backgroundImage: "url('/assets/Red-Hair.webp')" }}
        >
            <div className="absolute inset-0 bg-black/75" />

            <div className="relative z-10 max-w-[1300px] mx-auto px-10 flex flex-col md:flex-row gap-20 items-center">
                <div className="flex-1 grid grid-cols-2 gap-5 w-full">
                    {images.length > 0 ? (
                        images.map((img) => (
                            <img
                                key={img.id}
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-[300px] object-cover border border-white/10"
                                loading="lazy"
                            />
                        ))
                    ) : (
                        // Fallback static images if Supabase is empty or loading
                        <>
                            <img src="/assets/Defrisage-1.webp" alt="Defrisage 1" className="w-full h-[300px] object-cover border border-white/10" />
                            <img src="/assets/Defrisage-2.webp" alt="Defrisage 2" className="w-full h-[300px] object-cover border border-white/10" />
                            <img src="/assets/Defrisage-3.webp" alt="Defrisage 3" className="w-full h-[300px] object-cover border border-white/10" />
                            <img src="/assets/Defrisage-4.webp" alt="Defrisage 4" className="w-full h-[300px] object-cover border border-white/10" />
                        </>
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="text-[32px] font-light tracking-[2px] uppercase mb-8">
                        NOUS FAISONS DÉFRISAGE
                    </h2>
                    <p className="text-[16px] leading-[1.8] text-white/80 max-w-[500px]">
                        Il existe quelques variables que vous devez considérer avant de lisser vos cheveux, explique un enseignant de l'équipe de design Mizani de Miami. Voici quelques options pour obtenir un effet parfait.
                    </p>
                </div>
            </div>
        </section>
    );
}
