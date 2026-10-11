"use client";

import React, { useState, useEffect } from "react";
import { RoutineItem } from "@/types/routine";
import { X, Printer, Download, FileJson, CheckCircle2, Sparkles } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: RoutineItem[];
  selectedSection: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  routineData,
  selectedSection,
}) => {
  const [visible, setVisible] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered =
    selectedSection === "ALL"
      ? routineData
      : routineData.filter((item) => item.section === selectedSection);

  const totalClasses = filtered.filter(
    (i) => i.type !== "Break" && i.type !== "No Class"
  ).length;
  const labCount = filtered.filter((i) => i.type === "Lab").length;
  const theoryCount = filtered.filter((i) => i.type === "Theory").length;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 350);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IUS_CSE_Routine_${selectedSection.replace(/\s+/g, "_")}_Fall_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 print:hidden"
      onClick={onClose}
      style={{
        backgroundColor: visible ? "rgba(2, 6, 23, 0.78)" : "rgba(2, 6, 23, 0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "background-color 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      {/* ── COMPACT MODAL CARD ── */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100"
        style={{
          width: "100%",
          maxWidth: "420px",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(14px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── COMPACT HEADER ── */}
        <div
          className="px-4 py-3.5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)",
          }}
        >
          {/* Subtle glow / ornament */}
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none blur-xl" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner flex-shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base tracking-tight leading-none">
                    Export & Print
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/25">
                    {selectedSection}
                  </span>
                </div>
                <p className="text-indigo-200 text-[11px] font-medium leading-none mt-1">
                  Save or download routine schedule
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── COMPACT STATS ROW (Always 3 side-by-side columns) ── */}
          <div
            className="mt-3 pt-2.5 border-t border-white/15 relative z-10"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            <div
              className="rounded-lg py-1 px-2 text-center"
              style={{ background: "rgba(255, 255, 255, 0.12)" }}
            >
              <div className="text-xs font-black text-white leading-tight">
                📚 {totalClasses}
              </div>
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                Classes
              </div>
            </div>

            <div
              className="rounded-lg py-1 px-2 text-center"
              style={{ background: "rgba(16, 185, 129, 0.22)" }}
            >
              <div className="text-xs font-black text-emerald-200 leading-tight">
                📖 {theoryCount}
              </div>
              <div className="text-[10px] font-bold text-emerald-200/80 uppercase tracking-wider">
                Theory
              </div>
            </div>

            <div
              className="rounded-lg py-1 px-2 text-center"
              style={{ background: "rgba(14, 165, 233, 0.22)" }}
            >
              <div className="text-xs font-black text-sky-200 leading-tight">
                🔬 {labCount}
              </div>
              <div className="text-[10px] font-bold text-sky-200/80 uppercase tracking-wider">
                Lab
              </div>
            </div>
          </div>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="p-4 space-y-3">
          {/* PDF Landscape Tip */}
          <div
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              borderColor: "rgba(245, 158, 11, 0.25)",
            }}
          >
            <span className="text-base leading-none mt-0.5 select-none">💡</span>
            <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
              <strong className="text-amber-200 font-bold">PDF টিপস:</strong> Print dialog-এ{" "}
              <span
                className="font-bold px-1.5 py-0.2 rounded text-[10px]"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.25)",
                  color: "#fef08a",
                }}
              >
                Layout → Landscape
              </span>{" "}
              সিলেক্ট করুন। তাহলে পুরো রুটিন ১ পেজে ফিট হবে।
            </p>
          </div>

          {/* Primary Action Button: Print / Save as PDF */}
          <button
            onClick={handlePrint}
            disabled={printing}
            className="w-full relative overflow-hidden rounded-xl p-3 flex items-center gap-3 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 text-left group cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)",
              boxShadow: "0 4px 18px rgba(99, 102, 241, 0.35)",
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-white">
              {printing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Printer className="w-5 h-5 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-white text-sm leading-tight flex items-center gap-1.5">
                {printing ? "Preparing Print…" : "Print / Save as PDF"}
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </div>
              <div className="text-indigo-100 text-[11px] font-medium leading-tight mt-0.5">
                Full-color • A4 Landscape • 1 Page Fit
              </div>
            </div>

            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.22)",
                color: "#ffffff",
              }}
            >
              ★ Best
            </span>
          </button>

          {/* Secondary Action Button: Download JSON Data */}
          <button
            onClick={handleDownloadJson}
            className="w-full rounded-xl p-3 flex items-center gap-3 transition-all duration-150 active:scale-[0.98] text-left cursor-pointer border"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderColor: "rgba(71, 85, 105, 0.5)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
            >
              {downloaded ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileJson className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-100 text-xs sm:text-sm leading-tight">
                {downloaded ? "JSON Downloaded! ✓" : "Download JSON Data"}
              </div>
              <div className="text-slate-400 text-[11px] font-medium leading-tight mt-0.5">
                Calendar sync বা developer use-এর জন্য
              </div>
            </div>

            <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
          </button>

          {/* Feature Pills */}
          <div
            className="pt-1"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            {[
              { emoji: "🗓️", text: "Sat–Fri সব দিন" },
              { emoji: "🎨", text: "Full color" },
              { emoji: "👤", text: "Teacher & Room" },
              { emoji: "📐", text: "১ পেজে ফিট" },
            ].map((chip) => (
              <span
                key={chip.text}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-slate-300"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <span>{chip.emoji}</span>
                <span>{chip.text}</span>
              </span>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
