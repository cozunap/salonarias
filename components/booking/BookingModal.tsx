"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Calendar } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ModernDatePicker from "@/components/ui/ModernDatePicker";

export default function BookingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [calendarUrl, setCalendarUrl] = useState("");
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        service: "",
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const q = query(
                    collection(db, "services"),
                    where("active", "==", true),
                    orderBy("sort_order", "asc")
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => doc.data());
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();

        const handleOpen = (e: Event) => {
            const custom = e as CustomEvent;
            if (custom.detail?.service) {
                setFormData(prev => ({ ...prev, service: custom.detail.service }));
            }
            setIsOpen(true);
        };
        window.addEventListener('open-booking', handleOpen as EventListener);

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('open-booking', handleOpen as EventListener);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Firebase
            try {
                await addDoc(collection(db, "bookings"), {
                    service: formData.service,
                    client_name: formData.name,
                    client_email: formData.email,
                    client_phone: formData.phone,
                    booking_date: formData.date,
                    booking_time: formData.time,
                    status: "pending",
                    created_at: serverTimestamp()
                });
            } catch (dbError: any) {
                console.warn("Firebase booking error:", dbError.message);
            }

            // 2. Call email API (via Google Apps Script directly from client)
            const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

            if (googleScriptUrl) {
                // Determine language for subject and sender name
                const getLang = () => {
                    const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
                    if (cookie) {
                        const parts = cookie.split('=')[1].split('/');
                        return parts[parts.length - 1] || 'fr';
                    }
                    return navigator.language.slice(0, 2).toLowerCase();
                };

                const lang = getLang();
                let subjectPrefix = "Nouvelle Réservation Web: ";
                let senderName = "Nouvelle Réservation de Services";

                if (lang === 'es') {
                    subjectPrefix = "Nueva Reserva Web: ";
                    senderName = "Nueva Reserva de Servicios";
                } else if (lang === 'en') {
                    subjectPrefix = "New Web Booking: ";
                    senderName = "New Service Booking";
                }

                const queryParams = new URLSearchParams();
                queryParams.append("Service", formData.service);
                queryParams.append("Nom", formData.name);
                queryParams.append("email", formData.email);
                queryParams.append("Téléphone", formData.phone);
                queryParams.append("Date", formData.date || "Non spécifiée");
                queryParams.append("Heure", formData.time || "Non spécifiée");
                queryParams.append("subject", `${subjectPrefix}${formData.service}`);
                queryParams.append("sender_name", senderName);

                // Envoi décorrélé pour ne pas bloquer l'UI si le script met du temps
                fetch(googleScriptUrl, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: queryParams.toString(),
                }).catch(e => console.warn("Background email notification error:", e));
            }

            setSuccess(true);

            // Auto-redirect after 3 seconds
            setTimeout(() => {
                handleClose();
                router.push('/services');
            }, 3000);

        } catch (err: any) {
            console.error("Booking error:", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSuccess(false);
        setCalendarUrl("");
        setFormData({ service: "", name: "", email: "", phone: "", date: "", time: "" });
    };

    // Always render to ensure the event listener is stable
    return (
        <div
            id="appointmentModal"
            className={`modal ${isOpen ? "active" : ""}`}
            onClick={handleClose}
            style={{ display: isOpen ? "flex" : "none" }}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={handleClose}>&times;</button>

                {success ? (
                    <div className="success-content" style={{ textAlign: "center", padding: "20px 0" }}>
                        <CheckCircle size={56} style={{ margin: "0 auto 20px", color: "#3e302b" }} />
                        <h3 className="modal-title">Demande Envoyée!</h3>
                        <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.6", marginBottom: "25px", fontFamily: "'Montserrat', sans-serif" }}>
                            Merci <strong>{formData.name}</strong>! Votre demande por le service <strong>{formData.service}</strong> a été reçue. Nous vous contacterons bientôt para confirmer su rendez-vous.
                        </p>
                        <button onClick={handleClose} className="btn-close-final">Fermer</button>
                    </div>
                ) : (
                    <>
                        <h3 className="modal-title">DEMANDE DE RENDEZ-VOUS</h3>
                        <div className="appointment-form">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="service-input">Service Sélectionné</label>
                                    <select
                                        id="service-input"
                                        required
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    >
                                        <option value="">Sélectionnez un service...</option>
                                        {categories.map((cat, idx) => (
                                            <optgroup key={idx} label={cat.name}>
                                                {cat.items?.map((item: string, i: number) => (
                                                    <option key={i} value={item}>{item}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row" style={{ display: "flex", gap: "20px" }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label htmlFor="client-date">Date Souhaitée</label>
                                        <div style={{ position: "relative" }}>
                                            <ModernDatePicker
                                                date={formData.date}
                                                onChange={(date) => setFormData({ ...formData, date })}
                                            />
                                            {/* Hidden input to ensure HTML5 required validation still works */}
                                            <input
                                                type="text"
                                                required
                                                value={formData.date}
                                                onChange={() => { }}
                                                style={{ opacity: 0, position: "absolute", bottom: 0, left: 0, height: 1, width: 1, padding: 0, border: 0 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label htmlFor="client-time">Heure Souhaitée</label>
                                        <input
                                            id="client-time"
                                            type="time" required
                                            value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client-name">Nom complet</label>
                                    <input
                                        id="client-name"
                                        type="text" required placeholder="Saisissez votre nom"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client-email">Courriel</label>
                                    <input
                                        id="client-email"
                                        type="email" required placeholder="Saisissez votre courriel"
                                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client-phone">Téléphone</label>
                                    <input
                                        id="client-phone"
                                        type="tel" required placeholder="Ex: 514-000-0000"
                                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading ? "Envoi en cours..." : "ENVOYER LA DEMANDE"}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
