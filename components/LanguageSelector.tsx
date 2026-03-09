"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSelector() {
    const [currentLang, setCurrentLang] = useState('en');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
        if (match) {
            if (match[2] === '/en/hi') setCurrentLang('hi');
            else setCurrentLang('en');
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lang: string) => {
        setCurrentLang(lang);
        const code = lang === 'hi' ? '/en/hi' : '/en/en';
        document.cookie = `googtrans=${code}; path=/`;
        document.cookie = `googtrans=${code}; domain=${window.location.hostname}; path=/`;
        window.location.reload();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className={`text-sm font-semibold h-10 px-3 sm:px-4 flex items-center gap-2 transition-all rounded-full ${isOpen ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white shadow-lg'}`}
            >
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {currentLang === 'en' ? 'Language' : 'भाषा'}
                </span>
            </Button>

            {isOpen && (
                <div className="absolute top-12 right-0 mt-2 w-36 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={() => { changeLanguage('en'); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-800 flex items-center gap-3 ${currentLang === 'en' ? 'text-indigo-400 font-bold bg-indigo-500/5' : 'text-slate-300'}`}
                    >
                        <span className="text-lg">🇬🇧</span> English
                    </button>
                    <button
                        onClick={() => { changeLanguage('hi'); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-800 flex items-center gap-3 border-t border-slate-800 ${currentLang === 'hi' ? 'text-indigo-400 font-bold bg-indigo-500/5' : 'text-slate-300'}`}
                    >
                        <span className="text-lg">🇮🇳</span> हिंदी
                    </button>
                </div>
            )}
        </div>
    );
}
