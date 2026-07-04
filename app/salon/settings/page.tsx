"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Loader2, Save } from "lucide-react";

interface SettingsMap {
    [key: string]: string;
}

export default function SettingsManager() {
    const [settings, setSettings] = useState<SettingsMap>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        const { data, error } = await supabase
            .from("settings")
            .select("key, value");

        if (error) {
            console.error("Error fetching settings:", error);
            console.error("Settings error details:", error.message, error.details, error.hint, error.code);
        } else if (data) {
            const map: SettingsMap = {};
            data.forEach((item) => {
                map[item.key] = item.value;
            });
            setSettings(map);
        }
        setLoading(false);
    }

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);

        try {
            // Upsert each setting
            const updates = Object.entries(settings).map(async ([key, value]) => {
                // If the value is a valid JSON string normally we'd format it, but here all our values are simple strings.
                // We stored them as JSON strings initially (e.g. '"514-513-2494"'), but we just need to pass them back properly formatted as JSON strings if the column is jsonb.
                // Wait, if we use text input, we will just send it as a JSON string.
                const jsonValue = JSON.stringify(value.replace(/^"|"$/g, '')); // Strip existing quotes and restrip to be safe

                const { error } = await supabase
                    .from("settings")
                    .upsert({ key, value: jsonValue }, { onConflict: 'key' });

                if (error) throw error;
            });

            await Promise.all(updates);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Erreur lors de l'enregistrement des paramètres.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mb-4" />
                <p className="text-[14px] font-medium">Chargement des paramètres...</p>
            </div>
        );
    }

    const getValue = (key: string) => {
        const val = settings[key] || "";
        return val.replace(/^"|"$/g, ''); // Remove outer quotes if they exist from jsonb encoding
    };

    return (
        <div className="py-2 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Paramètres du Site</h1>
                    <p className="mt-1 text-[14px] text-zinc-500">
                        Gérez les informations de contact, les horaires et les liens sociaux de votre site.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* Contact Information */}
                <div className="admin-card">
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h2 className="text-[15px] font-semibold text-zinc-900">Informations de Contact</h2>
                        <p className="text-[13px] text-zinc-500">Apparaît dans le pied de page et l'en-tête.</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Téléphone</label>
                            <input
                                type="text"
                                value={getValue('contact_phone')}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="admin-input w-full"
                                placeholder="514-513-2494"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Adresse E-mail</label>
                            <input
                                type="email"
                                value={getValue('contact_email')}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="admin-input w-full"
                                placeholder="info@salonbeautearias.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Adresse Postale</label>
                            <input
                                type="text"
                                value={getValue('contact_address')}
                                onChange={(e) => handleChange('contact_address', e.target.value)}
                                className="admin-input w-full"
                                placeholder="235 Boulevard des Laurentides, Laval, Quebec H7G 2T7"
                            />
                        </div>
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="admin-card">
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h2 className="text-[15px] font-semibold text-zinc-900">Horaires d'Ouvertures</h2>
                        <p className="text-[13px] text-zinc-500">Affiche vos heures de disponibilité.</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">En Semaine (Lundi - Vendredi)</label>
                            <input
                                type="text"
                                value={getValue('hours_weekdays')}
                                onChange={(e) => handleChange('hours_weekdays', e.target.value)}
                                className="admin-input w-full"
                                placeholder="Lundi - Vendredi: 10h - 18h"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Samedi</label>
                            <input
                                type="text"
                                value={getValue('hours_saturday')}
                                onChange={(e) => handleChange('hours_saturday', e.target.value)}
                                className="admin-input w-full"
                                placeholder="Samedi: 10h - 17h"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Dimanche</label>
                            <input
                                type="text"
                                value={getValue('hours_sunday')}
                                onChange={(e) => handleChange('hours_sunday', e.target.value)}
                                className="admin-input w-full"
                                placeholder="Dimanche: Nous Sommes Fermé"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="admin-card">
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h2 className="text-[15px] font-semibold text-zinc-900">Réseaux Sociaux</h2>
                        <p className="text-[13px] text-zinc-500">Liens vers vos profils sociaux.</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Facebook URL</label>
                            <input
                                type="url"
                                value={getValue('social_facebook')}
                                onChange={(e) => handleChange('social_facebook', e.target.value)}
                                className="admin-input w-full"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Instagram URL</label>
                            <input
                                type="url"
                                value={getValue('social_instagram')}
                                onChange={(e) => handleChange('social_instagram', e.target.value)}
                                className="admin-input w-full"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-2.5 text-[14px] font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Enregistrer les modifications
                    </button>
                    {saveSuccess && (
                        <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                            <Check size={14} /> Paramètres mis à jour
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
