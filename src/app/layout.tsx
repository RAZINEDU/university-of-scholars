import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SakuraBackground } from "@/components/SakuraBackground";
import { PwaManager } from "@/components/PwaManager";

export const viewport: Viewport = {
  width: 1200,
  initialScale: 0.35,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0B1120",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://iuscse.vercel.app"),
  title: "IUS CSE Class Routine & Schedule Portal | Fall 2026",
  description: "Official Interactive Routine Portal for Dept. of CSE, International University of Scholars (IUS). Section Timetables, Retake Clash Checker, Teacher Schedules & Room Availability.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IUS Routine",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "IUS",
    "International University of Scholars",
    "IUS CSE Routine",
    "CSE Fall 2026 Routine",
    "IUS Class Routine",
    "IUS Retake Clash Checker",
    "University of Scholars Routine",
    "CSE Department IUS"
  ],
  authors: [{ name: "Razin Ibn Asad", url: "https://razinibnasad.vercel.app/" }],
  creator: "Razin Ibn Asad",
  publisher: "Department of Computer Science & Engineering, International University of Scholars",
  openGraph: {
    title: "IUS CSE Class Routine & Schedule Portal | Fall 2026",
    description: "Official Interactive Class Routine & Retake Management Engine for Dept. of CSE, International University of Scholars (IUS).",
    url: "https://iuscse.vercel.app",
    siteName: "The International University of Scholars",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://iuscse.vercel.app/og-image.png",
        secureUrl: "https://iuscse.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "The International University of Scholars - CSE Class Routine & Schedule Portal Fall 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IUS CSE Class Routine & Schedule Portal | Fall 2026",
    description: "Official Interactive Class Routine & Retake Management Engine for Dept. of CSE, International University of Scholars (IUS).",
    images: ["https://iuscse.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-amber-400 selection:text-slate-900 bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col justify-between relative">
        
        {/* ── GLOBAL SITE BACKGROUND ── */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none flex items-center justify-center print:hidden">
          <img 
            src="/building-sketch.jpg" 
            alt="IUS Building Sketch Background" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40 dark:invert mix-blend-multiply dark:mix-blend-screen scale-105 pointer-events-none"
          />
          {/* Gradients to fade edges and maintain readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white dark:from-[#0B1120]/60 dark:via-[#0B1120]/80 dark:to-[#0B1120] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/50 to-white dark:via-[#0B1120]/60 dark:to-[#0B1120] pointer-events-none" />
        </div>
        
        {/* ── SAKURA ANIMATION OVERLAY ── */}
        <div className="print:hidden">
          <SakuraBackground />
        </div>

        {/* ── PWA OFFLINE & INSTALL MANAGER ── */}
        <div className="print:hidden">
          <PwaManager />
        </div>

        <div className="relative z-20 flex-1 flex flex-col justify-between w-full min-w-[1200px] print:min-w-0 print:w-full print:block">
          <Header />
          <main className="flex-1 max-w-[1700px] mx-auto w-full px-6 lg:px-8 py-6 print:p-0 print:m-0 print:max-w-none print:w-full">
            {children}
          </main>
          <div className="print:hidden mt-auto w-full">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
