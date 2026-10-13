"use client";

import React, { useState, useMemo } from "react";
import { RoutineItem, BatchGroup, PortalTimeSlots, TimeSlotConfig } from "@/types/routine";
import { FacultyMember } from "@/data/teacherData";
import { RoutineModal } from "./RoutineModal";
import { BatchSectionManagerModal } from "./BatchSectionManagerModal";
import { TimeSlotManagerModal } from "./TimeSlotManagerModal";
import { RoutineAuditModal } from "./RoutineAuditModal";
import { auditSectionRoutine } from "@/lib/routineAuditor";
import {
  DEFAULT_BATCH_GROUPS,
  DEFAULT_SAT_THU_SLOTS,
  DEFAULT_FRIDAY_SLOTS,
  DEFAULT_PORTAL_TIME_SLOTS,
} from "@/lib/supabaseClient";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Coffee,
  Building2,
  CalendarOff,
  Edit2,
  Trash2,
  Copy,
  Plus,
  Sparkles,
  Grid,
  List,
  CheckCircle2,
  AlertCircle,
  Zap,
  Layers,
  Settings2,
  Lock,
  Unlock,
  X,
  AlertTriangle,
  Eye,
} from "lucide-react";

interface AdminRoutineTimetableProps {
  routineData: RoutineItem[];
  onSaveRoutine: (item: RoutineItem) => Promise<void>;
  onDeleteRoutine: (id: string) => Promise<void>;
  onDuplicateRoutine: (item: RoutineItem) => Promise<void>;
  facultyList: FacultyMember[];
  sectionsList: string[];
  isSupabaseLive: boolean;
  batchGroups?: BatchGroup[];
  portalTimeSlots?: PortalTimeSlots;
  onSaveBatches?: (batches: BatchGroup[]) => Promise<void>;
  onSaveTimeSlots?: (slots: PortalTimeSlots) => Promise<void>;
}

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Parse time helpers
const parseTime = (t: string): number => {
  if (!t) return 0;
  const isPM = /PM/i.test(t);
  const isAM = /AM/i.test(t);
  const clean = t.replace(/AM|PM/gi, "").trim();
  const parts = clean.split(":");
  let h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1] || "0", 10) || 0;

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  if (!isPM && !isAM && h < 8 && h !== 12) h += 12;
  return h + m / 60;
};

const getTimeRange = (timeSlot: string | undefined): [number, number] => {
  if (!timeSlot) return [0, 0];
  const parts = timeSlot.split("-");
  if (parts.length < 2) return [0, 0];
  return [parseTime(parts[0]), parseTime(parts[1])];
};

const getColSpan = (
  colIndex: number,
  timeSlot: string | undefined,
  slots: TimeSlotConfig[]
): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = slots.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < slots.length; k++) {
    const [sStart] = getTimeRange(slots[k].label || slots[k].slotString);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

const getFridayColSpan = (
  colIndex: number,
  timeSlot: string | undefined,
  slots: TimeSlotConfig[]
): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = slots.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < slots.length; k++) {
    const [sStart] = getTimeRange(slots[k].label || slots[k].slotString);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

const matchSatThuSlot = (
  item: RoutineItem,
  colIndex: number,
  slots: TimeSlotConfig[]
) => {
  const [start] = getTimeRange(item.timeSlot);
  const slotObj = slots.find((s) => s.colIndex === colIndex);
  if (!slotObj) return false;

  // If item has parseable start time, match by start time closeness
  if (start > 0) {
    const [slotStart] = getTimeRange(slotObj.label || slotObj.slotString);
    if (slotStart > 0 && Math.abs(start - slotStart) < 0.25) {
      return true;
    }
  }

  // Fallback to explicit colIndex
  return item.colIndex === colIndex;
};

const matchFridaySlot = (
  item: RoutineItem,
  colIndex: number,
  slots: TimeSlotConfig[]
) => {
  const [start] = getTimeRange(item.timeSlot);
  const slotObj = slots.find((s) => s.colIndex === colIndex);
  if (!slotObj) return false;

  if (start > 0) {
    const [slotStart] = getTimeRange(slotObj.label || slotObj.slotString);
    if (slotStart > 0 && Math.abs(start - slotStart) < 0.25) {
      return true;
    }
  }

  return item.colIndex === colIndex;
};

export const AdminRoutineTimetable: React.FC<AdminRoutineTimetableProps> = ({
  routineData,
  onSaveRoutine,
  onDeleteRoutine,
  onDuplicateRoutine,
  facultyList,
  sectionsList,
  isSupabaseLive,
  batchGroups = DEFAULT_BATCH_GROUPS,
  portalTimeSlots = DEFAULT_PORTAL_TIME_SLOTS,
  onSaveBatches,
  onSaveTimeSlots,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>("Section 13");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "list">("table");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<RoutineItem | null>(null);
  const [isConfirmingPreview, setIsConfirmingPreview] = useState(false);

  // Dedicated Off-Day Modal State
  const [offDayModal, setOffDayModal] = useState<{
    isOpen: boolean;
    day: string;
    item: RoutineItem | null;
    reason: string;
  } | null>(null);
  const [offDayReasonInput, setOffDayReasonInput] = useState("");
  const [isSavingOffDay, setIsSavingOffDay] = useState(false);

  // Active time slots configuration
  const activeSatThuSlots = useMemo(() => {
    return portalTimeSlots?.satThuSlots?.length ? portalTimeSlots.satThuSlots : DEFAULT_SAT_THU_SLOTS;
  }, [portalTimeSlots]);

  const activeFridaySlots = useMemo(() => {
    return portalTimeSlots?.fridaySlots?.length ? portalTimeSlots.fridaySlots : DEFAULT_FRIDAY_SLOTS;
  }, [portalTimeSlots]);

  const activeBatchGroups = useMemo(() => {
    return batchGroups?.length ? batchGroups : DEFAULT_BATCH_GROUPS;
  }, [batchGroups]);

  // Current batch sections for cross-section comparison
  const currentBatchSections = useMemo(() => {
    const bg = activeBatchGroups.find((b) => b.sections.includes(selectedSection));
    return bg ? bg.sections : [selectedSection];
  }, [activeBatchGroups, selectedSection]);

  // Automatic Routine Audit for selected section
  const sectionIssues = useMemo(() => {
    if (selectedSection === "ALL") return [];
    return auditSectionRoutine(routineData, selectedSection, currentBatchSections);
  }, [routineData, selectedSection, currentBatchSections]);

  // Extract batch helper
  const getBatchFromSection = (sec: string): string => {
    if (sec === "ALL") return "ALL";
    const m = sec.match(/Section\s*(\d+)/i);
    return m ? m[1] : "ALL";
  };

  // Confirm proposed preview item and save to Supabase
  const handleConfirmPreview = async () => {
    if (!previewItem) return;
    setIsConfirmingPreview(true);
    try {
      // Check if this day had an off-day placeholder ("No Class"), and remove it if so
      const dayOffDayItem = routineData.find(
        (c) => c.section === previewItem.section && c.day === previewItem.day && c.type === "No Class"
      );
      if (dayOffDayItem) {
        await onDeleteRoutine(dayOffDayItem.id);
      }

      // Convert preview ID into permanent ID
      const permanentItem: RoutineItem = {
        ...previewItem,
        id: `class-${previewItem.section.toLowerCase().replace(/\s+/g, "")}-${previewItem.dayShort?.toLowerCase() || "d"}-${Date.now().toString().slice(-4)}`,
      };

      await onSaveRoutine(permanentItem);
      setPreviewItem(null);
    } catch (err: any) {
      alert(err.message || "Failed to save previewed class");
    } finally {
      setIsConfirmingPreview(false);
    }
  };

  // Filtered classes (including simulated preview item if present)
  const filteredRoutine = useMemo(() => {
    let list = routineData;
    if (previewItem) {
      list = [...list, previewItem];
    }
    return list.filter((item) => {
      if (selectedSection !== "ALL" && item.section !== selectedSection) return false;
      if (selectedDayFilter !== "ALL" && item.day !== selectedDayFilter) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          item.courseCode,
          item.courseTitle,
          item.title,
          item.faculty,
          item.room,
          item.section,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }, [routineData, previewItem, selectedSection, selectedDayFilter, typeFilter, searchQuery]);

  // Section batch label
  const sectionLabel = useMemo(() => {
    if (selectedSection === "ALL") return "All Sections";
    const match = selectedSection.match(/Section\s*(\d+)([A-Z]?)/i);
    if (match) {
      return `Batch: ${match[1]}${match[2] ? `\nSection: ${match[2]}` : ""}`;
    }
    return selectedSection;
  }, [selectedSection]);

  // Quick "+ Add Class" for an empty slot
  const handleAddSlotClass = (day: string, timeSlot: string, colIndex: number) => {
    const newItem: Partial<RoutineItem> = {
      id: `class-${Date.now()}`,
      section: selectedSection === "ALL" ? "Section 13" : selectedSection,
      day,
      dayShort: day.substring(0, 3),
      colIndex,
      timeSlot,
      type: "Theory",
      courseCode: "",
      courseTitle: "",
      faculty: "",
      room: "",
    };
    setEditingItem(newItem as RoutineItem);
    setIsModalOpen(true);
  };

  // Open Dedicated Off-Day Modal
  const handleOpenOffDayModal = (dayName: string, item: RoutineItem | null = null) => {
    const initialReason = item?.title || item?.rawText || "No Classes Scheduled";
    setOffDayReasonInput(initialReason);
    setOffDayModal({
      isOpen: true,
      day: dayName,
      item,
      reason: initialReason,
    });
  };

  // Save Off-Day to Supabase
  const handleSaveOffDay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!offDayModal) return;

    setIsSavingOffDay(true);
    const dayName = offDayModal.day;
    const cleanReason = offDayReasonInput.trim() || "No Classes Scheduled";
    const existing = offDayModal.item;

    try {
      if (existing) {
        const updatedItem: RoutineItem = {
          ...existing,
          title: cleanReason,
          rawText: cleanReason,
          type: "No Class",
          courseCode: null,
          courseTitle: null,
          faculty: null,
          room: null,
        };
        await onSaveRoutine(updatedItem);
      } else {
        const newItem: RoutineItem = {
          id: `noclass-${(selectedSection === "ALL" ? "sec13" : selectedSection).toLowerCase().replace(/\s+/g, "")}-${dayName.toLowerCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
          section: selectedSection === "ALL" ? "Section 13" : selectedSection,
          day: dayName,
          dayShort: dayName.slice(0, 3),
          colIndex: 1,
          timeSlot: "Full Day",
          type: "No Class",
          title: cleanReason,
          rawText: cleanReason,
          courseCode: null,
          courseTitle: null,
          faculty: null,
          room: null,
        };
        await onSaveRoutine(newItem);
      }
      setIsSavingOffDay(false);
      setOffDayModal(null);
    } catch {
      setIsSavingOffDay(false);
    }
  };

  // Remove Off-Day directly from Modal
  const handleRemoveOffDayFromModal = async () => {
    if (offDayModal?.item) {
      await onDeleteRoutine(offDayModal.item.id);
    }
    setOffDayModal(null);
  };

  // Card renderer with multi-slot wide support & quick actions
  const renderCard = (item: RoutineItem, isWide = false, span = 1) => {
    const isLab = item.type === "Lab";
    const isBreak = item.type === "Break";
    const isNoClass = item.type === "No Class";
    const [start, end] = getTimeRange(item.timeSlot);
    const durationHours = end > start ? (end - start).toFixed(1).replace(/\.0$/, "") : null;

    if (isBreak) {
      return (
        <div
          key={item.id}
          className="group relative w-full h-full min-h-[135px] flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-center p-3 transition-all hover:shadow-md"
        >
          <Coffee className="w-5 h-5 text-amber-500" />
          <div className="text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            {item.title || item.rawText || "Break"}
          </div>
          <div className="text-[10px] text-amber-600/80 font-mono">{item.timeSlot}</div>

          {/* Quick Hover Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              title="Edit Break"
              className="p-1 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeletingId(item.id);
              }}
              title="Delete Break"
              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (isNoClass) {
      return (
        <div
          key={item.id}
          className="group relative w-full h-full min-h-[135px] flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 text-center p-3 transition-all"
        >
          <CalendarOff className="w-5 h-5 text-slate-400" />
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {item.title || item.rawText || "No Class"}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] hover:bg-indigo-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setDeletingId(item.id)}
              className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-[10px] hover:bg-rose-100 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      );
    }

    const isPreview = previewItem && item.id === previewItem.id;

    if (isPreview) {
      return (
        <div
          key={item.id}
          className="group relative w-full h-full min-h-[145px] rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/70 dark:via-slate-900 dark:to-teal-950/50 shadow-xl shadow-emerald-500/25 flex flex-col justify-between p-3.5 gap-2 select-none ring-4 ring-emerald-500/30 animate-pulse"
        >
          {/* Top: Course Code + Preview Badge */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {item.courseCode || "NO CODE"}
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Proposed Preview</span>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewItem(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Cancel Preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <div className="flex-1 font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
            {item.courseTitle || item.title}
          </div>

          {/* Bottom */}
          <div className="space-y-1.5 pt-1.5 border-t border-emerald-200/80 dark:border-emerald-800/60 text-[10px]">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 truncate">
                <User className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="truncate">{item.faculty || "Faculty"}</span>
              </div>
              <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">
                {item.timeSlot}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 pt-1">
              <span className="flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-3 h-3 shrink-0" />
                <span>Room {item.room}</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmPreview();
                }}
                disabled={isConfirmingPreview}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{isConfirmingPreview ? "Saving..." : "Confirm & Save"}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const cfg = isLab
      ? {
          border: "border-l-4 border-l-sky-500 border-sky-200/80 dark:border-sky-800/50",
          bg: "bg-white dark:bg-slate-900/90 hover:bg-sky-50/40 dark:hover:bg-sky-950/20",
          code: "text-sky-600 dark:text-sky-400",
          badge: "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300",
        }
      : {
          border: "border-l-4 border-l-indigo-500 border-indigo-200/60 dark:border-indigo-800/40",
          bg: "bg-white dark:bg-slate-900/90 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20",
          code: "text-indigo-600 dark:text-indigo-400",
          badge: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300",
        };

    return (
      <div
        key={item.id}
        onClick={() => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        className={`
          group relative w-full h-full min-h-[135px] rounded-2xl border
          cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
          flex flex-col justify-between p-3.5 gap-2 select-none
          ${cfg.border} ${cfg.bg}
        `}
      >
        {/* Top: Course Code + Lab Badge + Duration Badge + Quick Actions */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-black uppercase tracking-wider ${cfg.code}`}>
              {item.courseCode || "NO CODE"}
            </span>

            {isLab && (
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                Lab · {isWide ? "3hr" : "Lab"}
              </span>
            )}

            {isWide && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {durationHours ? `${durationHours} Hours (${span} Slots)` : `${span} Slots`}
              </span>
            )}
          </div>

          {/* Quick Action Buttons on Hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-slate-900 text-white dark:bg-slate-800 p-0.5 rounded-lg shadow-md -mr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateRoutine(item);
              }}
              title="Duplicate Class"
              className="p-1 hover:text-amber-400 transition-colors"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              title="Edit Class"
              className="p-1 hover:text-indigo-400 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeletingId(item.id);
              }}
              title="Delete Class"
              className="p-1 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Mid: Course Title */}
        <div
          className={`flex-1 font-bold leading-snug text-slate-800 dark:text-slate-100 ${
            isWide ? "text-xs sm:text-sm line-clamp-3" : "text-[11px] line-clamp-2"
          }`}
          title={item.courseTitle || ""}
        >
          {item.courseTitle || item.title || item.rawText}
        </div>

        {/* Bottom: Faculty + Timing + Section + Room */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
          <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400">
            {item.faculty ? (
              <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 truncate">
                <User className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="truncate">{item.faculty}</span>
              </div>
            ) : (
              <span />
            )}
            <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">
              {item.timeSlot}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 leading-none">
            <span className="font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px]">
              {item.section}
            </span>
            {item.room && (
              <span className="flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-3 h-3 shrink-0" />
                <span>Room {item.room}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Build Sat-Thu cells with dynamic colSpan calculation
  const buildDayCells = (dayName: string, dayClasses: RoutineItem[]) => {
    const cells: React.ReactNode[] = [];
    let skip = 0;

    for (let i = 0; i < activeSatThuSlots.length; i++) {
      if (skip > 0) {
        skip--;
        continue;
      }

      const slot = activeSatThuSlots[i];
      const colItems = dayClasses.filter((c) => matchSatThuSlot(c, slot.colIndex, activeSatThuSlots));
      const isBreakCol = Boolean(slot.isBreak || slot.colIndex === 3);

      // Determine colSpan for this slot
      let span = 1;
      colItems.forEach((item) => {
        const s = getColSpan(slot.colIndex, item.timeSlot, activeSatThuSlots);
        if (s > span) span = s;
      });

      // Only span if subsequent columns are actually free
      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = activeSatThuSlots[i + s];
          if (nextSlot && dayClasses.some((c) => matchSatThuSlot(c, nextSlot.colIndex, activeSatThuSlots))) {
            canSpan = false;
            break;
          }
        }
        if (!canSpan) span = 1;
        else skip = span - 1;
      }

      const isWide = span > 1;

      cells.push(
        <td
          key={slot.colIndex}
          colSpan={span}
          className={`p-2 align-top border-r border-slate-200 dark:border-slate-800 ${
            isBreakCol ? "bg-amber-50/40 dark:bg-amber-950/10" : ""
          }`}
          style={{ height: "1px" }}
        >
          <div className="h-full flex flex-col gap-2 min-h-[135px]">
            {colItems.length > 0 ? (
              colItems.map((item) => renderCard(item, isWide, span))
            ) : (
              <button
                onClick={() => handleAddSlotClass(dayName, slot.slotString, slot.colIndex)}
                title={`+ Add Class for ${dayName} at ${slot.label}`}
                className="group w-full h-full min-h-[135px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Plus className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add Class
                </span>
              </button>
            )}
          </div>
        </td>
      );
    }

    // Add 2 empty filler cells to match 7 total columns
    cells.push(
      <td
        key="empty-fill-1"
        className="p-2 align-top border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20"
        style={{ height: "1px" }}
      >
        <div className="min-h-[135px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-medium select-none">
          —
        </div>
      </td>,
      <td
        key="empty-fill-2"
        className="p-2 align-top bg-slate-50/30 dark:bg-slate-900/20"
        style={{ height: "1px" }}
      >
        <div className="min-h-[135px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-medium select-none">
          —
        </div>
      </td>
    );

    return cells;
  };

  // Build Friday cells with dynamic colSpan calculation
  const buildFridayCells = (dayClasses: RoutineItem[]) => {
    const cells: React.ReactNode[] = [];
    let skip = 0;

    for (let i = 0; i < activeFridaySlots.length; i++) {
      if (skip > 0) {
        skip--;
        continue;
      }

      const slot = activeFridaySlots[i];
      const colItems = dayClasses.filter((c) => matchFridaySlot(c, slot.colIndex, activeFridaySlots));
      const isBreakCol = Boolean(slot.isBreak || slot.colIndex === 3 || slot.colIndex === 4);

      let span = 1;
      colItems.forEach((item) => {
        const s = getFridayColSpan(slot.colIndex, item.timeSlot, activeFridaySlots);
        if (s > span) span = s;
      });

      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = activeFridaySlots[i + s];
          if (nextSlot && dayClasses.some((c) => matchFridaySlot(c, nextSlot.colIndex, activeFridaySlots))) {
            canSpan = false;
            break;
          }
        }
        if (!canSpan) span = 1;
        else skip = span - 1;
      }

      const isWide = span > 1;

      cells.push(
        <td
          key={slot.colIndex}
          colSpan={span}
          className={`p-2 align-top border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
            isBreakCol ? "bg-amber-50/40 dark:bg-amber-950/10" : ""
          }`}
          style={{ height: "1px" }}
        >
          <div className="h-full flex flex-col gap-2 min-h-[135px]">
            {colItems.length > 0 ? (
              colItems.map((item) => renderCard(item, isWide, span))
            ) : (
              <button
                onClick={() => handleAddSlotClass("Friday", slot.slotString, slot.colIndex)}
                title={`+ Add Friday Class at ${slot.label}`}
                className="group w-full h-full min-h-[135px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Plus className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add Class
                </span>
              </button>
            )}
          </div>
        </td>
      );
    }

    return cells;
  };

  // Banner for an Off-Day / No Classes Scheduled
  const renderOffDayBanner = (dayName: string, offDayItem: RoutineItem | null) => {
    return (
      <div className="w-full py-6 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between px-6 py-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CalendarOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                {offDayItem?.title || offDayItem?.rawText || "No Classes Scheduled"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Off-Day Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This day is marked as having no classes scheduled for {selectedSection}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenOffDayModal(dayName, offDayItem)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Edit Reason</span>
          </button>

          <button
            onClick={() => handleAddSlotClass(dayName, "09:30-11:00", 1)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class to Day</span>
          </button>

          {offDayItem && (
            <button
              onClick={() => setDeletingId(offDayItem.id)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Remove Off-Day and open timetable slots"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Off-Day (Open Slots)</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* ── LIVE EDIT MODE STRIP WITH DIRECT MODAL TRIGGERS ── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-bold">Interactive Visual Routine Editor</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-purple-200">
            Multi-slot classes (3hr labs) automatically size across time slots!
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Batches & Sections Modal trigger */}
          {onSaveBatches && (
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white font-bold border border-purple-500/30 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Batches & Sections</span>
            </button>
          )}

          {/* Timetable Columns Modal trigger */}
          {onSaveTimeSlots && (
            <button
              onClick={() => setIsTimeSlotModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold border border-indigo-500/30 transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Timetable Columns</span>
            </button>
          )}

          {/* Routine Audit Modal trigger */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              sectionIssues.length > 0
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/25 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-500/30"
            }`}
            title="Audit routine for missing classes & credit hour balance"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Audit Routine {sectionIssues.length > 0 ? `(${sectionIssues.length})` : ""}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Timetable Matrix View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Class</span>
          </button>
        </div>
      </div>

      {/* ── FILTER BAR (Exact Replica of Main Site RoutineViewer) ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Row 1: Section Dropdown + Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Section:
            </span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="flex-1 sm:w-64 bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-xs"
            >
              <option value="ALL">All Sections (Overview)</option>
              {activeBatchGroups.map((bg) => (
                <optgroup key={bg.batch} label={bg.label}>
                  {bg.sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code, room, teacher initials..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Row 2: Batch Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">
            Batch:
          </span>
          {activeBatchGroups.map((bg) => {
            const isBatchActive = getBatchFromSection(selectedSection) === bg.batch;
            return (
              <button
                key={bg.batch}
                onClick={() => setSelectedSection(bg.sections[0])}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isBatchActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {bg.label}
              </button>
            );
          })}
        </div>

        {/* Row 3: Sub-section Pills for active batch */}
        {selectedSection !== "ALL" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-400 font-semibold text-[10px] tracking-wider shrink-0 mr-1">
              Sections in Batch:
            </span>
            {activeBatchGroups
              .find((bg) => bg.batch === getBatchFromSection(selectedSection))
              ?.sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    selectedSection === sec
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {sec}
                </button>
              ))}
          </div>
        )}

        {/* Row 4: Day & Type filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium uppercase tracking-wider text-[11px]">Day:</span>
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <option value="ALL">All Days</option>
                {WEEKDAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium uppercase tracking-wider text-[11px]">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <option value="ALL">All Classes</option>
                <option value="Theory">Theory</option>
                <option value="Lab">Lab (3 Hours)</option>
                <option value="Break">Breaks</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredRoutine.length}</span> classes displayed
          </div>
        </div>
      </div>

      {/* ── MISSING CLASS AUDIT ALERT BANNER (If issues found) ── */}
      {sectionIssues.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{sectionIssues.length} Missing Class Detected in {selectedSection}!</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] border border-rose-500/20">
                  {sectionIssues[0].courseCode}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                {sectionIssues[0].description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Suggested Clash-Free Slots</span>
          </button>
        </div>
      )}

      {/* ── LIVE PREVIEW BANNER (WHEN SIMULATING A PROPOSED CLASS) ── */}
      {previewItem && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-2xl border-2 border-emerald-400 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in sticky top-4 z-30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Eye className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-emerald-900 shadow-sm">
                  ✨ Interactive Timetable Preview
                </span>
                <span className="font-black text-sm text-amber-200">
                  {previewItem.courseCode} ({previewItem.type}) on {previewItem.day} · {previewItem.timeSlot}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">
                You are currently previewing how this class looks in <strong>{previewItem.section}</strong>&apos;s routine below. Instructor: <strong>{previewItem.faculty || "Faculty"}</strong> • Room: <strong>{previewItem.room}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                setPreviewItem(null);
                setIsAuditModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/20"
            >
              Back to Auditor
            </button>
            <button
              onClick={() => setPreviewItem(null)}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs transition-colors cursor-pointer border border-rose-400/30"
            >
              ✕ Exit Preview
            </button>
            <button
              onClick={handleConfirmPreview}
              disabled={isConfirmingPreview}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isConfirmingPreview ? "Saving..." : "Confirm & Save to Routine"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TIMETABLE MATRIX VIEW (WITH PERFECT MULTI-SLOT CARD SPANNING) ── */}
      {viewMode === "table" ? (
        <div className="rounded-3xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-full">
          <div className="w-full max-w-full overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[1100px] border-collapse text-left table-fixed">
              <colgroup>
                {/* Day column - 11% */}
                <col style={{ width: "11%" }} />
                {/* 7 time columns matching Sat-Thu and Friday - ~12.7% each */}
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.7%" }} />
                <col style={{ width: "12.8%" }} />
              </colgroup>

              {/* Sat-Thu Header */}
              <thead>
                <tr className="bg-[#1E3A8A] text-white dark:bg-indigo-950 border-b border-blue-900">
                  <th className="sticky left-0 z-20 px-3 py-3.5 border-r border-blue-800 dark:border-indigo-800 align-middle bg-[#1E3A8A] dark:bg-indigo-950 shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mb-0.5">Day</div>
                    <div className="text-xs font-black text-white whitespace-pre-line leading-snug">{sectionLabel}</div>
                  </th>
                  {activeSatThuSlots.map((slot) => (
                    <th
                      key={slot.colIndex}
                      className={`px-2 py-3 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border-r border-blue-800 dark:border-indigo-800 leading-tight ${
                        slot.isBreak || slot.colIndex === 3 ? "bg-amber-500 text-slate-950 font-black" : "text-blue-100"
                      }`}
                    >
                      {slot.label}
                    </th>
                  ))}
                  {/* 2 empty filler header columns */}
                  <th className="px-2 py-3 border-r border-blue-800 dark:border-indigo-800 bg-[#1E3A8A]/60" />
                  <th className="px-2 py-3 bg-[#1E3A8A]/60" />
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {WEEKDAYS.map((dayName) => {
                  if (selectedDayFilter !== "ALL" && selectedDayFilter !== dayName) return null;

                  const rawDayClasses = filteredRoutine.filter((item) => item.day === dayName);
                  const hasRealOrPreviewClass = rawDayClasses.some((c) => c.type !== "No Class");
                  const dayClasses = hasRealOrPreviewClass
                    ? rawDayClasses.filter((c) => c.type !== "No Class")
                    : rawDayClasses;
                  const isOffDay = dayClasses.length > 0 && dayClasses.every((c) => c.type === "No Class");
                  const offDayItem = isOffDay ? dayClasses[0] : null;
                  const isFriday = dayName === "Friday";

                  if (isFriday) {
                    return (
                      <React.Fragment key={dayName}>
                        {/* Friday Header Row */}
                        <tr className="bg-[#1E3A8A] text-white dark:bg-indigo-950 border-t-2 border-b border-blue-900">
                          <th className="sticky left-0 z-20 px-3 py-3 border-r border-blue-800 dark:border-indigo-800 align-middle text-center bg-[#1E3A8A] dark:bg-indigo-950 shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                            <div className="text-xs font-black text-amber-300 uppercase tracking-wider">Fri time</div>
                          </th>
                          {activeFridaySlots.map((slot) => (
                            <th
                              key={slot.colIndex}
                              className={`px-1.5 py-2.5 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border-r border-blue-800 dark:border-indigo-800 last:border-r-0 leading-tight ${
                                slot.isBreak || slot.colIndex === 4 ? "bg-amber-500 text-slate-950 font-black" : "text-blue-100"
                              }`}
                            >
                              {slot.label}
                            </th>
                          ))}
                        </tr>

                        {/* Friday Cards Row */}
                        <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
                          <td className="group/day sticky left-0 z-20 px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100 dark:bg-[#0B1120] shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-sm font-black text-slate-900 dark:text-white">Fri</span>
                              {!isOffDay && (
                                <button
                                  onClick={() => handleOpenOffDayModal("Friday", offDayItem)}
                                  title="Mark Friday as Off-Day / No Classes"
                                  className="opacity-0 group-hover/day:opacity-100 transition-opacity text-[10px] font-bold text-slate-400 hover:text-amber-500 flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                                >
                                  <CalendarOff className="w-3 h-3" />
                                  <span>Off-day</span>
                                </button>
                              )}
                            </div>
                          </td>

                          {isOffDay ? (
                            <td colSpan={7} className="p-4">
                              {renderOffDayBanner("Friday", offDayItem)}
                            </td>
                          ) : (
                            buildFridayCells(dayClasses)
                          )}
                        </tr>
                      </React.Fragment>
                    );
                  }

                  // Sat-Thu Rows
                  return (
                    <tr
                      key={dayName}
                      className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="group/day sticky left-0 z-20 px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100 dark:bg-[#0B1120] shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {dayName.substring(0, 3)}
                          </span>
                          {!isOffDay && (
                            <button
                              onClick={() => handleOpenOffDayModal(dayName, offDayItem)}
                              title={`Mark ${dayName} as Off-Day / No Classes`}
                              className="opacity-0 group-hover/day:opacity-100 transition-opacity text-[10px] font-bold text-slate-400 hover:text-amber-500 flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                            >
                              <CalendarOff className="w-3 h-3" />
                              <span>Off-day</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {isOffDay ? (
                        <td colSpan={7} className="p-4">
                          {renderOffDayBanner(dayName, offDayItem)}
                        </td>
                      ) : (
                        buildDayCells(dayName, dayClasses)
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── LIST VIEW MODE ── */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Day & Time</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredRoutine.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.section}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold">{item.day}</span> • <span className="font-mono text-amber-500">{item.timeSlot}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.courseCode}</span>
                    <div className="text-slate-500 line-clamp-1">{item.courseTitle || item.title || "—"}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-purple-600 dark:text-purple-400">{item.faculty || "—"}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.room ? `Room ${item.room}` : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onDuplicateRoutine(item)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        title="Edit"
                        className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-600 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Routine Modal (Add / Edit) */}
      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (item) => {
          await onSaveRoutine(item);
          setIsModalOpen(false);
        }}
        initialData={editingItem}
        facultyList={facultyList}
        sectionsList={sectionsList}
        routineData={routineData}
      />

      {/* Batch & Section Manager Modal */}
      {onSaveBatches && (
        <BatchSectionManagerModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          batchGroups={activeBatchGroups}
          onSaveBatches={onSaveBatches}
        />
      )}

      {/* Time Slot Columns Manager Modal */}
      {onSaveTimeSlots && (
        <TimeSlotManagerModal
          isOpen={isTimeSlotModalOpen}
          onClose={() => setIsTimeSlotModalOpen(false)}
          timeSlots={portalTimeSlots || DEFAULT_PORTAL_TIME_SLOTS}
          onSaveTimeSlots={onSaveTimeSlots}
        />
      )}

      {/* Routine Audit & Slot Suggester Modal */}
      <RoutineAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        routineData={routineData}
        selectedSection={selectedSection}
        batchGroups={activeBatchGroups}
        facultyList={facultyList}
        onAddClass={onSaveRoutine}
        onPreviewClass={(item) => {
          setPreviewItem(item);
          if (item.section && item.section !== selectedSection) {
            setSelectedSection(item.section);
          }
          setIsAuditModalOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Class Schedule?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this schedule item? It will be removed from Supabase and the routine.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteRoutine(deletingId);
                  setDeletingId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Delete from Supabase
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── DEDICATED OFF-DAY / REASON MODAL ── */}
      {offDayModal && offDayModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <CalendarOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Configure Off-Day Schedule</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {offDayModal.day} • {selectedSection}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOffDayModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveOffDay} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Reason / Banner Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={offDayReasonInput}
                  onChange={(e) => setOffDayReasonInput(e.target.value)}
                  placeholder="e.g. No Classes Scheduled, Govt Holiday, Semester Break"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Reason Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "No Classes Scheduled",
                    "Government Holiday",
                    "Semester Break",
                    "Midterm Preparation",
                    "University Closed",
                    "Eid Vacation",
                    "Sports & Cultural Fest",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setOffDayReasonInput(preset)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        offDayReasonInput === preset
                          ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {offDayModal.item ? (
                  <button
                    type="button"
                    onClick={handleRemoveOffDayFromModal}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Off-Day</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOffDayModal(null)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingOffDay}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingOffDay ? "Saving..." : "Save Reason to Supabase"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
