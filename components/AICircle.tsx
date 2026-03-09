"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AICircleProps {
    className?: string;
    size?: number;
    color?: string;
    active?: boolean;
}

export default function AICircle({
    className,
    size = 100,
    color = "#6366f1",
    active = true
}: AICircleProps) {
    return (
        <div
            className={`relative flex items-center justify-center transition-all duration-700 ${className}`}
            style={{ width: size, height: size }}
        >
            <AnimatePresence>
                {active && (
                    <>
                        {/* Outer rotating ring with segments */}
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, rotate: 360 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.5 }
                            }}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                stroke={color}
                                strokeWidth="0.5"
                                fill="none"
                                strokeDasharray="1 10"
                                opacity="0.2"
                            />
                        </motion.svg>

                        {/* Secondary counter-rotating dashed ring */}
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                stroke={color}
                                strokeWidth="1"
                                fill="none"
                                strokeDasharray="20 40"
                                opacity="0.15"
                            />
                        </motion.svg>

                        {/* Scanning beam */}
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <defs>
                                <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={color} stopOpacity="0" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 50 50 L 50 2 A 48 48 0 0 1 98 50 Z"
                                fill="url(#scanGradient)"
                                opacity="0.4"
                            />
                        </motion.svg>

                        {/* Core pulsing orb */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: '25%',
                                height: '25%',
                                backgroundColor: color,
                                filter: `blur(${size / 20}px)`,
                                boxShadow: `0 0 ${size / 5}px ${color}`
                            }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Inner dots */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[0, 72, 144, 216, 288].map((angle) => (
                                <motion.div
                                    key={angle}
                                    className="absolute w-1 h-1 rounded-full"
                                    style={{
                                        backgroundColor: color,
                                        transform: `rotate(${angle}deg) translateY(-${size * 0.15}px)`
                                    }}
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: angle / 360,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Base static glow */}
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}
