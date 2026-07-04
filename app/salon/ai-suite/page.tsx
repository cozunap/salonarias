"use client";

import { useState } from "react";
import { Sparkles, Copy, Mail, Instagram, AlignLeft, Loader2, Check } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type GenerationType = 'social' | 'email' | 'service';

export default function AISuite() {
    const [prompt, setPrompt] = useState("");
    const [type, setType] = useState<GenerationType>('social');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");
        setResult("");

        try {
            // Priority: NEXT_PUBLIC_GEMINI_API_KEY (for client-side) then GEMINI_API_KEY
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            
            if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
                throw new Error("Configuration requise : La clé API Gemini est manquante. Assurez-vous que NEXT_PUBLIC_GEMINI_API_KEY est configurée dans vos variables d'environnement.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            // Use 1.5-flash for speed and reliability in a salon context
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemPrompts = {
                social: "Tu es un expert en marketing pour les salons de coiffure de luxe. Rédige une publication Instagram captivante. Inclus : une accroche forte, le corps du message avec des emojis élégants, et une liste de hashtags pertinents en français. Le ton doit être professionnel, chaleureux et haut de gamme.",
                email: "Tu es un expert en communication client pour les salons de beauté. Rédige un email professionnel. Inclus : un objet percutant, une salutation chaleureuse, le corps du message structuré, et un appel à l'action (CTA) clair. Le texte doit être en français impeccable.",
                service: "Tu es un rédacteur spécialisé dans le domaine de la beauté et du luxe. Rédige une description de service pour un site web. Inclus : les bénéfices principaux, l'expérience client et pourquoi choisir ce service. Ton style doit être invitant et sophistiqué, en français."
            };

            const fullPrompt = `${systemPrompts[type]}\n\nVoici les instructions spécifiques du client :\n${prompt}`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error("L'IA n'a pas pu générer de contenu. Veuillez essayer avec une description plus détaillée.");
            }

            setResult(text);
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            let userMessage = "Une erreur s'est produite lors de la génération.";
            
            if (err.message?.includes("API_KEY_INVALID")) {
                userMessage = "La clé API configurée est invalide. Veuillez vérifier votre configuration Google AI Studio.";
            } else if (err.message?.includes("QUOTA_EXCEEDED")) {
                userMessage = "Quota d'utilisation dépassé. Veuillez réessayer dans quelques instants.";
            } else if (err.message) {
                userMessage = err.message;
            }
            
            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="py-2 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="text-zinc-900" size={24} />
                        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">AI Suite</h1>
                    </div>
                    <p className="text-[14px] text-zinc-500">
                        Votre assistant marketing intelligent propulsé par Google Gemini. Générez du contenu professionnel en quelques secondes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Input Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="admin-card p-6">
                        <form onSubmit={handleGenerate} className="space-y-6">

                            <div>
                                <label className="block text-[13px] font-medium text-zinc-900 mb-3">Type de contenu</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setType('social')}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 text-[12px] font-medium rounded-lg border transition-all ${type === 'social' ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}`}
                                    >
                                        <Instagram size={20} className={type === 'social' ? 'text-white' : 'text-zinc-400'} />
                                        Réseaux Sociaux
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('email')}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 text-[12px] font-medium rounded-lg border transition-all ${type === 'email' ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}`}
                                    >
                                        <Mail size={20} className={type === 'email' ? 'text-white' : 'text-zinc-400'} />
                                        Email Promo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('service')}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 text-[12px] font-medium rounded-lg border transition-all ${type === 'service' ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}`}
                                    >
                                        <AlignLeft size={20} className={type === 'service' ? 'text-white' : 'text-zinc-400'} />
                                        Service Web
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-zinc-900 mb-2">Sujet ou instruction</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={
                                        type === 'social' ? "Ex: Annonce de notre nouvelle promotion sur les mèches balayage (-20% ce mois-ci)..." :
                                            type === 'email' ? "Ex: Email de remerciement pour les clients VIP avec une offre spéciale..." :
                                                "Ex: Description pour notre nouveau service de traitement à la kératine brésilienne..."
                                    }
                                    className="admin-input w-full resize-none text-[13px]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-6 py-3 text-[14px] font-semibold rounded-lg hover:from-zinc-800 hover:to-zinc-700 disabled:opacity-50 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {loading ? "Génération en cours..." : "Générer le contenu"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Output Panel */}
                <div className="lg:col-span-7">
                    <div className="admin-card h-full flex flex-col min-h-[400px]">
                        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <h2 className="text-[14px] font-semibold text-zinc-900">Résultat Généré</h2>
                            {result && (
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                                >
                                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                    {copied ? <span className="text-emerald-600">Copié!</span> : "Copier"}
                                </button>
                            )}
                        </div>

                        <div className="p-6 flex-1 bg-white rounded-b-xl relative">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                    <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-zinc-900 animate-spin mb-4"></div>
                                    <p className="text-[14px] font-medium text-zinc-600 animate-pulse">L'IA rédige votre texte...</p>
                                </div>
                            ) : error ? (
                                <div className="h-full flex items-center justify-center text-center">
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-[13px] border border-red-100">
                                        <strong>Erreur:</strong><br />{error}
                                    </div>
                                </div>
                            ) : result ? (
                                <div className="prose prose-sm max-w-none text-zinc-800" style={{ whiteSpace: 'pre-wrap' }}>
                                    {result}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400">
                                    <Sparkles size={48} className="mb-4 opacity-20" />
                                    <p className="text-[14px]">Votre contenu généré apparaîtra ici.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
