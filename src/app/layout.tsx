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
  title: "IUS CSE Class Routine & Schedule Engine | Fall 2026",
  description: "Official Automatic Class Routine & Clash Management Portal for the Department of Computer Science & Engineering (CSE), International University of Scholars (IUS), Fall 2026. Engineered by Razin Ibn Asad.",
  keywords: [
    "IUS",
    "International University of Scholars",
    "IUS CSE Routine",
    "Fall 2026 Routine",
    "IUS Routine Checker",
    "University of Scholars Routine",
    "Computer Science and Engineering",
    "Razin Ibn Asad"
  ],
  authors: [{ name: "Razin Ibn Asad", url: "https://razinibnasad.vercel.app/" }],
  creator: "Razin Ibn Asad",
  publisher: "International University of Scholars - CSE Department",
  openGraph: {
    title: "IUS CSE Class Routine & Schedule Engine | Fall 2026",
    description: "Official Interactive Routine Engine for Department of Computer Science & Engineering (CSE), International University of Scholars (IUS). Features Section Routines, Clash Checker, Room Schedules & Teacher Workloads.",
    siteName: "International University of Scholars",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "International University of Scholars (IUS) Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IUS CSE Class Routine & Schedule Engine | Fall 2026",
    description: "Official Interactive Routine Engine for IUS Computer Science & Engineering students. Section Routines, Clash Checker, and Teacher Schedules.",
    images: ["/logo.png"],
  },
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
