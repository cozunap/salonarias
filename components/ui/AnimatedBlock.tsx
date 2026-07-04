"use client";

import { motion, Variants } from "framer-motion";

interface AnimatedBlockProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right" | "none";
    delay?: number;
    duration?: number;
    className?: string;
}

export default function AnimatedBlock({
    children,
    direction = "up",
    delay = 0,
    duration = 0.6,
    className = "",
}: AnimatedBlockProps) {
    const fadeVariants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
            scale: direction === "none" ? 0.95 : 1,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out curve
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
