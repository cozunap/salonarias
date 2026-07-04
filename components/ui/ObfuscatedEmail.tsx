"use client";

import { useEffect, useState } from "react";

export default function ObfuscatedEmail() {
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Obfuscate the email by building it on the client
        const user = "salonarias22";
        const domain = "gmail.com";
        setEmail(`${user}@${domain}`);
    }, []);

    if (!email) {
        return <span>Chargement...</span>;
    }

    return (
        <a href={`mailto:${email}`} className="hover:opacity-80 transition-opacity">
            {email}
        </a>
    );
}
