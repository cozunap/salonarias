"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    const headerClass = `header ${scrolled ? "scrolled" : ""} ${!isHome ? "inner-header" : ""}`;

    return (
        <header className={headerClass} id="header">
            <div className="header-container">
                <Link href="/" className="logo">
                    <img
                        src="/assets/salonbeautecarmenwhite.svg"
                        alt="Salon Beauté Arias"
                    />
                </Link>
                <ul className="nav-menu">
                    <li>
                        <Link href="/" className={pathname === "/" ? "active" : ""}>
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link href="/nous" className={pathname === "/nous" ? "active" : ""}>
                            Nous
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" className={pathname === "/services" ? "active" : ""}>
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link href="/emplacement" className={pathname === "/emplacement" ? "active" : ""}>
                            Emplacement
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
