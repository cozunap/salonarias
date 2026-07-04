"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Calendar as CalendarIcon, Clock, Phone, Mail, User, Loader2 } from "lucide-react";

interface Booking {
    id: string;
    service: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    booking_date: string;
    booking_time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
}

export default function BookingsManager() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const q = query(collection(db, "bookings"), orderBy("booking_date", "desc"), orderBy("booking_time", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
        setLoading(false);
    }

    const updateStatus = async (id: string, newStatus: Booking['status']) => {
        // Optimistic update
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            await updateDoc(doc(db, "bookings", id), { status: newStatus });
        } catch (error) {
            console.error("Error updating booking:", error);
            // Revert on error (could refetch here too)
            alert("Erreur lors de la mise à jour du statut.");
            fetchBookings();
        }
    };

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'confirmed':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Confirmé</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">Annulé</span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">En attente</span>;
        }
    };

    const formatDateTime = (dateStr: string, timeStr: string) => {
        try {
            const date = new Date(dateStr);
            const formattedDate = format(date, "d MMMM yyyy", { locale: fr });
            return `${formattedDate} à ${timeStr}`;
        } catch (e) {
            return `${dateStr} ${timeStr}`;
        }
    };

    return (
        <div className="py-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Réservations</h1>
                    <p className="mt-1 text-[14px] text-zinc-500">
                        Gérez les demandes de rendez-vous reçues depuis le site web.
                    </p>
                </div>
                <div className="flex gap-2">
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#E5E5E5] overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mb-4" />
                        <p className="text-[14px] font-medium">Chargement des réservations...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <CalendarIcon className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                        <h3 className="text-[14px] font-medium text-zinc-900 mb-1">Aucune réservation pour le moment</h3>
                        <p className="text-[13px] text-zinc-500">Les demandes de vos clients apparaîtront ici.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FBFBFB] border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                                <th className="px-6 py-3.5">Client</th>
                                <th className="px-6 py-3.5">Contact</th>
                                <th className="px-6 py-3.5">Service</th>
                                <th className="px-6 py-3.5">Date & Heure</th>
                                <th className="px-6 py-3.5">Statut</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] text-[14px]">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-zinc-50/80 transition-colors group bg-white">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                                                <User size={14} />
                                            </div>
                                            <div className="font-medium text-[14px] text-zinc-900">{booking.client_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-[12px] text-zinc-600">
                                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                                <Mail size={12} className="text-zinc-400" />
                                                <a href={`mailto:${booking.client_email}`}>{booking.client_email}</a>
                                            </div>
                                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                                <Phone size={12} className="text-zinc-400" />
                                                <a href={`tel:${booking.client_phone}`}>{booking.client_phone}</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[13px] font-medium text-zinc-900">{booking.service}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-[13px] text-zinc-700">
                                            <CalendarIcon size={14} className="text-zinc-400" />
                                            {formatDateTime(booking.booking_date, booking.booking_time)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {booking.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                    title="Confirmer la réservation"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Annuler la réservation"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
