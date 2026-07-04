"use client";

import * as React from "react";
import { format, startOfDay } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, ChevronProps } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Default styles, custom overrides applied inline

interface ModernDatePickerProps {
    date: string; // YYYY-MM-DD
    onChange: (date: string) => void;
}

export default function ModernDatePicker({ date, onChange }: ModernDatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Parse the date safely to avoid timezone shifts
    const selectedDate = date ? startOfDay(new Date(`${date}T12:00:00`)) : undefined;

    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            const formatted = format(newDate, "yyyy-MM-dd");
            onChange(formatted);
            setIsOpen(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setIsOpen(false);
    };

    const handleToday = (e: React.MouseEvent) => {
        e.stopPropagation();
        const today = new Date();
        const formatted = format(today, "yyyy-MM-dd");
        onChange(formatted);
        setIsOpen(false);
    };

    // Close on click outside
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="modern-date-picker-container" ref={containerRef} style={{ position: "relative", width: "100%" }}>
            <div
                className="date-input-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    fontFamily: "var(--font-raleway)",
                    fontSize: "14px",
                    color: selectedDate ? "#333" : "#888",
                    height: "46px",
                    boxSizing: "border-box"
                }}
            >
                <span>{selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date..."}</span>
                <CalendarIcon size={18} color="#888" />
            </div>

            {isOpen && (
                <div
                    className="date-picker-popover"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        padding: "15px",
                        border: "1px solid #eee",
                        minWidth: "320px",
                        animation: "fadeInDownward 0.2s ease-out"
                    }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .rdp {
                            --rdp-cell-size: 40px;
                            --rdp-accent-color: #1a73e8; /* Default modern blue */
                            --rdp-background-color: #f0f4f8;
                            margin: 0;
                            font-family: inherit;
                        }
                        .rdp-day_selected, 
                        .rdp-day_selected:focus-visible, 
                        .rdp-day_selected:hover {
                            background-color: #1a73e8;
                            color: white;
                            font-weight: 600;
                        }
                        .rdp-day_today {
                            font-weight: 700;
                            color: #1a73e8;
                        }
                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                            background-color: #f1f3f4;
                        }
                        .rdp-head_cell {
                            font-size: 13px;
                            font-weight: 600;
                            color: #5f6368;
                            text-transform: uppercase;
                        }
                        .rdp-caption_label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #202124;
                        }
                        .rdp-day {
                            color: #111;
                        }
                        .rdp-day_disabled {
                            color: #ccc;
                        }
                        .rdp-weekday {
                            color: #5f6368;
                            font-size: 13px;
                            font-weight: 600;
                            text-transform: uppercase;
                        }
                        .rdp-nav_button {
                            color: #5f6368;
                        }
                        .rdp-chevron {
                            fill: #5f6368;
                            color: #5f6368;
                        }
                        @keyframes fadeInDownward {
                            from { opacity: 0; transform: translateY(-5px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}} />

                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        disabled={{ before: startOfDay(new Date()) }} // Disable past dates
                        locale={fr}
                        showOutsideDays
                        fixedWeeks
                        components={{
                            Chevron: (props: ChevronProps) => {
                                if (props.orientation === "left") return <ChevronLeft size={20} strokeWidth={1.5} />;
                                return <ChevronRight size={20} strokeWidth={1.5} />;
                            }
                        }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 5px 0", borderTop: "1px solid #ebebeb", marginTop: "8px" }}>
                        <button
                            type="button"
                            onClick={handleClear}
                            style={{ background: "none", border: "none", color: "#1a73e8", fontSize: "14px", fontWeight: 500, cursor: "pointer", padding: "5px 10px", borderRadius: "4px" }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f3f4"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={handleToday}
                            style={{ background: "none", border: "none", color: "#1a73e8", fontSize: "14px", fontWeight: 500, cursor: "pointer", padding: "5px 10px", borderRadius: "4px" }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f3f4"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
