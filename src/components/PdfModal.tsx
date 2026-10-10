"use client";

import React from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Official CSE Final Draft Routine (Fall 2026).pdf
              </h3>
              <p className="text-xs text-slate-500">
                International University of Scholars (IUS) • CSE Department
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/CSE Final Draft Routine (Fall_2026).pdf"
              download="CSE Final Draft Routine (Fall_2026).pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Iframe Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2">
          <iframe
            src="/CSE Final Draft Routine (Fall_2026).pdf"
            className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800"
            title="Official Routine PDF"
          />
        </div>

      </div>
    </div>
  );
};
