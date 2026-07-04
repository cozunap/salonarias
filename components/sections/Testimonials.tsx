"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Real Google reviews — ordered newest → oldest
const REVIEWS = [
    {
        author: "Thalia Cuenca",
        rating: 5,
        date: "2 months ago",
        text: "Best service in town for a Dominican blowout! I recommend it :)",
    },
    {
        author: "Mel Garcia",
        rating: 5,
        date: "10 months ago",
        text: "Carmen the owner is such a talented woman! Best prices in town, best brush and blow out ever. She has 2 employees there. Carmen is the best!",
    },
    {
        author: "yaya jimenez",
        rating: 5,
        date: "1 year ago",
        text: "Unparalleled customer service. Salon owner Ms. Carmen takes great care of all her clients. Whether it's for a blow-dry or a color, you won't be disappointed at Arias Salon!",
    },
    {
        author: "Jhonatan Núñez",
        rating: 5,
        date: "1 year ago",
        text: "Super nice, very professional, totally recommended!",
    },
    {
        author: "Marilyn Kano",
        rating: 5,
        date: "1 year ago",
        text: "I came upon this salon randomly as a tourist and made an appointment for color and blow dry. The ladies there took good care of me and did a very nice job with my hair. I am very pleased and recommend.",
    },
    {
        author: "Sonia Martinez",
        rating: 5,
        date: "1 year ago",
        text: "Excellent service! Shampoo & conditioning done perfectly. Would definitely come back.",
    },
    {
        author: 'Marjorie "Mr&Mrs Champagne" Rancy',
        rating: 5,
        date: "4 years ago",
        text: "If you're looking for a beauty salon offering exceptional service, I highly recommend this one. It's the best place in Laval for a blowout or brushing.",
    },
];

function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "16px" }}>
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} style={{ color: "#c9a96e", fontSize: "18px" }}>★</span>
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section
            style={{
                backgroundColor: "#f5f2f2",
                padding: "80px 20px",
                textAlign: "center",
            }}
        >
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <p
                    style={{
                        color: "#d1afa6",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "4px",
                        marginBottom: "15px",
                    }}
                >
                    Ce que disent nos clientes
                </p>
                <h2
                    style={{
                        fontSize: "36px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        marginBottom: "50px",
                        color: "#1a1a1a",
                    }}
                >
                    Témoignages
                </h2>

                {/* Google branding */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "40px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span style={{ fontSize: "13px", color: "#888", fontWeight: 600 }}>Avis Google</span>
                    <span style={{ fontSize: "13px", color: "#c9a96e", fontWeight: 700 }}>★ 5.0</span>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    style={{ paddingBottom: "40px" }}
                >
                    {REVIEWS.map((r, idx) => (
                        <SwiperSlide key={idx}>
                            <div style={{ padding: "0 20px" }}>
                                <Stars count={r.rating} />
                                <p
                                    style={{
                                        fontSize: "17px",
                                        fontStyle: "italic",
                                        lineHeight: 1.9,
                                        color: "#555",
                                        marginBottom: "20px",
                                        maxWidth: "680px",
                                        margin: "0 auto 20px",
                                    }}
                                >
                                    &ldquo;{r.text}&rdquo;
                                </p>
                                <div
                                    style={{ width: "40px", height: "2px", background: "#d1afa6", margin: "0 auto 12px" }}
                                />
                                <h4
                                    style={{
                                        fontSize: "15px",
                                        fontWeight: "bold",
                                        color: "#241c1a",
                                        textTransform: "uppercase",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {r.author}
                                </h4>
                                <p style={{ fontSize: "12px", color: "#aaa", letterSpacing: "1px" }}>{r.date}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
