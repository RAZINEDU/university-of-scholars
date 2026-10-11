"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, CheckCircle2, Smartphone } from "lucide-react";

export const PwaManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Register Service Worker
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  // Monitor Online/Offline Status
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__pwaInstallPrompt = e;
      setIsInstallable(true);
      // Auto-show banner if not dismissed previously
      const dismissed = localStorage.getItem("ius_pwa_banner_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setShowInstallBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
      console.log("[PWA] App successfully installed!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("ius_pwa_banner_dismissed", "true");
  };

  return (
    <>
      {/* ── OFFLINE STATUS NOTIFICATION ── */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl animate-bounce-subtle border border-amber-300">
          <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
          <span>Offline Mode Active • Routines Loaded from Cache</span>
        </div>
      )}

      {/* ── INSTALL SUCCESS TOAST ── */}
      {installedSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>IUS Routine App Installed Successfully!</span>
        </div>
      )}

      {/* ── INSTALL APP PROMPT BANNER ── */}
      {showInstallBanner && isInstallable && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[9998] p-4 rounded-3xl bg-slate-900/95 border border-indigo-500/40 backdrop-blur-2xl text-white shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 border border-slate-700 shadow-md">
              <img src="/icon-192.png" alt="IUS Routine App Icon" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white truncate flex items-center gap-1.5">
                <span>Install IUS Routine App</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Offline Ready</span>
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                Download to your home screen for instant offline access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/40 border border-indigo-400/40 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismissBanner}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
