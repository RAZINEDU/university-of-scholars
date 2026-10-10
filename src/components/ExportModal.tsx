"use client";

import React from "react";
import { RoutineItem } from "@/types/routine";
import { X, Printer, Download, FileJson, FileText, Check } from "lucide-react";

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
  selectedSection
}) => {
  if (!isOpen) return null;

  const filtered = selectedSection === "ALL"
    ? routineData
    : routineData.filter((item) => item.section === selectedSection);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IUS_CSE_Routine_${selectedSection.replace(/\s+/g, '_')}_Fall_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in print:hidden">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Export & Print Routine
            </h3>
            <p className="text-xs text-slate-500">
              Selected target: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{selectedSection}</span> ({filtered.length} classes)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Print Routine / Save as PDF
                </h4>
                <p className="text-xs text-slate-500">
                  Formatted high-res print document for noticeboards or personal printouts
                </p>
              </div>
            </div>
            <Printer className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </button>

          <button
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Download JSON Dataset
                </h4>
                <p className="text-xs text-slate-500">
                  Export structured data format for calendar sync or custom app integration
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </button>

        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
