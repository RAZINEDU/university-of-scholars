"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  Moon, 
  Sun, 
  FileText, 
  UserCheck, 
  Building2, 
  Layers, 
  Sparkles,
  User,
  GraduationCap
} from "lucide-react";
import { PdfModal } from "./PdfModal";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDay(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Layers },
    { href: "/section", label: "Section Routine", icon: Calendar },
    { href: "/today", label: "Today's Routine", icon: Sparkles, badge: true },
    { href: "/retake", label: "Retake & Custom", icon: GraduationCap },
    { href: "/teacher", label: "Teacher Schedule", icon: UserCheck },
    { href: "/room", label: "Room Availability", icon: Building2 },
    { href: "/author", label: "Author", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/90 dark:bg-[#0B1120]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm print:hidden">
      
      {/* Top Gradient Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Row 1: Brand & Actions */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-1 flex items-center justify-center shadow-md shadow-slate-900/5 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="IUS Logo" className="h-full w-full object-contain" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  University of Scholars
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  CSE • Fall 2026
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs">
                  Routine Engine
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Computer Science Dept
                </span>
              </div>
            </div>
          </Link>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Live Clock Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span className="font-mono font-bold">{time || "00:00:00"}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentDay}</span>
            </div>

            {/* View Official PDF Button */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all shadow-sm active:scale-95"
              title="View & Download Official Routine PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-xs">Official PDF</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Navigation Bar on 2nd Line (No side scroll needed) */}
        <div className="py-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center">
          <nav className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Official PDF Modal */}
      <PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </header>
  );
};
