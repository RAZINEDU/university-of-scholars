"use client";

import React, { useState, useEffect, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { useDynamicTimeSlots } from "@/lib/useDynamicData";
import { TEACHER_DIRECTORY } from "@/data/teacherData";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Bookmark,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Download,
  BookOpen,
  Grid,
  List,
  Zap,
  Building2,
  Coffee,
  CalendarOff
} from "lucide-react";

interface RetakeBuilderProps {
  routineData: RoutineItem[];
}

// Standard 5 time columns for Sat–Thu (Fall 2026)
const TIME_SLOTS = [
  { colIndex: 1, label: "9:00 AM - 10:30 AM" },
  { colIndex: 2, label: "10:30 AM - 12:00 PM" },
  { colIndex: 3, label: "12:00 PM - 1:00 PM" },
  { colIndex: 4, label: "1:00 PM - 2:30 PM" },
  { colIndex: 5, label: "2:30 PM - 4:00 PM" },
];

// Friday-specific time slots (7 columns)
const FRIDAY_TIME_SLOTS = [
  { colIndex: 1, label: "9:00 AM - 10:30 AM" },
  { colIndex: 2, label: "10:30 AM - 12:00 PM" },
  { colIndex: 3, label: "12:30 PM - 1:00 PM" },
  { colIndex: 4, label: "1:00 PM - 2:30 PM" },   // Jumu'ah Break
  { colIndex: 5, label: "2:30 PM - 3:30 PM" },
  { colIndex: 6, label: "3:30 PM - 4:00 PM" },
  { colIndex: 7, label: "4:00 PM - 5:00 PM" },
];

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Parse "HH:MM" (with optional AM/PM) to decimal hours
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

  if (!isPM && !isAM) {
    if (h < 8 && h !== 12) h += 12;
  }
  return h + m / 60;
};

// Extract [start, end] time in decimal hours
const getTimeRange = (timeSlot: string | undefined): [number, number] => {
  if (!timeSlot) return [0, 0];
  const parts = timeSlot.split("-");
  if (parts.length < 2) return [0, 0];
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  return [start, end];
};

// Returns colSpan for Sat-Thu
const getColSpan = (colIndex: number, timeSlot: string | undefined, slots: { colIndex: number; label: string }[] = TIME_SLOTS): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = slots.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < slots.length; k++) {
    const [sStart] = getTimeRange(slots[k].label);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

// Returns colSpan for Friday
const getFridayColSpan = (colIndex: number, timeSlot: string | undefined, slots: { colIndex: number; label: string }[] = FRIDAY_TIME_SLOTS): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = slots.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < slots.length; k++) {
    const [sStart] = getTimeRange(slots[k].label);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

const matchSatThuSlot = (item: RoutineItem, colIndex: number, slots: { colIndex: number; label: string }[] = TIME_SLOTS) => {
  if (item.colIndex === colIndex) return true;
  const [start] = getTimeRange(item.timeSlot);
  const slotLabel = slots.find((s) => s.colIndex === colIndex)?.label;
  if (!slotLabel) return false;
  const [slotStart] = getTimeRange(slotLabel);
  return start > 0 && Math.abs(start - slotStart) < 0.25;
};

const matchFridaySlot = (item: RoutineItem, colIndex: number, slots: { colIndex: number; label: string }[] = FRIDAY_TIME_SLOTS) => {
  if (item.colIndex === colIndex) return true;
  const [start] = getTimeRange(item.timeSlot);
  const slotLabel = slots.find((s) => s.colIndex === colIndex)?.label;
  if (!slotLabel) return false;
  const [slotStart] = getTimeRange(slotLabel);
  return start > 0 && Math.abs(start - slotStart) < 0.25;
};

// Check if two routine items overlap in time
const doItemsOverlap = (a: RoutineItem, b: RoutineItem): boolean => {
  if (!a || !b) return false;
  if (a.day !== b.day) return false;
  if (a.id === b.id) return false;
  if (a.type === "Break" || a.type === "No Class" || b.type === "Break" || b.type === "No Class") return false;

  const isFriday = a.day === "Friday";
  const getSpan = isFriday ? getFridayColSpan : getColSpan;

  // 1. Column span overlap check
  const spanA = getSpan(a.colIndex, a.timeSlot);
  const colsA = Array.from({ length: spanA }, (_, idx) => a.colIndex + idx);

  const spanB = getSpan(b.colIndex, b.timeSlot);
  const colsB = Array.from({ length: spanB }, (_, idx) => b.colIndex + idx);

  const colOverlap = colsA.some((col) => colsB.includes(col));

  // 2. Exact time range overlap check (startA < endB && startB < endA)
  const [startA, endA] = getTimeRange(a.timeSlot);
  const [startB, endB] = getTimeRange(b.timeSlot);

  const timeOverlap = startA < endB && startB < endA;

  return colOverlap || timeOverlap;
};

export const RetakeBuilder: React.FC<RetakeBuilderProps> = ({ routineData }) => {
  const { timeSlots: dynamicTimeSlots } = useDynamicTimeSlots();
  const satThuSlots = useMemo(() => {
    return dynamicTimeSlots?.satThuSlots?.length ? dynamicTimeSlots.satThuSlots : TIME_SLOTS;
  }, [dynamicTimeSlots]);
  const fridaySlots = useMemo(() => {
    return dynamicTimeSlots?.fridaySlots?.length ? dynamicTimeSlots.fridaySlots : FRIDAY_TIME_SLOTS;
  }, [dynamicTimeSlots]);
  const [primarySection, setPrimarySection] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [retakeSecFilter, setRetakeSecFilter] = useState<string>("ALL");
  const [activeViewMode, setActiveViewMode] = useState<"grid" | "list">("grid");

  // Load saved routine from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ius_my_routine_selected");
      if (saved) {
        setSelectedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save selectedIds to localStorage
  const updateSelection = (newIds: string[]) => {
    setSelectedIds(newIds);
    try {
      localStorage.setItem("ius_my_routine_selected", JSON.stringify(newIds));
    } catch (e) {}
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      updateSelection(selectedIds.filter((x) => x !== id));
    } else {
      updateSelection([...selectedIds, id]);
    }
  };

  const clearAll = () => {
    updateSelection([]);
  };

  // Quick Action: Auto-load all courses of Primary Section
  const handleLoadPrimarySection = () => {
    if (!primarySection) return;
    const secClasses = routineData.filter(
      (item) => item.section === primarySection && item.type !== "Break" && item.type !== "No Class"
    );
    const secIds = secClasses.map((item) => item.id);
    
    // Preserve any retakes from other sections already picked
    const existingRetakes = selectedIds.filter((id) => {
      const item = routineData.find((r) => r.id === id);
      return item && item.section !== primarySection;
    });

    const combined = Array.from(new Set([...secIds, ...existingRetakes]));
    updateSelection(combined);
  };

  // Selected routine items list
  const myRoutineItems = useMemo(() => {
    return routineData.filter((item) => selectedIds.includes(item.id));
  }, [routineData, selectedIds]);

  // All sections list sorted
  const sectionsList = useMemo(() => {
    return Array.from(new Set(routineData.map((d) => d.section))).sort();
  }, [routineData]);

  // Conflict / Clash Detector logic
  const clashes = useMemo(() => {
    const conflictPairs: { item1: RoutineItem; item2: RoutineItem; day: string; time: string }[] = [];
    
    for (let i = 0; i < myRoutineItems.length; i++) {
      for (let j = i + 1; j < myRoutineItems.length; j++) {
        const a = myRoutineItems[i];
        const b = myRoutineItems[j];

        if (doItemsOverlap(a, b)) {
          conflictPairs.push({
            item1: a,
            item2: b,
            day: a.day,
            time: a.timeSlot,
          });
        }
      }
    }
    return conflictPairs;
  }, [myRoutineItems]);

  // Check if a specific candidate course clashes with currently selected routine
  const getCandidateClash = (candidate: RoutineItem) => {
    if (selectedIds.includes(candidate.id)) return null;

    const clashingItem = myRoutineItems.find(
      (item) => doItemsOverlap(item, candidate)
    );
    return clashingItem || null;
  };

  // Filtered available courses to pick from
  const availableClasses = useMemo(() => {
    return routineData.filter((item) => {
      if (item.type === "Break" || item.type === "No Class") return false;
      if (retakeSecFilter !== "ALL" && item.section !== retakeSecFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const code = (item.courseCode || "").toLowerCase();
        const title = (item.courseTitle || item.title || "").toLowerCase();
        const fac = (item.faculty || "").toLowerCase();
        const sec = item.section.toLowerCase();
        return code.includes(q) || title.includes(q) || fac.includes(q) || sec.includes(q);
      }
      return true;
    });
  }, [routineData, retakeSecFilter, searchFilter]);

  // ── CARD RENDERER ──────────────────────────────────────────────────
  const renderCard = (item: RoutineItem, isWide = false) => {
    const isRetake = item.section !== primarySection;
    const itemClashes = clashes.some(
      (c) => c.item1.id === item.id || c.item2.id === item.id
    );
    const isLab = item.type === "Lab";
    const facultyInfo = item.faculty ? TEACHER_DIRECTORY[item.faculty] : null;
    const teacherName = facultyInfo ? facultyInfo.name : item.faculty;

    // BREAK card
    if (item.type === "Break") {
      return (
        <div key={item.id} className="w-full h-full min-h-[130px] flex flex-col items-center justify-center gap-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-center px-3 py-3">
          <Coffee className="w-5 h-5 text-amber-400 dark:text-amber-500 flex-shrink-0" />
          <div className="text-[11px] font-black uppercase tracking-widest text-amber-500 dark:text-amber-400">
            {item.title || item.rawText}
          </div>
        </div>
      );
    }

    // Styling per state
    let wrapStyle = "";
    let codeStyle = "";

    if (itemClashes) {
      wrapStyle = "bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/40 animate-pulse ring-2 ring-red-500/60";
      codeStyle = "text-white font-black";
    } else if (isRetake) {
      wrapStyle = "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white border-2 border-purple-400 shadow-md shadow-purple-500/30 ring-2 ring-purple-500/40 hover:border-purple-300";
      codeStyle = "text-amber-300 font-black";
    } else if (isLab) {
      wrapStyle = "border-l-4 border-l-sky-500 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/70 hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:border-l-sky-400 hover:shadow-sky-100 dark:hover:shadow-sky-900/20 text-slate-900 dark:text-white";
      codeStyle = "text-sky-600 dark:text-sky-400 font-black";
    } else {
      wrapStyle = "border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-l-indigo-400 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 text-slate-900 dark:text-white";
      codeStyle = "text-indigo-600 dark:text-indigo-400 font-black";
    }

    return (
      <div
        key={item.id}
        onClick={() => toggleSelect(item.id)}
        className={`
          relative w-full h-full min-h-[130px] rounded-xl
          cursor-pointer transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-md
          flex flex-col justify-between
          p-3 gap-1.5 text-left
          ${wrapStyle}
        `}
      >
        {/* ── TOP: code + badges ── */}
        <div className="flex items-start justify-between gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${codeStyle}`}>
            {item.courseCode || ""}
          </span>

          {itemClashes ? (
            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-red-950 text-red-200 flex items-center gap-0.5">
              <XCircle className="w-2.5 h-2.5" /> Crash
            </span>
          ) : isRetake ? (
            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 flex items-center gap-0.5 shadow-sm animate-pulse">
              <Sparkles className="w-2.5 h-2.5" /> Retake
            </span>
          ) : isLab ? (
            <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
              Lab · 3hr
            </span>
          ) : null}
        </div>

        {/* ── MID: title ── */}
        <div
          className={`flex-1 font-semibold leading-snug ${isWide ? "text-[13px]" : "text-[11px]"} ${
            isRetake || itemClashes ? "text-white" : "text-slate-700 dark:text-slate-200"
          }`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: isWide ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.courseTitle || item.title || item.rawText}
        </div>

        {/* ── BOTTOM: teacher + section + room ── */}
        <div className="flex flex-col gap-1">
          {teacherName && (
            <div className={`flex items-center gap-1 text-[10px] ${
              isRetake || itemClashes ? "text-slate-200 opacity-90" : "text-slate-400 dark:text-slate-500"
            }`}>
              <User className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{teacherName}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[9px] font-black px-1.5 py-[2px] rounded leading-none ${
                itemClashes
                  ? "bg-white text-red-600 font-extrabold"
                  : isRetake
                  ? "bg-purple-950 text-purple-200 border border-purple-400/40"
                  : "bg-amber-400 text-slate-900"
              }`}
            >
              {item.section}
            </span>

            {item.room && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold ${
                  isRetake || itemClashes
                    ? "text-emerald-300"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <Building2 className="w-2.5 h-2.5 flex-shrink-0" />
                {item.room}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── COLUMN CELLS for Sat–Thu (5 active slots + 2 empty filler cells) ───────
  const buildDayCells = (dayClasses: RoutineItem[]) => {
    const cells: React.ReactNode[] = [];
    let skip = 0;

    for (let i = 0; i < satThuSlots.length; i++) {
      if (skip > 0) { skip--; continue; }

      const slot = satThuSlots[i];
      const colItems = dayClasses.filter((c) => matchSatThuSlot(c, slot.colIndex, satThuSlots));
      const isBreakCol = Boolean((slot as any).isBreak || slot.colIndex === 3);

      let span = 1;
      colItems.forEach((item) => {
        const s = getColSpan(slot.colIndex, item.timeSlot, satThuSlots);
        if (s > span) span = s;
      });

      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = satThuSlots[i + s];
          if (nextSlot && dayClasses.some((c) => matchSatThuSlot(c, nextSlot.colIndex, satThuSlots))) {
            canSpan = false; break;
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
            isBreakCol ? "bg-amber-50/60 dark:bg-amber-950/20" : ""
          }`}
          style={{ height: "1px" }}
        >
          <div className="h-full flex flex-col gap-2 min-h-[130px]">
            {colItems.length > 0 ? (
              colItems.map((item) => renderCard(item, isWide))
            ) : (
              <div className="min-h-[130px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-medium select-none">
                —
              </div>
            )}
          </div>
        </td>
      );
    }

    // Add 2 empty filler cells to reach 7 columns total
    cells.push(
      <td key="empty-fill-1" className="p-2 align-top border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20" style={{ height: "1px" }}>
        <div className="min-h-[130px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm select-none">—</div>
      </td>,
      <td key="empty-fill-2" className="p-2 align-top bg-slate-50/30 dark:bg-slate-900/20" style={{ height: "1px" }}>
        <div className="min-h-[130px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm select-none">—</div>
      </td>
    );

    return cells;
  };

  // ── COLUMN CELLS for Friday (7 active slots) ────────────────────────────────
  const buildFridayCells = (dayClasses: RoutineItem[]) => {
    const cells: React.ReactNode[] = [];
    let skip = 0;

    for (let i = 0; i < fridaySlots.length; i++) {
      if (skip > 0) { skip--; continue; }

      const slot = fridaySlots[i];
      const colItems = dayClasses.filter((c) => matchFridaySlot(c, slot.colIndex, fridaySlots));
      const isBreakCol = Boolean((slot as any).isBreak || slot.colIndex === 4);

      let span = 1;
      colItems.forEach((item) => {
        const s = getFridayColSpan(slot.colIndex, item.timeSlot, fridaySlots);
        if (s > span) span = s;
      });

      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = fridaySlots[i + s];
          if (nextSlot && dayClasses.some((c) => matchFridaySlot(c, nextSlot.colIndex, fridaySlots))) {
            canSpan = false; break;
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
            isBreakCol ? "bg-amber-50/60 dark:bg-amber-950/20" : ""
          }`}
          style={{ height: "1px" }}
        >
          <div className="h-full flex flex-col gap-2 min-h-[130px]">
            {colItems.length > 0 ? (
              colItems.map((item) => renderCard(item, isWide))
            ) : (
              <div className="min-h-[130px] h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-medium select-none">
                —
              </div>
            )}
          </div>
        </td>
      );
    }

    return cells;
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* ── DIGITAL BANNER HEADER ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border border-indigo-500/30 space-y-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Digital Interactive Schedule &amp; Retake Analyzer
            </div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>Custom My-Routine &amp; Clash Checker</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Modern Digital Engine
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Load your section routine into the Timetable Matrix below, search retake courses, and watch live green/red neon indicators check clashes instantly!
            </p>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs transition-colors self-start md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Courses
            </button>
          )}
        </div>

        {/* STEP 1: Main Section Selector & Quick Load */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> Step 1: Select Your Current Section:
            </span>
            <select
              value={primarySection}
              onChange={(e) => setPrimarySection(e.target.value)}
              className="bg-slate-900 text-amber-300 font-extrabold px-3.5 py-2 rounded-xl border border-amber-400/40 focus:outline-none cursor-pointer text-xs sm:text-sm shadow-md"
            >
              <option value="">-- Select Your Section --</option>
              {sectionsList.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLoadPrimarySection}
            disabled={!primarySection}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all transform ${
              primarySection
                ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-amber-500/25 cursor-pointer hover:scale-105 active:scale-95"
                : "bg-slate-800 text-slate-400 border border-slate-700/80 cursor-not-allowed opacity-75"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            📥 {primarySection ? `Load ${primarySection} Routine` : "Select a Section First"}
          </button>
        </div>
      </div>

      {/* ── LIVE DIGITAL CLASH ALERT BANNERS ────────────────────────────────────── */}
      {clashes.length > 0 ? (
        <div className="p-5 rounded-2xl bg-red-500/15 dark:bg-red-950/50 border-2 border-red-500/50 text-red-900 dark:text-red-200 space-y-3 animate-pulse">
          <div className="flex items-center gap-3 font-black text-base text-red-500 dark:text-red-400">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-bounce" />
            <span>CRASH / CLASH DETECTED! ({clashes.length} Overlapping Conflict{clashes.length > 1 ? "s" : ""})</span>
          </div>
          <div className="space-y-2 text-xs">
            {clashes.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-red-400 dark:border-red-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md"
              >
                <div>
                  <span className="font-black text-red-600 dark:text-red-400 uppercase">
                    🚨 {c.day} ({c.time}):
                  </span>{" "}
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {c.item1.courseCode || c.item1.courseTitle} ({c.item1.section})
                  </span>
                  {" clashes with "}
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {c.item2.courseCode || c.item2.courseTitle} ({c.item2.section})
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-red-600 text-white self-start sm:self-auto flex items-center gap-1 shadow-sm">
                  <XCircle className="w-3.5 h-3.5" /> Crash Overlap
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : myRoutineItems.length > 0 ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 animate-bounce-subtle" />
            <span>Schedule Verified! 0 Time Clashes found among your {myRoutineItems.length} selected courses.</span>
          </div>
          <span className="text-[11px] font-black px-3 py-1 rounded-lg bg-emerald-500 text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 100% Clash Free
          </span>
        </div>
      ) : null}

      {/* ── MAIN LAYOUT: TIMETABLE GRID (LEFT 8/9 COLS) VS RETAKE COURSE FINDER (RIGHT 4/3 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TIMETABLE MATRIX GRID / LIST VIEW (EXPANDED TO 8/9 COLS FOR ZERO SCROLL) */}
        <div className="lg:col-span-8 2xl:col-span-9 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* View Header & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  My Custom Schedule Matrix ({myRoutineItems.length} Courses)
                </h3>
              </div>
              
              {/* Switch View Mode */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeViewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> Timetable Grid
                </button>
                <button
                  onClick={() => setActiveViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeViewMode === "list"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> List View
                </button>
              </div>
            </div>

            {myRoutineItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
                <Bookmark className="w-12 h-12 mx-auto opacity-30 text-indigo-500" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Your Timetable Matrix is Empty</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Click <strong>"📥 {primarySection ? `Load ${primarySection} Routine` : "Select Your Section"}</strong> above or add courses manually from the retake finder panel.
                </p>
              </div>
            ) : activeViewMode === "grid" ? (
              
              <div className="rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-full">
                <div className="w-full max-w-full overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[1100px] border-collapse text-left table-fixed">
                    <colgroup>
                      {/* Day column - 11% */}
                      <col style={{ width: "11%" }} />
                      {/* 7 time columns - ~12.7% each */}
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.7%" }} />
                      <col style={{ width: "12.8%" }} />
                    </colgroup>

                    {/* ── GLOBAL THEAD (SAT-THU HEADER ROW) ─── */}
                    <thead>
                      <tr className="bg-[#1E3A8A] text-white dark:bg-indigo-950 border-b border-blue-900">
                        <th className="sticky left-0 z-20 px-3 py-3.5 border-r border-blue-800 dark:border-indigo-800 align-middle bg-[#1E3A8A] dark:bg-indigo-950 shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mb-0.5">Day</div>
                          <div className="text-xs font-black text-white leading-snug">{primarySection || "My Schedule"}</div>
                        </th>
                        {satThuSlots.map((slot) => (
                          <th key={slot.colIndex}
                            className={`px-1.5 py-3 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border-r border-blue-800 dark:border-indigo-800 leading-tight ${
                              slot.colIndex === 3 ? "bg-amber-500 text-slate-950 font-black" : "text-blue-100"
                            }`}>
                            {slot.label}
                          </th>
                        ))}
                        {/* 2 empty filler header columns matching PDF */}
                        <th className="px-1.5 py-3 border-r border-blue-800 dark:border-indigo-800 bg-[#1E3A8A]/60" />
                        <th className="px-1.5 py-3 bg-[#1E3A8A]/60" />
                      </tr>
                    </thead>

                    {/* ── TBODY ─── */}
                    <tbody>
                      {WEEKDAYS.map((dayName) => {
                        const dayClasses = myRoutineItems.filter((item) => item.day === dayName);
                        const isOffDay = dayClasses.length > 0 && dayClasses.every((c) => c.type === "No Class");
                        const offDayItem = isOffDay ? dayClasses[0] : null;
                        const isFriday = dayName === "Friday";

                        if (isFriday) {
                          return (
                            <React.Fragment key={dayName}>
                              {/* ── FRIDAY HEADER ROW ("Fri time") ─── */}
                              <tr className="bg-[#1E3A8A] text-white dark:bg-indigo-950 border-t-2 border-b border-blue-900">
                                <th className="sticky left-0 z-20 px-3 py-3 border-r border-blue-800 dark:border-indigo-800 align-middle text-center bg-[#1E3A8A] dark:bg-indigo-950 shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                                  <div className="text-xs font-black text-amber-300 uppercase tracking-wider">Fri time</div>
                                </th>
                                {fridaySlots.map((slot) => (
                                  <th key={slot.colIndex}
                                    className={`px-1.5 py-2.5 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border-r border-blue-800 dark:border-indigo-800 last:border-r-0 leading-tight ${
                                      slot.colIndex === 4 ? "bg-amber-500 text-slate-950 font-black" : "text-blue-100"
                                    }`}>
                                    {slot.label}
                                  </th>
                                ))}
                              </tr>

                              {/* ── FRIDAY CLASS CARDS ROW ─── */}
                              <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
                                <td className="sticky left-0 z-20 px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100 dark:bg-[#0B1120] shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                                  <div className="text-sm font-black text-slate-900 dark:text-white tracking-wide leading-tight">Fri</div>
                                </td>
                                {isOffDay ? (
                                  <td colSpan={7} className="p-4">
                                    <div className="w-full py-8 rounded-2xl bg-stripes bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                                      <CalendarOff className="w-6 h-6 opacity-50" />
                                      <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                                        {offDayItem?.title || offDayItem?.rawText || "No Classes"}
                                      </span>
                                    </div>
                                  </td>
                                ) : (
                                  buildFridayCells(dayClasses)
                                )}
                              </tr>
                            </React.Fragment>
                          );
                        }

                        // ── SAT-THU ROWS ───
                        return (
                          <React.Fragment key={dayName}>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
                              <td className="sticky left-0 z-20 px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100 dark:bg-[#0B1120] shadow-[2px_0_5px_rgba(0,0,0,0.25)]">
                                <div className="text-sm font-black text-slate-900 dark:text-white tracking-wide leading-tight">
                                  {dayName.slice(0, 3)}
                                </div>
                              </td>
                              {isOffDay ? (
                                <td colSpan={7} className="p-4">
                                  <div className="w-full py-8 rounded-2xl bg-stripes bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                                    <CalendarOff className="w-6 h-6 opacity-50" />
                                    <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                                      {offDayItem?.title || offDayItem?.rawText || "No Classes"}
                                    </span>
                                  </div>
                                </td>
                              ) : (
                                buildDayCells(dayClasses)
                              )}
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              
              /* ── LIST VIEW ────────────────────────────────────────────────── */
              <div className="space-y-3">
                {myRoutineItems.map((item) => {
                  const isRetake = item.section !== primarySection;
                  const itemClashes = clashes.some(
                    (c) => c.item1.id === item.id || c.item2.id === item.id
                  );

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        itemClashes
                          ? "bg-red-500/20 border-2 border-red-500 text-red-200 animate-pulse shadow-md"
                          : isRetake
                          ? "bg-purple-950/40 border-2 border-purple-500/80 text-white shadow-md shadow-purple-500/20"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              isRetake
                                ? "bg-purple-600 text-white"
                                : "bg-indigo-600 text-white"
                            }`}
                          >
                            {item.section}
                          </span>

                          {isRetake && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 animate-pulse">
                              ✨ Retake Course
                            </span>
                          )}

                          {itemClashes && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1 animate-bounce">
                              <AlertTriangle className="w-3 h-3" /> Time Crash
                            </span>
                          )}

                          <span className="text-xs font-black uppercase">{item.courseCode}</span>
                          <span className="text-xs font-bold text-amber-500">• {item.day}</span>
                        </div>
                        
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.courseTitle || item.title || item.rawText}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {item.timeSlot}
                          </span>

                          {item.room && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Building2 className="w-3.5 h-3.5" />
                              Room {item.room}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSelect(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all flex-shrink-0"
                        title="Remove from routine"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: STEP 2 - RETAKE COURSE FINDER & CLASH NEON INDICATORS (4/3 COLS) */}
        <div className="lg:col-span-4 2xl:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                Step 2: Add Retake &amp; Check Compatibility
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live neon green / red blink indicators show clash status before adding!
              </p>
            </div>

            {/* Filter Inputs */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search retake course code (e.g. CSE-101)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">Section:</span>
                <select
                  value={retakeSecFilter}
                  onChange={(e) => setRetakeSecFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Retake Sections</option>
                  {sectionsList.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course List with Live Green/Red Pulsing Neon Badges */}
            <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {availableClasses.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No retake courses match your search filter.</p>
              ) : (
                availableClasses.map((candidate) => {
                  const isSelected = selectedIds.includes(candidate.id);
                  const candidateClash = getCandidateClash(candidate);
                  const isRetake = candidate.section !== primarySection;

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => toggleSelect(candidate.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400"
                          : candidateClash
                          ? "bg-red-500/10 dark:bg-red-950/30 border-2 border-red-500/60 hover:border-red-500 ring-2 ring-red-500/40 animate-pulse"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 text-slate-900 dark:text-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950"
                                  : isRetake
                                  ? "bg-purple-600 text-white shadow-sm"
                                  : "bg-indigo-600 text-white"
                              }`}
                            >
                              {candidate.section}
                            </span>
                            <span className="text-xs font-black uppercase">{candidate.courseCode}</span>
                            <span className="text-[11px] opacity-80 font-bold">• {candidate.day}</span>
                          </div>

                          <div className="text-xs font-bold leading-snug line-clamp-1">
                            {candidate.courseTitle || candidate.title}
                          </div>

                          <div className="text-[11px] opacity-75 font-medium">
                            {candidate.timeSlot} {candidate.room ? `| Rm ${candidate.room}` : ""} {candidate.faculty ? `| ${candidate.faculty}` : ""}
                          </div>
                        </div>

                        <div className="flex-shrink-0 pt-0.5">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          ) : candidateClash ? (
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-red-600 text-white flex items-center gap-1 shadow-md shadow-red-600/30 animate-pulse">
                              <XCircle className="w-3.5 h-3.5" /> CRASH
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-500/30 animate-pulse-slow">
                              <CheckCircle2 className="w-3.5 h-3.5" /> GREEN FITS
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Clash details breakdown */}
                      {!isSelected && candidateClash && (
                        <div className="text-[10px] text-red-600 dark:text-red-300 font-extrabold pt-1.5 border-t border-red-300 dark:border-red-900/60 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 animate-bounce" />
                          <span>
                            CRASHES WITH {candidateClash.courseCode || candidateClash.courseTitle} ({candidateClash.section}) on {candidateClash.day} {candidateClash.timeSlot}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
