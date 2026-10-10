"use client";

import React, { useEffect } from "react";
import { X, Download, FileText, ExternalLink, RefreshCw } from "lucide-react";

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pdfPath = "/CSE Final Draft Routine (Fall_2026).pdf";

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header Bar */}
        <div className="p-3.5 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-100 text-sm truncate">
                CSE Final Draft Routine (Fall 2026).pdf
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                Official Document • International University of Scholars (IUS)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Open in New Tab Button */}
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 font-bold text-xs border border-slate-700 transition-all shadow-sm"
              title="Open PDF in Full Browser Window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </a>

            {/* Download PDF Button */}
            <a
              href={pdfPath}
              download="CSE Final Draft Routine (Fall_2026).pdf"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 border border-indigo-500/30"
              title="Download PDF File to Device"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors ml-1"
              title="Close Modal (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-950 p-1 sm:p-2 relative flex flex-col min-h-0">
          <object
            data={`${pdfPath}#toolbar=1&navpanes=1`}
            type="application/pdf"
            className="w-full h-full rounded-xl border border-slate-800/80 bg-slate-900"
          >
            {/* Fallback if browser PDF plugin is disabled */}
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 text-slate-300 rounded-xl space-y-4">
              <FileText className="w-12 h-12 text-indigo-400 animate-bounce" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-base mb-1">
                  Preview Unavailable in Embed Reader
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Your browser settings don't support embedded PDF view. Click below to view or download directly.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Open PDF in New Tab
                  </a>
                  <a
                    href={pdfPath}
                    download
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </object>
        </div>

      </div>
    </div>
  );
};
