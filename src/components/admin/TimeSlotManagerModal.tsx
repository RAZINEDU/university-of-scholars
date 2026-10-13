"use client";

import React, { useState } from "react";
import { TimeSlotConfig, PortalTimeSlots } from "@/types/routine";
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  Coffee,
  RotateCcw,
  Edit2,
} from "lucide-react";
import { DEFAULT_PORTAL_TIME_SLOTS } from "@/lib/supabaseClient";

interface TimeSlotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlots: PortalTimeSlots;
  onSaveTimeSlots: (updated: PortalTimeSlots) => Promise<void>;
}

export const TimeSlotManagerModal: React.FC<TimeSlotManagerModalProps> = ({
  isOpen,
  onClose,
  timeSlots,
  onSaveTimeSlots,
}) => {
  const [activeTab, setActiveTab] = useState<"satThu" | "friday">("satThu");
  const [currentSlots, setCurrentSlots] = useState<PortalTimeSlots>(timeSlots);

  // New column form state
  const [newLabel, setNewLabel] = useState("");
  const [newSlotString, setNewSlotString] = useState("");
  const [newIsBreak, setNewIsBreak] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    setCurrentSlots(timeSlots);
  }, [timeSlots, isOpen]);

  if (!isOpen) return null;

  const activeList = activeTab === "satThu" ? currentSlots.satThuSlots : currentSlots.fridaySlots;

  const handleUpdateItem = (
    index: number,
    field: keyof TimeSlotConfig,
    value: any
  ) => {
    const listKey = activeTab === "satThu" ? "satThuSlots" : "fridaySlots";
    const updatedList = [...currentSlots[listKey]];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };

    setCurrentSlots({
      ...currentSlots,
      [listKey]: updatedList,
    });
  };

  const handleRemoveColumn = (index: number) => {
    const listKey = activeTab === "satThu" ? "satThuSlots" : "fridaySlots";
    const updatedList = currentSlots[listKey]
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, colIndex: i + 1 }));

    setCurrentSlots({
      ...currentSlots,
      [listKey]: updatedList,
    });
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newLabel.trim()) {
      setError("Please provide a column label (e.g. 4:30 PM - 6:00 PM)");
      return;
    }

    const slotStr = newSlotString.trim() || newLabel.replace(/AM|PM/gi, "").trim();
    const listKey = activeTab === "satThu" ? "satThuSlots" : "fridaySlots";
    const nextColIndex = currentSlots[listKey].length + 1;

    const newCol: TimeSlotConfig = {
      colIndex: nextColIndex,
      label: newLabel.trim(),
      slotString: slotStr,
      isBreak: newIsBreak,
    };

    setCurrentSlots({
      ...currentSlots,
      [listKey]: [...currentSlots[listKey], newCol],
    });

    setNewLabel("");
    setNewSlotString("");
    setNewIsBreak(false);
    setSuccess("New time column added! Remember to click Save Changes.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await onSaveTimeSlots(currentSlots);
      setIsSaving(false);
      setSuccess("Time slot columns saved to Supabase successfully!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || "Failed to save time slots to Supabase");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset timetable columns to default timings?")) {
      setCurrentSlots(DEFAULT_PORTAL_TIME_SLOTS);
      setSuccess("Reset to default time slots. Click 'Save Changes' to apply.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>Timetable Columns & Time Slots Manager</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Edit timetable times, add new column periods, or configure break columns
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sat-Thu vs Friday */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-bold">
          <button
            onClick={() => setActiveTab("satThu")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "satThu"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Saturday – Thursday Timetable Columns ({currentSlots.satThuSlots.length})
          </button>
          <button
            onClick={() => setActiveTab("friday")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "friday"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Friday Timetable Columns ({currentSlots.fridaySlots.length})
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

          {/* Form to Add New Time Column */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>Add New Timetable Column to {activeTab === "satThu" ? "Sat-Thu" : "Friday"}</span>
            </div>

            <form onSubmit={handleAddColumn} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Header Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4:30 PM - 6:00 PM"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot String (compact)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 04:30-06:00"
                  value={newSlotString}
                  onChange={(e) => setNewSlotString(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newIsBreak}
                    onChange={(e) => setNewIsBreak(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                    Break Column
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Columns List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Current Columns for {activeTab === "satThu" ? "Saturday – Thursday" : "Friday"}</span>
              <button
                onClick={handleResetDefaults}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default Timings</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {activeList.map((slot, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Column {index + 1}:</span>
                        {slot.isBreak && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 flex items-center gap-1">
                            <Coffee className="w-3 h-3" /> Break
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
                    {/* Edit label */}
                    <input
                      type="text"
                      value={slot.label}
                      onChange={(e) => handleUpdateItem(index, "label", e.target.value)}
                      placeholder="Display label"
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-xs"
                    />

                    {/* Edit compact string */}
                    <input
                      type="text"
                      value={slot.slotString}
                      onChange={(e) => handleUpdateItem(index, "slotString", e.target.value)}
                      placeholder="09:30-11:00"
                      className="w-28 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white text-xs"
                    />

                    {/* Toggle Break */}
                    <label className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(slot.isBreak)}
                        onChange={(e) => handleUpdateItem(index, "isBreak", e.target.checked)}
                        className="w-3.5 h-3.5 text-amber-500 rounded"
                      />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Break</span>
                    </label>

                    {/* Delete column button */}
                    <button
                      onClick={() => handleRemoveColumn(index)}
                      title="Remove column"
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Timetable column updates will automatically synchronize across the website.
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
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
