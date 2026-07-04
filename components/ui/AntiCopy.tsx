"use client";

import { useEffect, useState } from "react";

export default function AntiCopy() {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            // Allow context menu on input/textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            e.preventDefault();
            setIsActive(true);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.keyCode === 123) {
                e.preventDefault();
            }
            // Block Ctrl+U / Cmd+U
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (!isActive) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 cursor-pointer animate-in fade-in duration-300"
            onClick={() => setIsActive(false)}
        >
            <div
                className="text-white text-[15px] md:text-[16px] font-normal uppercase tracking-widest text-center flex flex-col md:flex-row items-center gap-2 md:gap-4 animate-in zoom-in-95 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <span>Designed by</span>
                <a
                    href="https://cozuna.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                    onClick={() => setIsActive(false)}
                >
                    cozuna.com
                </a>
            </div>
        </div>
    );
}
