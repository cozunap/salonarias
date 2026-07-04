"use client";

import { useState, useEffect } from "react";
import { BarChart3, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOverview() {
    const defaultEmbedUrl = "https://lookerstudio.google.com/embed/reporting/0e61e063-b543-4532-9c52-54b83b45617d/page/rLBrF";
    const [analyticsUrl, setAnalyticsUrl] = useState("");
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [tempUrl, setTempUrl] = useState("");
    
    // Stats state
    const [stats, setStats] = useState({
        services: 0,
        bookings: 0,
        staff: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const savedUrl = localStorage.getItem("salon_analytics_url");
        if (savedUrl) {
            setAnalyticsUrl(savedUrl);
            setTempUrl(savedUrl);
        } else {
            setAnalyticsUrl(defaultEmbedUrl);
            setTempUrl(defaultEmbedUrl);
        }

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            
            // Fetch services count
            const { count: servicesCount } = await supabase
                .from('services')
                .select('*', { count: 'exact', head: true });

            // Fetch pending/confirmed bookings count
            const { count: bookingsCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true });

            setStats({
                services: servicesCount || 0,
                bookings: bookingsCount || 0,
                staff: 0 // Placeholder until staff table is implemented
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleSaveUrl = () => {
        setAnalyticsUrl(tempUrl);
        localStorage.setItem("salon_analytics_url", tempUrl);
        setIsEditingUrl(false);
    };

    return (
        <div className="py-2">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Overview</h1>
                    <p className="mt-1 text-[14px] text-zinc-500">
                        Welcome to your Salon Arias admin lounge. Manage your services, bookings, and site settings.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    <h3 className="text-[13px] font-medium text-zinc-500 mb-2">Total Services</h3>
                    <div className="flex items-baseline gap-2">
                        {loadingStats ? (
                            <Loader2 size={20} className="animate-spin text-zinc-300" />
                        ) : (
                            <p className="text-3xl font-semibold text-zinc-900 tracking-tight">{stats.services}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    <h3 className="text-[13px] font-medium text-zinc-500 mb-2">Recent Bookings</h3>
                    <div className="flex items-baseline gap-2">
                        {loadingStats ? (
                            <Loader2 size={20} className="animate-spin text-zinc-300" />
                        ) : (
                            <p className="text-3xl font-semibold text-zinc-900 tracking-tight">{stats.bookings}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    <h3 className="text-[13px] font-medium text-zinc-500 mb-2">Active Staff</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-semibold text-zinc-900 tracking-tight">{stats.staff}</p>
                    </div>
                </div>
            </div>

            {/* Analytics Module */}
            <div className="mt-8 bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                <div className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-zinc-500" />
                        <h2 className="text-[15px] font-semibold text-zinc-900">Google Analytics Traffic</h2>
                    </div>
                    {analyticsUrl && !isEditingUrl && (
                        <button
                            onClick={() => setIsEditingUrl(true)}
                            className="text-[12px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Change Source URL
                        </button>
                    )}
                </div>

                {(!analyticsUrl || isEditingUrl) ? (
                    <div className="p-8 pb-10">
                        <div className="max-w-xl mx-auto">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900">Connect Google Analytics</h3>
                                <p className="text-[14px] text-zinc-500 mt-2 leading-relaxed">
                                    Display your live website traffic directly in this dashboard using a free Looker Studio report.
                                </p>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 mb-6 text-[13px] text-zinc-600 space-y-3">
                                <p className="font-semibold text-zinc-900 flex items-center gap-1.5"><AlertCircle size={14} /> How to get your embed link:</p>
                                <ol className="list-decimal pl-4 space-y-1.5">
                                    <li>Go to <a href="https://lookerstudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Looker Studio</a> and create a blank report connected to your Google Analytics 4.</li>
                                    <li>Arrange the charts exactly how you want them.</li>
                                    <li>Click <strong>File {'>'} Embed report</strong> and check "Enable Embedding".</li>
                                    <li>Select <strong>Embed URL</strong> and copy the link provided.</li>
                                    <li>Paste that URL below.</li>
                                </ol>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-zinc-700">Looker Studio Embed URL</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon size={14} className="text-zinc-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={tempUrl}
                                            onChange={(e) => setTempUrl(e.target.value)}
                                            placeholder="https://lookerstudio.google.com/embed/reporting/..."
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-300 rounded-md text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveUrl}
                                        disabled={!tempUrl.includes("lookerstudio.google.com/embed")}
                                        className="px-4 py-2 bg-zinc-900 text-white text-[13px] font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                    >
                                        Save & Connect
                                    </button>
                                </div>
                                {tempUrl && !tempUrl.includes("lookerstudio.google.com/embed") && (
                                    <p className="text-[12px] text-red-500 mt-1">Please enter a valid Looker Studio embed URL ending in /embed/...</p>
                                )}
                            </div>

                            {isEditingUrl && analyticsUrl && (
                                <button
                                    onClick={() => setIsEditingUrl(false)}
                                    className="mt-4 text-[13px] text-zinc-500 hover:text-zinc-800 w-full text-center hover:underline"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-[600px] w-full bg-zinc-100 flex-1 relative">
                        <iframe
                            src={analyticsUrl}
                            frameBorder="0"
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
}
