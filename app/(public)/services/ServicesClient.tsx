"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

interface BlockProps {
    image: string;
    title: string;
    services: string[];
    reverse?: boolean;
}

function ServiceBlock({ image, title, services, reverse = false }: BlockProps) {
    const handleOpenService = (s: string) => {
        window.dispatchEvent(new CustomEvent('open-booking', { detail: { service: s } }));
    };

    return (
        <div className="services-split" style={reverse ? { flexDirection: 'row-reverse' } : {}}>
            <div
                className="half-img"
                style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="half-list">
                <div className="services-list-container">
                    <h3 className="services-list-title">{title}</h3>
                    <div className="services-list-divider" />
                    <ul className="services-list">
                        {services.map((s) => (
                            <li
                                key={s}
                                onClick={() => handleOpenService(s)}
                            >
                                <i className="fas fa-user-alt" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function ServicesClient() {
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('active', true)
                    .order('sort_order', { ascending: true });
                if (error) throw error;
                setServicesList(data || []);
            } catch (err) {
                console.error("Error fetching services:", err);
                setServicesList([]);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    return (
        <main>
            <Header />
            {loading ? (
                <div style={{ paddingTop: "120px", paddingBottom: "120px", textAlign: "center", color: "#666" }}>
                    Chargement des services...
                </div>
            ) : (
                <section className="services-content" style={{ padding: 0, margin: 0, paddingTop: '50px' }}>
                    <h1 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                        Nos Services de Coiffure à Laval
                    </h1>
                    <div id="services-container">
                        {servicesList.map((service, index) => (
                            <ServiceBlock
                                key={service.id}
                                image={service.image}
                                title={service.name}
                                services={service.items || []}
                                reverse={index % 2 !== 0} // Alternate layout (image right/left)
                            />
                        ))}
                    </div>
                </section>
            )}
            <Footer />
        </main>
    );
}
