import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SakuraBackground } from "@/components/SakuraBackground";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "IUS Routine Portal | Fall 2026 - International University of Scholars",
  description: "Official Automatic Class Routine Checker System for Department of Computer Science & Engineering (CSE), International University of Scholars (IUS), Fall 2026.",
  keywords: ["IUS", "International University of Scholars", "CSE Routine", "Fall 2026 Routine", "IUS Routine Checker", "University of Scholars Routine"],
  authors: [{ name: "IUS CSE Department" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-amber-400 selection:text-slate-900 bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden">
        
        {/* ── GLOBAL SITE BACKGROUND ── */}
        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
          <img 
            src="/building-sketch.jpg" 
            alt="IUS Building Sketch Background" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40 dark:invert mix-blend-multiply dark:mix-blend-screen scale-105"
          />
          {/* Gradients to fade edges and maintain readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white dark:from-[#0B1120]/60 dark:via-[#0B1120]/80 dark:to-[#0B1120]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/50 to-white dark:via-[#0B1120]/60 dark:to-[#0B1120]" />
        </div>
        
        {/* ── SAKURA ANIMATION OVERLAY ── */}
        <SakuraBackground />

        <div className="relative z-10 flex-1 flex flex-col w-full">
          <Header />
          <main className="flex-1 max-w-[1700px] mx-auto w-full px-3 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <div className="print:hidden">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
