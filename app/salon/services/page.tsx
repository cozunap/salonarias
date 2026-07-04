"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import Image from "next/image";

type Service = {
    id: string;
    name: string;
    items: string[];
    image: string | null;
    sort_order: number;
};

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form State
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Service>({
        id: "",
        name: "",
        items: [""],
        image: null,
        sort_order: 0,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "services"), orderBy("sort_order", "asc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setServices(data);
        } catch (err: any) {
            console.error("Error fetching services:", err);
            setError("Failed to load services. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({ ...service });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingService(null);
        setFormData({
            id: "new",
            name: "",
            items: [""],
            image: "",
            sort_order: services.length + 1,
        });
        setIsModalOpen(true);
    };

    // New state to hold selected file for upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert("Name is required.");

        // Clean up empty items
        const cleanedItems = formData.items.filter(item => item.trim() !== "");

        try {
            setIsSaving(true);
            let imageUrl = formData.image || null;
            // If a new file is selected, upload it to Firebase Storage
            if (selectedFile) {
                const fileName = `${Date.now()}_${selectedFile.name}`;
                const storageRef = ref(storage, `services/${fileName}`);
                await uploadBytes(storageRef, selectedFile, { cacheControl: 'public, max-age=3600' });
                imageUrl = await getDownloadURL(storageRef);
            }

            const payload = {
                name: formData.name,
                items: cleanedItems,
                image: imageUrl,
                sort_order: formData.sort_order,
            };

            if (editingService && editingService.id !== "new") {
                // Update existing service
                await updateDoc(doc(db, "services", editingService.id), payload);
            } else {
                // Insert new service
                await addDoc(collection(db, "services"), payload);
            }

            setIsModalOpen(false);
            // Reset selected file state
            setSelectedFile(null);
            fetchServices(); // Refresh list
        } catch (err: any) {
            console.error("Error saving:", err);
            alert("Failed to save service: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

        try {
            await deleteDoc(doc(db, "services", id));

            setServices(services.filter(s => s.id !== id));
            // Optional: Toast success
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Failed to delete service.");
        }
    };

    return (
        <div className="py-2">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Services</h1>
                    <p className="mt-1 text-[14px] text-zinc-500">
                        Manage your salon services, descriptions, and display order.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 transition-colors px-4 py-2 rounded-lg text-[14px] font-medium flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                >
                    <Plus size={16} />
                    Add Service
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#E5E5E5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FBFBFB] border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                            <th className="px-6 py-3.5 w-12"></th>
                            <th className="px-6 py-3.5">Image</th>
                            <th className="px-6 py-3.5">Category Name</th>
                            <th className="px-6 py-3.5 w-1/3">Included Items</th>
                            <th className="px-6 py-3.5 text-center">Order</th>
                            <th className="px-6 py-3.5 text-right w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5] text-[14px]">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-zinc-400">
                                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-zinc-300" />
                                    Loading services...
                                </td>
                            </tr>
                        ) : services.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                    No services found. Click "Add Service" to get started.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id} className="hover:bg-zinc-50/80 transition-colors group bg-white">
                                    <td className="px-6 py-4 text-zinc-300 group-hover:text-zinc-400 cursor-grab active:cursor-grabbing">
                                        <GripVertical size={18} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {service.image ? (
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-[#E5E5E5]">
                                                <Image
                                                    src={service.image}
                                                    alt={service.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-zinc-50 border border-[#E5E5E5] flex items-center justify-center text-zinc-300">
                                                <ImageIcon size={18} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">
                                        {service.name}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 truncate max-w-[200px]">
                                        {service.items?.join(", ")}
                                    </td>
                                    <td className="px-6 py-4 text-center text-zinc-500">
                                        {service.sort_order}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-md transition-colors"
                                                title="Edit Service"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id, service.name)}
                                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Service"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Editing Modal Premium */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-[#FBFBFB]">
                            <h2 className="text-[16px] font-semibold text-zinc-900">
                                {editingService ? "Edit Service" : "Add New Service"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-md hover:bg-zinc-200/50 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                            {/* Form Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <form id="service-form" onSubmit={handleSave} className="space-y-6">
                                    {/* Image Section with upload */}
                                    <div className="space-y-3">
                                        <label className="block text-[13px] font-bold text-zinc-800 uppercase tracking-wider">Image de couverture</label>
                                        <div className="flex gap-4 items-center p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                                            <div className="w-20 h-20 rounded shadow-inner bg-white border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                                                {formData.image ? (
                                                    <Image src={formData.image} alt="Aperçu" fill className="object-cover" sizes="80px" unoptimized />
                                                ) : (
                                                    <ImageIcon size={24} className="text-zinc-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {/* File input for uploading new image */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        setSelectedFile(file);
                                                    }}
                                                    className="admin-input w-full text-[13px]"
                                                />
                                                {/* Optional text input for existing image URL */}
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        value={formData.image || ""}
                                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                        placeholder="/assets/services/hair-cut.webp"
                                                        className="admin-input w-full text-[13px] pr-10"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-500 transition-colors">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 italic font-medium flex items-center gap-1.5">
                                                    <Check size={12} className="text-emerald-500" />
                                                    Choisissez un fichier ou entrez une URL d'image
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-[12px] font-bold text-zinc-900 uppercase tracking-wider">Nom de la catégorie</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="admin-input w-full"
                                                placeholder="ex: Coiffure & Style"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-[12px] font-bold text-zinc-900 uppercase tracking-wider">Ordre d'affichage</label>
                                            <input
                                                type="number"
                                                value={formData.sort_order}
                                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                                className="admin-input w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Included Items */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-lg">
                                            <span className="text-[12px] font-bold text-zinc-900 uppercase tracking-wider">Sous-services inclus</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, items: [...formData.items, ""] })}
                                                className="text-[11px] font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-md transition-all shadow-sm flex items-center gap-1.5"
                                            >
                                                <Plus size={14} /> Ajouter
                                            </button>
                                        </div>
                                        <div className="space-y-2.5 mt-2">
                                            {formData.items.map((item, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...formData.items];
                                                            newItems[index] = e.target.value;
                                                            setFormData({ ...formData, items: newItems });
                                                        }}
                                                        className="admin-input flex-1"
                                                        placeholder={`Sous-service ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (formData.items.length === 1) return;
                                                            setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
                                                        }}
                                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-white text-zinc-700 text-[13px] font-medium rounded-xl hover:bg-zinc-50 border border-zinc-200 transition-all shadow-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    form="service-form"
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-medium rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-md"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
