"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

interface SlideData {
    id: string;
    image_url: string;
    subtitle: string;
    title: string;
    button_label: string;
    button_link: string;
    button2_label?: string;
    button2_link?: string;
    active?: boolean;
}

export default function HeroSlider() {
    const [sliderData, setSliderData] = useState<SlideData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSlides() {
            try {
                const q = query(
                    collection(db, "homepage_sliders"),
                    orderBy("sort_order", "asc")
                );
                const querySnapshot = await getDocs(q);
                let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SlideData));
                data = data.filter(slide => slide.active === true);

                if (data.length > 0) {
                    setSliderData(data);
                }
            } catch (err) {
                console.error("Unexpected error loading slides", err);
            } finally {
                setLoading(false);
            }
        }

        fetchSlides();
    }, []);

    if (loading || sliderData.length === 0) {
        return <section className="hero-slider" style={{ background: '#1a1a1a' }} />;
    }

    const handleButtonClick = (link: string | undefined) => {
        if (!link) return;
        if (link === "#booking" || link === "") {
            window.dispatchEvent(new CustomEvent("open-booking"));
        } else {
            window.location.href = link;
        }
    };

    return (
        <section className="hero-slider">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={false}
                className="myHeroSwiper"
            >
                {sliderData.map((slide) => {
                    if (!slide.image_url) return null;
                    return (
                        <SwiperSlide
                            key={slide.id}
                            style={{ backgroundImage: `url('${slide.image_url}')` }}
                        >
                            <div className="hero-slide-overlay">
                                <div className="hero-content">
                                    <span className="hero-subtitle">{slide.subtitle}</span>
                                    <h1 className="hero-title">
                                        {slide.title.split(/<br\s*\/?>/gi).map((line, i, arr) => (
                                            <span key={i}>
                                                {line}
                                                {i < arr.length - 1 && <br />}
                                            </span>
                                        ))}
                                    </h1>
                                    <div className="hero-buttons">
                                        {slide.button_label && (
                                            <button
                                                className="btn-cta hero-book-btn"
                                                onClick={() => handleButtonClick(slide.button_link)}
                                            >
                                                {slide.button_label}
                                            </button>
                                        )}
                                        {slide.button2_label && (
                                            <button
                                                className="btn-cta"
                                                onClick={() => handleButtonClick(slide.button2_link)}
                                            >
                                                {slide.button2_label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}
