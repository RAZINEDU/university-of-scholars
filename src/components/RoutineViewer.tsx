"use client";

import React, { useState, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { TEACHER_DIRECTORY } from "@/data/teacherData";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Download,
  X,
  Coffee,
  Building2,
  CalendarOff,
} from "lucide-react";

interface RoutineViewerProps {
  routineData: RoutineItem[];
  selectedSection: string;
  onSectionSelect: (sec: string) => void;
  onOpenExportModal: () => void;
}

// Standard 5 time columns for Sat–Thu
const TIME_SLOTS = [
  { colIndex: 1, label: "9:30 AM - 11:00 AM" },
  { colIndex: 2, label: "11:00 AM - 12:30 PM" },
  { colIndex: 3, label: "12:30 PM - 1:30 PM" },
  { colIndex: 4, label: "1:30 PM - 3:00 PM" },
  { colIndex: 5, label: "3:00 PM - 4:30 PM" },
];

// Friday-specific time slots (7 columns)
const FRIDAY_TIME_SLOTS = [
  { colIndex: 1, label: "9:30 AM - 11:00 AM" },
  { colIndex: 2, label: "11:00 AM - 12:30 PM" },
  { colIndex: 3, label: "12:30 PM - 1:00 PM" },
  { colIndex: 4, label: "1:00 PM - 2:30 PM" },   // Jumu'ah Break
  { colIndex: 5, label: "2:30 PM - 3:30 PM" },
  { colIndex: 6, label: "3:30 PM - 4:00 PM" },
  { colIndex: 7, label: "4:00 PM - 5:00 PM" },
];

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const BATCH_GROUPS = [
  { batch: "13", label: "Batch 13", sections: ["Section 13"] },
  { batch: "14", label: "Batch 14", sections: ["Section 14A", "Section 14B"] },
  { batch: "15", label: "Batch 15", sections: ["Section 15A", "Section 15B"] },
  { batch: "16", label: "Batch 16", sections: ["Section 16"] },
  { batch: "17", label: "Batch 17", sections: ["Section 17A", "Section 17B"] },
  { batch: "18", label: "Batch 18", sections: ["Section 18A", "Section 18B"] },
  { batch: "19", label: "Batch 19", sections: ["Section 19A", "Section 19B", "Section 19C", "Section 19D"] },
  { batch: "20", label: "Batch 20", sections: ["Section 20A", "Section 20B", "Section 20C", "Section 20D", "Section 20E"] },
];

const getBatchFromSection = (sec: string): string => {
  if (sec === "ALL") return "ALL";
  const m = sec.match(/Section\s*(\d+)/i);
  return m ? m[1] : "ALL";
};

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

const getTimeRange = (timeSlot: string | undefined): [number, number] => {
  if (!timeSlot) return [0, 0];
  const parts = timeSlot.split("-");
  if (parts.length < 2) return [0, 0];
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  return [start, end];
};

// Returns colSpan for Sat-Thu
const getColSpan = (colIndex: number, timeSlot: string | undefined): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = TIME_SLOTS.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < TIME_SLOTS.length; k++) {
    const [sStart] = getTimeRange(TIME_SLOTS[k].label);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

// Returns colSpan for Friday
const getFridayColSpan = (colIndex: number, timeSlot: string | undefined): number => {
  if (!timeSlot) return 1;
  const [start, end] = getTimeRange(timeSlot);
  if (start === 0 && end === 0) return 1;

  const startIdx = FRIDAY_TIME_SLOTS.findIndex((s) => s.colIndex === colIndex);
  if (startIdx === -1) return 1;

  let span = 1;
  for (let k = startIdx + 1; k < FRIDAY_TIME_SLOTS.length; k++) {
    const [sStart] = getTimeRange(FRIDAY_TIME_SLOTS[k].label);
    if (end > sStart + 0.05) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

const matchSatThuSlot = (item: RoutineItem, colIndex: number) => {
  if (item.colIndex === colIndex) return true;
  const [start] = getTimeRange(item.timeSlot);
  const slotLabel = TIME_SLOTS.find((s) => s.colIndex === colIndex)?.label;
  if (!slotLabel) return false;
  const [slotStart] = getTimeRange(slotLabel);
  return start > 0 && Math.abs(start - slotStart) < 0.25;
};

const matchFridaySlot = (item: RoutineItem, colIndex: number) => {
  if (item.colIndex === colIndex) return true;
  const [start] = getTimeRange(item.timeSlot);
  const slotLabel = FRIDAY_TIME_SLOTS.find((s) => s.colIndex === colIndex)?.label;
  if (!slotLabel) return false;
  const [slotStart] = getTimeRange(slotLabel);
  return start > 0 && Math.abs(start - slotStart) < 0.25;
};

export const RoutineViewer: React.FC<RoutineViewerProps> = ({
  routineData,
  selectedSection,
  onSectionSelect,
  onOpenExportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedItemDetail, setSelectedItemDetail] = useState<RoutineItem | null>(null);

  const sectionsList = useMemo(() =>
    Array.from(new Set(routineData.map((d) => d.section))).sort()
  , [routineData]);

  const filteredRoutine = useMemo(() => {
    return routineData.filter((item) => {
      if (selectedSection !== "ALL" && item.section !== selectedSection) return false;
      if (selectedDayFilter !== "ALL" && item.day !== selectedDayFilter) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          item.courseCode, item.courseTitle, item.title,
          item.faculty, item.faculty ? TEACHER_DIRECTORY[item.faculty]?.name : "",
          item.room, item.section,
        ].join(" ").toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }, [routineData, selectedSection, selectedDayFilter, typeFilter, searchQuery]);

  const sectionLabel = useMemo(() => {
    if (selectedSection === "ALL") return "All Sections";
    const match = selectedSection.match(/Section\s*(\d+)([A-Z]?)/i);
    if (match) {
      return `Batch: ${match[1]}${match[2] ? `\nSection: ${match[2]}` : ""}`;
    }
    return selectedSection;
  }, [selectedSection]);

  // ── CARD RENDERER ──────────────────────────────────────────────────
  const renderCard = (item: RoutineItem, isWide = false) => {
    const facultyInfo = item.faculty ? TEACHER_DIRECTORY[item.faculty] : null;
    const teacherName = facultyInfo ? facultyInfo.name : item.faculty;
    const isLab = item.type === "Lab";

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

    // NO CLASS card
    if (item.type === "No Class") {
      return (
        <div key={item.id} className="w-full h-full min-h-[130px] flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700/50 text-center px-3 py-3">
          <CalendarOff className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-600">
            {item.title || item.rawText}
          </div>
        </div>
      );
    }

    // Colour palette per type
    const cfg = isLab
      ? {
          wrap: "border-l-4 border-l-sky-500 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/70 hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:border-l-sky-400 hover:shadow-sky-100 dark:hover:shadow-sky-900/20",
          code: "text-sky-600 dark:text-sky-400",
          badge: "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300",
        }
      : {
          wrap: "border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-l-indigo-400 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20",
          code: "text-indigo-600 dark:text-indigo-400",
          badge: "",
        };

    return (
      <div
        key={item.id}
        onClick={() => setSelectedItemDetail(item)}
        className={`
          relative w-full h-full min-h-[130px] rounded-xl
          cursor-pointer transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-md
          flex flex-col justify-between
          p-3 gap-1.5
          ${cfg.wrap}
        `}
      >
        {/* ── TOP: code + type badge ── */}
        <div className="flex items-start justify-between gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${cfg.code}`}>
            {item.courseCode || ""}
          </span>
          {isLab && (
            <span className={`text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0 leading-none ${cfg.badge}`}>
              Lab · 3hr
            </span>
          )}
        </div>

        {/* ── MID: title ── */}
        <div
          className={`flex-1 font-semibold leading-snug text-slate-700 dark:text-slate-200 ${isWide ? "text-[13px]" : "text-[11px]"}`}
          style={{ display: "-webkit-box", WebkitLineClamp: isWide ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {item.courseTitle || item.title || item.rawText}
        </div>

        {/* ── BOTTOM: teacher + section + room ── */}
        <div className="flex flex-col gap-1">
          {teacherName && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
              <User className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{teacherName}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] font-black px-1.5 py-[2px] rounded bg-amber-400 text-slate-900 leading-none">
              {item.section}
            </span>
            {item.room && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
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

    for (let i = 0; i < TIME_SLOTS.length; i++) {
      if (skip > 0) { skip--; continue; }

      const slot = TIME_SLOTS[i];
      const colItems = dayClasses.filter((c) => matchSatThuSlot(c, slot.colIndex));
      const isBreakCol = slot.colIndex === 3; // Lunch break (12:00-1:00)

      // Determine colSpan
      let span = 1;
      colItems.forEach((item) => {
        const s = getColSpan(slot.colIndex, item.timeSlot);
        if (s > span) span = s;
      });

      // Only span if next columns are actually empty
      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = TIME_SLOTS[i + s];
          if (nextSlot && dayClasses.some((c) => matchSatThuSlot(c, nextSlot.colIndex))) {
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

    for (let i = 0; i < FRIDAY_TIME_SLOTS.length; i++) {
      if (skip > 0) { skip--; continue; }

      const slot = FRIDAY_TIME_SLOTS[i];
      const colItems = dayClasses.filter((c) => matchFridaySlot(c, slot.colIndex));
      const isBreakCol = slot.colIndex === 3 || slot.colIndex === 4; // 12:30-1:00 or 1:00-2:30 Jumu'ah Break

      let span = 1;
      colItems.forEach((item) => {
        const s = getFridayColSpan(slot.colIndex, item.timeSlot);
        if (s > span) span = s;
      });

      if (span > 1) {
        let canSpan = true;
        for (let s = 1; s < span; s++) {
          const nextSlot = FRIDAY_TIME_SLOTS[i + s];
          if (nextSlot && dayClasses.some((c) => matchFridaySlot(c, nextSlot.colIndex))) {
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
    <div className="w-full space-y-6">
      {/* ── FILTER BAR ────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:hidden">
        
        {/* Top Filter Row: Specific Section Filter & Search */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          
          {/* Enhanced Section Filter */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Specific Section Filter:
                </span>
              </div>

              {/* Direct Grouped Dropdown */}
              <select
                value={selectedSection}
                onChange={(e) => onSectionSelect(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-xs"
              >
                {BATCH_GROUPS.map((bg) => (
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

            {/* Batch Filter Pills (flex-wrap, NO side-scroll!) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Batch:</span>
              {BATCH_GROUPS.map((bg) => {
                const isBatchActive = getBatchFromSection(selectedSection) === bg.batch;

                return (
                  <button
                    key={bg.batch}
                    onClick={() => {
                      if (bg.sections && bg.sections.length > 0) {
                        onSectionSelect(bg.sections[0]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isBatchActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {bg.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-Section Pills for the Active Batch */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Sub-Section:</span>
              {sectionsList
                .filter((sec) => getBatchFromSection(sec) === getBatchFromSection(selectedSection))
                .map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onSectionSelect(sec)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      selectedSection === sec
                        ? "bg-amber-400 text-slate-950 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72 self-start">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course, teacher, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Day", value: selectedDayFilter, setter: setSelectedDayFilter, options: [["ALL","All Days"], ...WEEKDAYS.map(d=>[d,d])] },
              { label: "Type", value: typeFilter, setter: setTypeFilter, options: [["ALL","All Classes"],["Theory","Theory"],["Lab","Lab"],["Break","Breaks"]] },
            ].map(({ label, value, setter, options }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">{label}:</span>
                <select value={value} onChange={(e) => setter(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer text-sm">
                  {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              Found <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredRoutine.length}</span> items
            </span>
            <button onClick={onOpenExportModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all">
              <Download className="w-4 h-4" /> Export &amp; Print
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE EXCLUSIVE VIEW (VERTICAL CARDS - 0 SIDE SCROLL) ────────────────── */}
      <div className="block md:hidden space-y-4 print:hidden">
        {WEEKDAYS.map((dayName) => {
          if (selectedDayFilter !== "ALL" && selectedDayFilter !== dayName) return null;

          const dayClasses = filteredRoutine.filter((item) => item.day === dayName);
          const actualClasses = dayClasses.filter((c) => c.type !== "Break" && c.type !== "No Class");
          const isOffDay = dayClasses.length > 0 && dayClasses.every((c) => c.type === "No Class");

          return (
            <div key={dayName} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">{dayName}</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                  {isOffDay ? "Off Day" : `${actualClasses.length} ${actualClasses.length === 1 ? "Class" : "Classes"}`}
                </span>
              </div>

              {/* Day Content */}
              {isOffDay ? (
                <div className="py-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-2 text-slate-400">
                  <CalendarOff className="w-5 h-5 opacity-60" />
                  <span className="text-xs font-bold">No Classes Scheduled</span>
                </div>
              ) : actualClasses.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">No classes match filter</div>
              ) : (
                <div className="space-y-2.5">
                  {actualClasses.map((item) => {
                    const facultyInfo = item.faculty ? TEACHER_DIRECTORY[item.faculty] : null;
                    const teacherName = facultyInfo ? facultyInfo.name : item.faculty;
                    const isLab = item.type === "Lab";

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemDetail(item)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 active:scale-[0.99] ${
                          isLab
                            ? "border-l-4 border-l-sky-500 border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20"
                            : "border-l-4 border-l-indigo-500 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60"
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                          <span className="flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                            <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            {item.timeSlot}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                              {item.section}
                            </span>
                            {isLab && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-sky-500 text-white">
                                Lab · 3hr
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          {item.courseCode && (
                            <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                              {item.courseCode}
                            </div>
                          )}
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {item.courseTitle || item.title || item.rawText}
                          </h4>
                        </div>

                        {/* Instructor & Location */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {teacherName ? (
                            <div className="flex items-center gap-1.5 truncate">
                              <User className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                              <span className="truncate">{teacherName}</span>
                            </div>
                          ) : <div />}
                          {item.room && (
                            <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>Room {item.room}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP EXCLUSIVE MATRIX TABLE (SECTION 15B PDF FORMAT) ────────────────────── */}
      <div className="hidden md:block print:block rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-full print:shadow-none print:border-none print:overflow-visible">
        <div className="w-full max-w-full overflow-x-auto scrollbar-thin print:overflow-visible">
          <table className="w-full border-collapse text-left table-fixed print:[color-adjust:exact] print:[-webkit-print-color-adjust:exact]" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
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
                <th className="px-3 py-3.5 border-r border-blue-800 dark:border-indigo-800 align-middle">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mb-0.5">Day</div>
                  <div className="text-xs font-black text-white whitespace-pre-line leading-snug">{sectionLabel}</div>
                </th>
                {TIME_SLOTS.map((slot) => (
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
                if (selectedDayFilter !== "ALL" && selectedDayFilter !== dayName) return null;

                const dayClasses = filteredRoutine.filter((item) => item.day === dayName);
                const isOffDay = dayClasses.length > 0 && dayClasses.every((c) => c.type === "No Class");
                const offDayItem = isOffDay ? dayClasses[0] : null;
                const isFriday = dayName === "Friday";

                if (isFriday) {
                  return (
                    <React.Fragment key={dayName}>
                      {/* ── FRIDAY HEADER ROW ("Fri time") ─── */}
                      <tr className="bg-[#1E3A8A] text-white dark:bg-indigo-950 border-t-2 border-b border-blue-900">
                        <th className="px-3 py-3 border-r border-blue-800 dark:border-indigo-800 align-middle text-center">
                          <div className="text-xs font-black text-amber-300 uppercase tracking-wider">Fri time</div>
                        </th>
                        {FRIDAY_TIME_SLOTS.map((slot) => (
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
                        <td className="px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100/60 dark:bg-slate-900/60">
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
                      <td className="px-3 py-4 border-r border-slate-200 dark:border-slate-800 align-middle text-center bg-slate-100/60 dark:bg-slate-900/60">
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

      {/* ── DETAIL MODAL ──────────────────────────────────── */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                {selectedItemDetail.section}
              </span>
              <button onClick={() => setSelectedItemDetail(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                {selectedItemDetail.courseCode && (
                  <div className="text-sm font-black text-amber-500 uppercase tracking-widest mb-1">
                    {selectedItemDetail.courseCode}
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedItemDetail.courseTitle || selectedItemDetail.title || selectedItemDetail.rawText}
                </h3>
                <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  selectedItemDetail.type === "Lab"
                    ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}>
                  {selectedItemDetail.type} Class
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Time</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {selectedItemDetail.timeSlot}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Day</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {selectedItemDetail.day}
                  </span>
                </div>
              </div>

              {selectedItemDetail.room && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    Room {selectedItemDetail.room}
                  </span>
                </div>
              )}

              {selectedItemDetail.faculty && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex gap-4 items-center">
                  {TEACHER_DIRECTORY[selectedItemDetail.faculty]?.imageUrl ? (
                    <img 
                      src={TEACHER_DIRECTORY[selectedItemDetail.faculty].imageUrl}
                      alt={TEACHER_DIRECTORY[selectedItemDetail.faculty].name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm border-2 border-indigo-200 dark:border-indigo-800 flex-shrink-0 bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-200 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-500 font-bold uppercase tracking-wider block mb-1">Instructor</span>
                    <span className="text-base font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                      {TEACHER_DIRECTORY[selectedItemDetail.faculty]?.name || selectedItemDetail.faculty}
                    </span>
                    {TEACHER_DIRECTORY[selectedItemDetail.faculty] && (
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                        {TEACHER_DIRECTORY[selectedItemDetail.faculty].designation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
