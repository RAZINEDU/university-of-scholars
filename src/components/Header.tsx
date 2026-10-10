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
  Search, 
  UserCheck, 
  Building2, 
  Layers, 
  Sparkles,
  Download,
  AlertTriangle
} from "lucide-react";
import { PdfModal } from "./PdfModal";

interface HeaderProps {
  totalClasses?: number;
}

export const Header: React.FC<HeaderProps> = ({ totalClasses }) => {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  
  // Local state for Modals & Theme
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDay(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-auto h-12 flex items-center justify-center group-hover:scale-105 transition-transform bg-white rounded-lg px-2 py-1 shadow-sm">
              <img src="/logo.png" alt="IUS Logo" className="h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span>University of Scholars</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Fall 2026
                  </span>
                </h1>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>Department of Computer Science & Engineering (CSE)</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Official Routine Engine
                </span>
              </p>
            </div>
          </Link>

          {/* Quick Actions & Clock */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end">
            
            {/* Live Clock Widget */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{time || "00:00:00"}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500 dark:text-slate-400">{currentDay}</span>
            </div>

            {/* View Original PDF Button */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all shadow-sm"
              title="View & Download Official Routine PDF"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Official PDF</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark/Light Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Fully Touch Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none no-scrollbar sm:flex-wrap flex-nowrap border-t border-slate-200/60 dark:border-slate-800/60">
          
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/"
                ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/section"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/section"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Section Routine</span>
          </Link>

          <Link
            href="/today"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/today"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Routine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </Link>

          <Link
            href="/retake"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/retake"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Custom My-Routine & Retake Checker</span>
          </Link>

          <Link
            href="/teacher"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/teacher"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teacher Schedule</span>
          </Link>

          <Link
            href="/room"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              pathname === "/room"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Room Availability</span>
          </Link>

        </div>
      </div>

      <PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </header>
  );
};
