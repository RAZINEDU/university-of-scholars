"use client";

import React, { useState } from "react";
import { BatchGroup } from "@/types/routine";
import {
  X,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  FolderPlus,
  Tag,
  RotateCcw,
} from "lucide-react";
import { DEFAULT_BATCH_GROUPS } from "@/lib/supabaseClient";

interface BatchSectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchGroups: BatchGroup[];
  onSaveBatches: (updated: BatchGroup[]) => Promise<void>;
}

export const BatchSectionManagerModal: React.FC<BatchSectionManagerModalProps> = ({
  isOpen,
  onClose,
  batchGroups,
  onSaveBatches,
}) => {
  const [batches, setBatches] = useState<BatchGroup[]>(batchGroups);
  const [newBatchNumber, setNewBatchNumber] = useState("");
  const [newBatchSections, setNewBatchSections] = useState("");
  const [addingSectionToBatch, setAddingSectionToBatch] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync when prop updates
  React.useEffect(() => {
    setBatches(batchGroups);
  }, [batchGroups, isOpen]);

  if (!isOpen) return null;

  // Add a brand new batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const num = newBatchNumber.trim();
    if (!num) {
      setError("Please enter a batch number (e.g. 21)");
      return;
    }

    const exists = batches.some((b) => b.batch === num);
    if (exists) {
      setError(`Batch ${num} already exists!`);
      return;
    }

    // Parse initial sections
    let parsedSections: string[] = [];
    if (newBatchSections.trim()) {
      parsedSections = newBatchSections
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      parsedSections = [`Section ${num}A`, `Section ${num}B`];
    }

    const newBatch: BatchGroup = {
      batch: num,
      label: `Batch ${num}`,
      sections: parsedSections,
    };

    const updated = [...batches, newBatch].sort(
      (a, b) => parseInt(a.batch, 10) - parseInt(b.batch, 10)
    );

    setBatches(updated);
    setNewBatchNumber("");
    setNewBatchSections("");
    setSuccess(`Batch ${num} added! Remember to click "Save Changes" below.`);
  };

  // Add section to existing batch
  const handleAddSection = (batchNumber: string) => {
    if (!newSectionName.trim()) return;
    const sec = newSectionName.trim();

    setBatches((prev) =>
      prev.map((b) => {
        if (b.batch === batchNumber) {
          if (b.sections.includes(sec)) return b;
          return {
            ...b,
            sections: [...b.sections, sec].sort(),
          };
        }
        return b;
      })
    );

    setNewSectionName("");
    setAddingSectionToBatch(null);
  };

  // Remove section from batch
  const handleRemoveSection = (batchNumber: string, sectionToRemove: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.batch === batchNumber) {
          return {
            ...b,
            sections: b.sections.filter((s) => s !== sectionToRemove),
          };
        }
        return b;
      })
    );
  };

  // Delete entire batch
  const handleDeleteBatch = (batchNumber: string) => {
    if (confirm(`Are you sure you want to delete Batch ${batchNumber} and its sections?`)) {
      setBatches((prev) => prev.filter((b) => b.batch !== batchNumber));
    }
  };

  // Save all changes to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await onSaveBatches(batches);
      setIsSaving(false);
      setSuccess("All Batches & Sections saved to Supabase successfully!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || "Failed to save batches to Supabase");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset to default batches (Batch 13 - Batch 20)?")) {
      setBatches(DEFAULT_BATCH_GROUPS);
      setSuccess("Reset to default batches. Click 'Save Changes' to apply.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Manage Batches & Sections</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add new batches for new semesters, define sections, and manage section groups
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form to Add a New Batch */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-indigo-500" />
              <span>Add New Semester Batch</span>
            </div>

            <form onSubmit={handleCreateBatch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21"
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Sections (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Section 21A, Section 21B, Section 21C"
                  value={newBatchSections}
                  onChange={(e) => setNewBatchSections(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Batch</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Batches List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>All Active Batches ({batches.length})</span>
              <button
                onClick={handleResetDefaults}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {batches.map((b) => (
                <div
                  key={b.batch}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {b.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                        {b.sections.length} sections
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBatch(b.batch)}
                      title="Delete entire batch"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                    {b.sections.map((sec) => (
                      <span
                        key={sec}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] border border-slate-200/60 dark:border-slate-700"
                      >
                        <span>{sec}</span>
                        <button
                          onClick={() => handleRemoveSection(b.batch, sec)}
                          title="Remove section"
                          className="hover:text-rose-500 p-0.5 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}

                    {/* Inline Add Section Form */}
                    {addingSectionToBatch === b.batch ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          placeholder={`Section ${b.batch}X`}
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSection(b.batch);
                            }
                            if (e.key === "Escape") setAddingSectionToBatch(null);
                          }}
                          className="w-28 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-indigo-400 text-[11px] font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddSection(b.batch)}
                          className="p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setAddingSectionToBatch(null)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingSectionToBatch(b.batch);
                          setNewSectionName(`Section ${b.batch}`);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-indigo-300 dark:border-indigo-700/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Section</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Changes will automatically update routine filters on the live website.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving to Supabase..." : "Save Changes to Supabase"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
