"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import Image from "next/image";

interface HeroSlide {
    id: string;
    image_url: string;
    subtitle: string;
    title: string;
    button_label: string;
    button_link: string;
    button2_label?: string;
    button2_link?: string;
    sort_order: number;
    active: boolean;
}

const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
        return url.startsWith('/') || url.startsWith('http') || url.startsWith('https');
    } catch {
        return false;
    }
};

export default function HeroSliderManager() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableKey, setTableKey] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<HeroSlide>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    async function fetchSlides() {
        setLoading(true);
        try {
            const q = query(collection(db, "homepage_sliders"), orderBy("sort_order", "asc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
            setSlides(data);
        } catch (error) {
            console.error("Error fetching slides:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (slide: HeroSlide) => {
        setIsEditing(slide.id);
        setFormData(slide);
        setIsAdding(false);
    };

    const handleAddNew = () => {
        setIsAdding(true);
        setIsEditing(null);
        setFormData({
            image_url: "",
            subtitle: "",
            title: "",
            button_label: "Prendre RDV",
            button_link: "#booking",
            button2_label: "Nous trouver",
            button2_link: "https://www.google.com/maps/dir//Salon+Beaute+arias,+235+Boulevard+des+Laurentides,+Laval,+QC+H7G+2T7/@45.5664415,-73.6874937,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x4cc92204a2bf113f:0xef09dabfb3901ab7!2m2!1d-73.6874937!2d45.5664415",
            sort_order: slides.length > 0 ? slides[slides.length - 1].sort_order + 1 : 1,
            active: true
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Client-side validation for Postgres integer limits
        const orderValue = Number(formData.sort_order);
        if (isNaN(orderValue) || orderValue > 1000000 || orderValue < -1000000) {
            alert("L'ordre doit être un nombre raisonnable (entre -1,000,000 et 1,000,000).");
            return;
        }

        setIsSaving(true);

        try {
            // Include all hero fields
            const { id, ...saveData } = formData;
            
            // Ensure sort_order is a valid integer
            const finalData = {
                ...saveData,
                sort_order: orderValue || 0
            };

            if (isAdding) {
                await addDoc(collection(db, "homepage_sliders"), finalData);
            } else if (isEditing) {
                await updateDoc(doc(db, "homepage_sliders", isEditing), finalData);
            }

            // Close panels and force table refresh with new key
            setIsEditing(null);
            setIsAdding(false);
            setFormData({});
            setTableKey(prev => prev + 1);
            
            await fetchSlides();
        } catch (error) {
            console.error("Error saving slide:", error);
            alert("Erreur lors de l'enregistrement. Veuillez vérifier les champs.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "homepage_sliders", id));
            setSlides(slides.filter(s => s.id !== id));
            setConfirmDelete(null);
            setTableKey(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting slide:", error);
            alert("Erreur lors de la suppression.");
        }
    };

    const toggleActive = async (slide: HeroSlide) => {
        const newStatus = !slide.active;
        setSlides(slides.map(s => s.id === slide.id ? { ...s, active: newStatus } : s));
        try {
            await updateDoc(doc(db, "homepage_sliders", slide.id), { active: newStatus });
        } catch (error) {
            console.error("Error toggling status:", error);
            setSlides(slides.map(s => s.id === slide.id ? { ...s, active: !newStatus } : s));
        }
    };

    return (
        <div className="py-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Bannière principale (Hero)</h1>
                    <p className="mt-1 text-[14px] text-zinc-500">
                        Gérez les images et les textes du carrousel principal de votre site.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-[13px] font-medium rounded-md hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                >
                    <Plus size={16} />
                    Nouvelle diapositive
                </button>
            </div>

            <div className="flex gap-6">
                <div className={`flex-[2] transition-all duration-300 ${(isEditing || isAdding) ? 'lg:flex-[1.5]' : 'flex-1'}`}>
                    <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#E5E5E5] overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mb-4" />
                                <p className="text-[14px] font-medium">Chargement en cours...</p>
                            </div>
                        ) : slides.length === 0 ? (
                            <div className="text-center py-16">
                                <ImageIcon className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                                <h3 className="text-[14px] font-medium text-zinc-900 mb-1">Aucune diapositive</h3>
                                <p className="text-[13px] text-zinc-500">Commencez par créer une nouvelle diapositive.</p>
                            </div>
                        ) : (
                            <table key={tableKey} className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FBFBFB] border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                                        <th className="px-6 py-3.5 w-12 text-center">Ordre</th>
                                        <th className="px-6 py-3.5">Aperçu</th>
                                        <th className="px-6 py-3.5">Titre & Texte</th>
                                        <th className="px-6 py-3.5">Statut</th>
                                        <th className="px-6 py-3.5 text-right w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5] text-[14px]">
                                    {slides.map((slide) => (
                                        <tr key={slide.id} className="hover:bg-zinc-50/80 transition-colors group bg-white">
                                            <td className="px-6 py-4 text-center font-medium text-zinc-500">
                                                {slide.sort_order}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isValidUrl(slide.image_url) ? (
                                                    <div className="w-20 h-12 relative rounded border border-zinc-200 overflow-hidden bg-zinc-100">
                                                        <Image src={slide.image_url} alt="Aperçu" fill className="object-cover" sizes="80px" unoptimized />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-12 rounded border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                                                        <ImageIcon size={16} className="text-zinc-300" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[14px] text-zinc-900 line-clamp-1">
                                                    {(slide.title || "Sans titre").replace(/<br\s*\/?>/gi, ' ')}
                                                </div>
                                                <div className="text-[12px] text-zinc-500 mt-0.5 line-clamp-1">{slide.subtitle || "-"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleActive(slide)}
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold transition-colors ${slide.active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                >
                                                    {slide.active ? 'Actif' : 'Inactif'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-zinc-400">
                                                    <button
                                                        onClick={() => handleEdit(slide)}
                                                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(slide.id)}
                                                        className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Edit/Add Panel */}
                {(isEditing || isAdding) && (
                    <div className="flex-1 min-w-[380px] max-w-lg bg-white rounded-xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col sticky top-8" style={{ maxHeight: 'calc(100vh - 64px)' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
                            <h3 className="text-[15px] font-semibold text-zinc-900">
                                {isAdding ? "Nouvelle diapositive" : "Modifier la diapositive"}
                            </h3>
                            <button
                                onClick={() => { setIsEditing(null); setIsAdding(false); setFormData({}); }}
                                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="slide-form" onSubmit={handleSave} className="space-y-6">

                                {/* Image Section */}
                                <div className="space-y-3">
                                    <label className="block text-[13px] font-bold text-zinc-800 uppercase tracking-wider">Arrière-plan</label>
                                    <div className="flex gap-4 items-center p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                                        <div className="w-20 h-20 rounded shadow-inner bg-white border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                                            {isValidUrl(formData.image_url) ? (
                                                <div className="relative w-full h-full">
                                                    <Image src={formData.image_url!} alt="Aperçu" fill className="object-cover" sizes="80px" unoptimized />
                                                </div>
                                            ) : (
                                                <ImageIcon size={24} className="text-zinc-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                required
                                                value={formData.image_url || ""}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                placeholder="/assets/image.webp"
                                                className="admin-input w-full text-[13px]"
                                            />
                                            <p className="text-[11px] text-zinc-400 italic">Chemin local ou URL (ex: /assets/hair.webp)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5">Sous-titre</label>
                                            <input
                                                type="text"
                                                value={formData.subtitle || ""}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                placeholder="Petit texte au-dessus"
                                                className="admin-input w-full"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5">Ordre</label>
                                            <input
                                                type="number"
                                                value={formData.sort_order || 0}
                                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                                className="admin-input w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5">Titre principal (HTML permis)</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={formData.title || ""}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Ex: Coupes de cheveux<br/>tendance"
                                            className="admin-input w-full font-mono text-[13px] resize-none"
                                        />
                                        <p className="text-[11px] text-zinc-400 mt-1">Utilisez {"<br/>"} pour les retours à la ligne.</p>
                                    </div>
                                </div>

                                {/* Buttons Configuration */}
                                <div className="space-y-4 pt-2 border-t border-zinc-100">
                                    <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider">Bouton de gauche (Primaire)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={formData.button_label || ""}
                                            onChange={(e) => setFormData({ ...formData, button_label: e.target.value })}
                                            placeholder="Texte du bouton"
                                            className="admin-input"
                                        />
                                        <input
                                            type="text"
                                            value={formData.button_link || ""}
                                            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                            placeholder="Lien ou #booking"
                                            className="admin-input"
                                        />
                                    </div>

                                    <h4 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wider">Bouton de droite (Optionnel)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={formData.button2_label || ""}
                                            onChange={(e) => setFormData({ ...formData, button2_label: e.target.value })}
                                            placeholder="Texte (optionnel)"
                                            className="admin-input"
                                        />
                                        <input
                                            type="text"
                                            value={formData.button2_link || ""}
                                            onChange={(e) => setFormData({ ...formData, button2_link: e.target.value })}
                                            placeholder="Lien ou #booking"
                                            className="admin-input"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsEditing(null); setIsAdding(false); setFormData({}); }}
                                className="flex-1 px-4 py-2 bg-white text-zinc-700 text-[13px] font-medium rounded-md hover:bg-zinc-50 border border-zinc-300 transition-colors shadow-sm"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                form="slide-form"
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-900 text-white text-[13px] font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Enregistrer
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                                <Trash2 className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Confirmer la suppression</h3>
                            <p className="text-zinc-500 text-[14px]">
                                Êtes-vous sûr de vouloir supprimer cette diapositive ? Cette action est irréversible.
                            </p>
                        </div>
                        <div className="flex border-t border-zinc-100">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 px-6 py-4 text-[14px] font-medium text-zinc-600 hover:bg-zinc-50 transition-colors border-r border-zinc-100"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="flex-1 px-6 py-4 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
