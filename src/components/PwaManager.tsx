"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, WifiOff, X, CheckCircle2, Smartphone, Sparkles } from "lucide-react";

export const PwaManager: React.FC = () => {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Pre-warm and prefetch all routine pages for complete offline readiness
  const warmOfflineCache = useCallback(() => {
    const routes = ["/", "/section", "/today", "/retake", "/teacher", "/room", "/author"];
    
    // 1. Next.js router prefetch (fetches all JS chunks and data)
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch (e) {
        // ignore
      }
    });

    // 2. Fetch full HTML & assets so SW caches them
    if (typeof window !== "undefined") {
      routes.forEach((route) => {
        fetch(route, { cache: "reload" }).catch(() => {});
      });
    }
  }, [router]);

  // Register Service Worker immediately & warm cache
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service Worker registered with scope:", reg.scope);
            // Check for updates
            reg.update().catch(() => {});
            // Warm cache
            setTimeout(warmOfflineCache, 1200);
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, [warmOfflineCache]);

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

  // Global Install Handler
  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "📱 Install IUS Routine App for 100% Offline Access:\n\n" +
        "• Android / Chrome / Samsung Internet:\n" +
        "  Tap the 3 dots (⋮) menu at the top-right and select 'Install app' or 'Add to Home screen'.\n\n" +
        "• iPhone / Safari:\n" +
        "  Tap the Share button (⎙) at the bottom and select 'Add to Home Screen'.\n\n" +
        "✅ Once installed, you can open all section routines anytime even without internet/Wi-Fi!"
      );
    }
  }, [deferredPrompt]);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__pwaInstallPrompt = e;
      (window as any).__triggerPwaInstall = triggerInstall;
      setIsInstallable(true);

      const dismissed = localStorage.getItem("ius_pwa_banner_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setShowInstallBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
      console.log("[PWA] App successfully installed to Home screen!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    (window as any).__triggerPwaInstall = triggerInstall;

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [triggerInstall]);

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("ius_pwa_banner_dismissed", "true");
  };

  return (
    <>
      {/* ── OFFLINE STATUS NOTIFICATION ── */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl border-2 border-amber-300 animate-bounce-subtle">
          <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
          <span>⚡ Offline Mode Active • All Routine Data Cached & Available</span>
        </div>
      )}

      {/* ── INSTALL SUCCESS TOAST ── */}
      {installedSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>IUS Routine App Installed Successfully! Check your phone home screen.</span>
        </div>
      )}

      {/* ── BOTTOM INSTALL PROMPT BANNER ── */}
      {showInstallBanner && isInstallable && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[9998] p-4 rounded-3xl bg-slate-900/95 border-2 border-indigo-500/50 backdrop-blur-2xl text-white shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 border border-slate-700 shadow-md">
              <img src="/icon-192.png" alt="IUS Routine App Icon" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white truncate flex items-center gap-1.5">
                <span>Install IUS Routine App</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">Offline Ready</span>
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                Download to your home screen for instant offline access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={triggerInstall}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs shadow-lg shadow-indigo-600/40 border border-indigo-400/40 active:scale-95 transition-all"
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
