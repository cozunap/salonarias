"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Scissors,
    CalendarDays,
    Settings,
    LogOut,
    Sparkles,
    Command,
    MonitorPlay
} from "lucide-react";
import clsx from "clsx";
import "./admin.css"; // Force CSS reset for the dashboard
import { GoogleAnalytics } from "@next/third-parties/google";

import LanguageDetector from "@/components/ui/LanguageDetector";

const navigation = [
    { name: "Overview", href: "/salon", icon: LayoutDashboard },
    { name: "Hero Slider", href: "/salon/hero", icon: MonitorPlay },
    { name: "Services", href: "/salon/services", icon: Scissors },
    { name: "Bookings", href: "/salon/bookings", icon: CalendarDays },
    { name: "AI Suite", href: "/salon/ai-suite", icon: Sparkles },
    { name: "Settings", href: "/salon/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Arias Admin Lounge</title>
                <link rel="icon" href="/assets/favicon.svg" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                    body { top: 0px !important; margin-top: 0px !important; }
                `}} />
            </head>
            <body className="admin-root bg-[#FAFAFA] text-[#09090b] selection:bg-black selection:text-white antialiased font-sans m-0 p-0">
                <LanguageDetector />
                <div className="min-h-screen flex">
                    {/* Minimalist Light Sidebar */}
                    <aside className="w-64 bg-[#F7F7F8] border-r border-[#E5E5E5] flex flex-col fixed h-full z-10 font-sans shadow-[2px_0_8_rgba(0,0,0,0.02)]">
                        <div className="h-16 flex items-center px-6 border-b border-[#E5E5E5]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ring-1 ring-black/10">
                                    <Command size={16} />
                                </div>
                                <span className="font-semibold text-zinc-900 tracking-tight text-[15px]">Salon Admin</span>
                            </div>
                        </div>

                        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/salon" && pathname?.startsWith(`${item.href}`));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-all group",
                                            isActive
                                                ? "bg-white text-zinc-900 shadow-sm border border-[#E5E5E5]"
                                                : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 border border-transparent"
                                        )}
                                    >
                                        <Icon
                                            size={18}
                                            className={clsx(
                                                "transition-colors",
                                                isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700"
                                            )}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-[#E5E5E5]">
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 border border-transparent transition-all w-full group text-left">
                                <LogOut size={18} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 ml-64 p-8 min-h-screen">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    );
}
