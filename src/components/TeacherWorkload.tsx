"use client";

import React, { useState, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { TEACHER_DIRECTORY } from "@/data/teacherData";
import { 
  UserCheck, 
  Search, 
  Clock, 
  Calendar, 
  Building2, 
  Filter,
  Phone,
  Mail,
  Copy,
  Check
} from "lucide-react";

interface TeacherWorkloadProps {
  routineData: RoutineItem[];
}

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getRankWeight = (code: string): number => {
  const des = TEACHER_DIRECTORY[code]?.designation || "";
  if (des.includes("Head of the Department") || des.includes("Head")) return 1;
  if (des.includes("Director IQAC")) return 2;
  if (des.includes("Professor") && !des.includes("Associate") && !des.includes("Assistant")) return 3;
  if (des.includes("Associate Professor")) return 4;
  if (des.includes("Assistant Professor")) return 5;
  if (des.includes("Senior Lecturer")) return 6;
  if (des.includes("Lecturer")) return 7;
  if (des.includes("Research Assistant")) return 8;
  return 9;
};

export const TeacherWorkload: React.FC<TeacherWorkloadProps> = ({ routineData }) => {
  const [selectedTeacherCode, setSelectedTeacherCode] = useState<string>("MAA");
  const [teacherSearch, setTeacherSearch] = useState<string>("");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("ALL");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Get unique teachers list sorted by official rank & seniority
  const teachersList = useMemo(() => {
    const set = new Set<string>();
    routineData.forEach((item) => {
      if (item.faculty) {
        set.add(item.faculty);
      }
    });

    return Array.from(set).sort((a, b) => {
      const rankA = getRankWeight(a);
      const rankB = getRankWeight(b);
      if (rankA !== rankB) return rankA - rankB;
      const nameA = TEACHER_DIRECTORY[a]?.name || a;
      const nameB = TEACHER_DIRECTORY[b]?.name || b;
      return nameA.localeCompare(nameB);
    });
  }, [routineData]);

  // Filtered teachers list matching search
  const filteredTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return teachersList;
    const q = teacherSearch.toLowerCase();
    return teachersList.filter((code) => {
      const info = TEACHER_DIRECTORY[code];
      const name = info ? info.name.toLowerCase() : "";
      return code.toLowerCase().includes(q) || name.includes(q);
    });
  }, [teachersList, teacherSearch]);

  // All classes for selected teacher
  const allTeacherClasses = useMemo(() => {
    return routineData.filter((item) => item.faculty === selectedTeacherCode);
  }, [routineData, selectedTeacherCode]);

  // Filtered classes by day
  const filteredTeacherClasses = useMemo(() => {
    return allTeacherClasses.filter((item) => {
      if (selectedDayFilter !== "ALL" && item.day !== selectedDayFilter) return false;
      return true;
    });
  }, [allTeacherClasses, selectedDayFilter]);

  const teacherInfo = TEACHER_DIRECTORY[selectedTeacherCode];

  // Stats
  const theoryCount = allTeacherClasses.filter((c) => c.type === "Theory").length;
  const labCount = allTeacherClasses.filter((c) => c.type === "Lab").length;
  const uniqueSections = Array.from(new Set(allTeacherClasses.map((c) => c.section)));

  return (
    <div className="w-full space-y-6 animate-fade-in">

      {/* ── HEADER & SEARCH BAR ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border border-indigo-500/20 space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" />
              Faculty Timetable & Serial Schedule Engine
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Teacher Workload Routine</h2>
            <p className="text-sm text-slate-300 mt-1">
              Select any faculty member to view their complete serial schedule structured by Day, Time & Section.
            </p>
          </div>

          {/* Teacher Selection Dropdown */}
          <div className="w-full md:w-80 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Select Faculty:
            </label>
            <select
              value={selectedTeacherCode}
              onChange={(e) => setSelectedTeacherCode(e.target.value)}
              className="w-full bg-slate-900 text-amber-300 font-extrabold px-3.5 py-2.5 rounded-xl border border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-xs sm:text-sm shadow-md"
            >
              {teachersList.map((code) => {
                const info = TEACHER_DIRECTORY[code];
                const displayName = info ? `${info.name} (${code})` : code;
                return (
                  <option key={code} value={code}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Quick Filter Search & Teacher Pills Bar */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search teacher by name or shortcode..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
              />
            </div>

            {/* Quick stats badge */}
            <div className="text-xs text-slate-300 font-medium">
              Showing <span className="text-amber-400 font-bold">{filteredTeachers.length}</span> faculty members
            </div>
          </div>

          {/* Teacher Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 max-h-36 overflow-y-auto pr-1">
            {filteredTeachers.map((code) => {
              const isActive = selectedTeacherCode === code;
              const info = TEACHER_DIRECTORY[code];
              return (
                <button
                  key={code}
                  onClick={() => setSelectedTeacherCode(code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-105"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  <span>{code}</span>
                  {info && (
                    <span className="text-[10px] opacity-75 font-normal">
                      ({info.name.split(" ")[0]})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── SELECTED TEACHER PROFILE & STATS BAR ───────────────────── */}
      {selectedTeacherCode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Profile Details */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {teacherInfo?.imageUrl ? (
              <img 
                src={teacherInfo.imageUrl} 
                alt={teacherInfo.name} 
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white object-cover shadow-md border-2 border-indigo-100 dark:border-indigo-900/50 flex-shrink-0"
              />
            ) : null}
            <div 
              style={{ display: teacherInfo?.imageUrl ? "none" : "flex" }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-600 text-white items-center justify-center text-3xl font-black shadow-md shadow-indigo-600/30 flex-shrink-0"
            >
              {selectedTeacherCode}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {teacherInfo ? teacherInfo.name : selectedTeacherCode}
              </h3>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {teacherInfo ? teacherInfo.designation : "Faculty Member"} • {teacherInfo ? teacherInfo.department : "Department of CSE"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 pt-0.5">
                Assigned to <span className="font-bold text-slate-700 dark:text-slate-300">{uniqueSections.length} Sections</span> ({uniqueSections.length > 0 ? uniqueSections.join(", ") : "None scheduled"})
              </p>

              {/* Direct Contact details if available */}
              {(teacherInfo?.phone || teacherInfo?.email) && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {teacherInfo.phone && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <a href={`tel:${teacherInfo.phone.replace(/[^0-9]/g, "")}`} className="hover:underline font-mono">
                        {teacherInfo.phone}
                      </a>
                      <button
                        onClick={() => handleCopy(teacherInfo.phone || "", "phone")}
                        title="Copy Phone"
                        className="text-emerald-600 hover:text-emerald-800 ml-0.5"
                      >
                        {copiedKey === "phone" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  {teacherInfo.email && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-bold">
                      <Mail className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <a href={`mailto:${teacherInfo.email}`} className="hover:underline font-mono truncate max-w-[200px]">
                        {teacherInfo.email}
                      </a>
                      <button
                        onClick={() => handleCopy(teacherInfo.email || "", "email")}
                        title="Copy Email"
                        className="text-indigo-600 hover:text-indigo-800 ml-0.5"
                      >
                        {copiedKey === "email" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Stat Counters */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-around">
            <div className="text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white block">
                {allTeacherClasses.length}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Classes</span>
            </div>

            <div className="h-9 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

            <div className="text-center">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
                {theoryCount}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bold">Theory</span>
            </div>

            <div className="h-9 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

            <div className="text-center">
              <span className="text-2xl font-black text-sky-500 block">
                {labCount}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bold">Lab Sessions</span>
            </div>
          </div>

        </div>
      )}

      {/* ── DAY FILTER CONTROL BAR ───────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Filter Schedule by Day:
          </span>
        </div>

        {/* Day Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", ...WEEKDAYS].map((dayName) => {
            const isActive = selectedDayFilter === dayName;
            return (
              <button
                key={dayName}
                onClick={() => setSelectedDayFilter(dayName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {dayName === "ALL" ? "All Days" : dayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SERIALIZED WEEKLY SCHEDULE BY DAY & SECTION ────────────── */}
      <div className="space-y-4">
        
        {filteredTeacherClasses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Classes Scheduled for {selectedTeacherCode} {selectedDayFilter !== "ALL" ? `on ${selectedDayFilter}` : ""}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try selecting another day or another faculty member from the dropdown above.
            </p>
          </div>
        ) : (
          WEEKDAYS.map((dayName) => {
            if (selectedDayFilter !== "ALL" && selectedDayFilter !== dayName) return null;

            const dayClasses = allTeacherClasses
              .filter((item) => item.day === dayName)
              .sort((a, b) => a.colIndex - b.colIndex);

            if (dayClasses.length === 0) return null;

            return (
              <div
                key={dayName}
                className="rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden"
              >
                {/* Day Header Banner */}
                <div className="bg-indigo-700 dark:bg-indigo-950 px-5 py-3.5 flex items-center justify-between text-white border-b border-indigo-600 dark:border-indigo-800/80">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-sm tracking-wide">{dayName}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {dayClasses.length} {dayClasses.length === 1 ? "Class" : "Classes"}
                    </span>
                  </div>

                  <span className="text-xs text-indigo-200 font-semibold hidden sm:inline-block">
                    Faculty: <span className="font-bold text-white">{selectedTeacherCode}</span>
                  </span>
                </div>

                {/* Serialized Class Items */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {dayClasses.map((item, idx) => {
                    const isLab = item.type === "Lab";

                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          isLab
                            ? "bg-sky-50/40 dark:bg-sky-950/10 hover:bg-sky-50 dark:hover:bg-sky-950/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        {/* Serial Number & Time Slot */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center flex-shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{item.timeSlot}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                              Period Slot {item.colIndex}
                            </span>
                          </div>
                        </div>

                        {/* Batch / Section & Course Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-black tracking-wide">
                              {item.section}
                            </span>

                            {item.courseCode && (
                              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
                                {item.courseCode}
                              </span>
                            )}

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isLab
                                  ? "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300"
                                  : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                              }`}
                            >
                              {item.type} {isLab ? "· 3 Hours" : ""}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {item.courseTitle || item.title || item.rawText}
                          </h4>
                        </div>

                        {/* Room Location */}
                        <div className="flex items-center gap-2 sm:self-center">
                          {item.room ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Room {item.room}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">No Room Specified</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

      </div>

    </div>
  );
};
