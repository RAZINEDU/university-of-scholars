"use client";

import React, { useState, useEffect, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { FacultyMember } from "@/data/teacherData";
import { intervalsOverlap } from "@/lib/routineAuditor";
import { X, Save, Plus, BookOpen, Clock, Calendar, MapPin, User, CheckCircle2, AlertTriangle } from "lucide-react";

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: RoutineItem) => Promise<void>;
  initialData?: RoutineItem | null;
  facultyList: FacultyMember[];
  sectionsList: string[];
  routineData?: RoutineItem[];
}

const COMMON_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COMMON_TIMES = [
  "09:30-11:00",
  "09:30-12:30",
  "11:00-12:30",
  "12:30 PM - 1:30 PM",
  "01:30-03:00",
  "01:30-04:30",
  "03:00-04:30",
  "04:30-06:00",
  "01:00-02:30",
  "02:30-03:30",
  "03:30-04:00",
  "04:00-05:00",
];

const computeColIndex = (day: string, timeSlot: string, currentExplicitCol = 1): number => {
  if (!timeSlot) return currentExplicitCol || 1;
  const t = timeSlot.toLowerCase();
  const isFriday = day.toLowerCase() === "friday";

  if (isFriday) {
    if (t.includes("09:30") || t.includes("9:30")) return 1;
    if (t.includes("11:00")) return 2;
    if (t.includes("12:30")) return 3;
    if (t.includes("01:00") || t.includes("1:00")) return 4;
    if (t.includes("01:30") || t.includes("1:30")) return 4;
    if (t.includes("02:30") || t.includes("2:30")) return 5;
    if (t.includes("03:30") || t.includes("3:30")) return 6;
    if (t.includes("04:00") || t.includes("4:00")) return 7;
    return currentExplicitCol || 1;
  }

  // Sat-Thu
  if (t.includes("09:30") || t.includes("9:30")) return 1;
  if (t.includes("11:00")) return 2;
  if (t.includes("12:30") || t.includes("12:00")) return 3;
  if (t.includes("01:30") || t.includes("1:30")) return 4;
  if (t.includes("03:00") || t.includes("3:00")) return 5;
  if (t.includes("04:30") || t.includes("4:30")) return 6;
  return currentExplicitCol || 1;
};

const COMMON_ROOMS = [
  "1502",
  "1503 (Lab 1)",
  "1703 (Lab 2)",
  "2001",
  "2004",
  "801",
  "802",
  "902",
  "1103",
  "1202",
];

const KNOWN_COURSES: Record<string, string> = {
  "CSE 4125": "Software Engineering",
  "CSE 4126": "Software Engineering Lab",
  "CSE 3253": "Microprocessor & Assembly Language",
  "CSE 3254": "Microprocessor & Assembly Language Lab",
  "CSE 2141": "Object Oriented Programming",
  "CSE 2142": "Object Oriented Programming Lab",
  "CSE 3131": "Operating Systems",
  "CSE 3132": "Operating Systems Lab",
  "CSE 3219": "Compiler Design",
  "CSE 3220": "Compiler Design Lab",
  "HUM 3103": "Industrial Management & Accounting",
  "EEE 2113": "Electrical & Electronic Circuits",
  "EEE 2114": "Electrical & Electronic Circuits Lab",
  "MATH 1111": "Differential & Integral Calculus",
  "CSE 4148": "Technical Writing & Seminar",
  "CSE 4149": "Web Programming",
  "CSE 4150": "Web Programming Lab",
};

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  facultyList,
  sectionsList,
  routineData = [],
}) => {
  const [formData, setFormData] = useState<Partial<RoutineItem>>({
    section: "Section 1",
    day: "Saturday",
    dayShort: "Sat",
    colIndex: 1,
    timeSlot: "11:00-12:30",
    type: "Theory",
    courseCode: "",
    courseTitle: "",
    faculty: "",
    room: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

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

  const getSlotRange = (timeSlot: string | undefined): [number, number] => {
    if (!timeSlot) return [0, 0];
    const normalized = timeSlot.replace(/[–—]/g, "-");
    const parts = normalized.split("-");
    if (parts.length < 2) return [0, 0];
    return [parseTime(parts[0].trim()), parseTime(parts[1].trim())];
  };

  // Live Room Conflict Detection across the whole university
  const roomClash = useMemo(() => {
    if (!routineData || routineData.length === 0 || !formData.room || !formData.day || !formData.timeSlot) {
      return null;
    }
    const roomNorm = formData.room.trim().toLowerCase();
    if (!roomNorm || roomNorm === "tba") return null;

    const candRange = getSlotRange(formData.timeSlot);
    if (candRange[0] === 0 || candRange[1] === 0) return null;

    return routineData.find((c) => {
      if (initialData?.id && c.id === initialData.id) return false;
      if (formData.id && c.id === formData.id) return false;
      if (c.type === "Break" || c.type === "No Class") return false;
      if (!c.room || c.room.trim().toLowerCase() !== roomNorm) return false;
      if (c.day?.toLowerCase() !== formData.day?.toLowerCase()) return false;

      const cRange = getSlotRange(c.timeSlot);
      return intervalsOverlap(candRange, cRange);
    });
  }, [routineData, formData.room, formData.day, formData.timeSlot, formData.id, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        id: "class-" + Date.now(),
        section: sectionsList[0] || "Section 1",
        day: "Saturday",
        dayShort: "Sat",
        colIndex: 1,
        timeSlot: "11:00-12:30",
        type: "Theory",
        courseCode: "",
        courseTitle: "",
        faculty: "",
        room: "",
      });
    }
  }, [initialData, isOpen, sectionsList]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.section || !formData.day || !formData.timeSlot) {
      setError("Please fill in Section, Day and Time Slot");
      return;
    }

    setIsSaving(true);
    setError("");

    const dayShort = (formData.day || "Sat").substring(0, 3);
    const id =
      formData.id ||
      `${formData.section?.toLowerCase().replace(/\s+/g, "")}-${dayShort.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    const computedCol = computeColIndex(formData.day!, formData.timeSlot!, formData.colIndex);

    const completeItem: RoutineItem = {
      id,
      section: formData.section!,
      day: formData.day!,
      dayShort,
      colIndex: computedCol,
      timeSlot: formData.timeSlot!.trim(),
      type: formData.type || "Theory",
      title: formData.title || formData.rawText || null,
      courseCode: formData.courseCode ? formData.courseCode.toUpperCase().trim() : null,
      courseTitle: formData.courseTitle ? formData.courseTitle.trim() : null,
      faculty: formData.faculty ? formData.faculty.toUpperCase().trim() : null,
      room: formData.room ? formData.room.trim() : null,
      rawText: formData.type === "No Class" || formData.type === "Break"
        ? (formData.title || formData.rawText || "No Classes Scheduled")
        : `${formData.courseCode || ""}\n${formData.courseTitle || ""}\n${formData.timeSlot || ""}\n${formData.faculty || ""} | ${formData.room || ""}`,
    };

    try {
      await onSave(completeItem);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || "Failed to save class");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>{initialData ? "Edit Class Schedule" : "Add New Class"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure timing, course codes, instructors, and room allocation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Section */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section *
              </label>
              <input
                type="text"
                list="sections-datalist"
                required
                value={formData.section || ""}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g. Section 13"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="sections-datalist">
                {sectionsList.map((sec) => (
                  <option key={sec} value={sec} />
                ))}
              </datalist>
            </div>

            {/* Day */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week *
              </label>
              <select
                value={formData.day || "Saturday"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    day: e.target.value,
                    dayShort: e.target.value.substring(0, 3),
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {COMMON_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Time Slot *
              </label>
              <input
                type="text"
                list="times-datalist"
                required
                value={formData.timeSlot || ""}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g. 11:00-12:30 or 1:30-4:30"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="times-datalist">
                {COMMON_TIMES.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>

            {/* Type */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Class Type *
              </label>
              <select
                value={formData.type || "Theory"}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Theory">Theory</option>
                <option value="Lab">Lab (Practical)</option>
                <option value="Break">Break / Lunch</option>
                <option value="No Class">No Class / Off-Day</option>
              </select>
            </div>

            {/* Title / Reason (Displayed prominently if No Class or Break) */}
            {(formData.type === "No Class" || formData.type === "Break") && (
              <div className="md:col-span-2">
                <label className="block font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {formData.type === "No Class" ? "Off-Day Reason / Banner Title *" : "Break Title / Label *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || formData.rawText || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, rawText: e.target.value })}
                  placeholder={formData.type === "No Class" ? "e.g. No Classes Scheduled, Govt Holiday" : "e.g. Lunch Break"}
                  className="w-full p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Course Code */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={formData.courseCode || ""}
                onChange={(e) => {
                  const code = e.target.value.toUpperCase();
                  const update: Partial<RoutineItem> = { courseCode: code };
                  const matched = KNOWN_COURSES[code.trim()];
                  if (matched && (!formData.courseTitle || Object.values(KNOWN_COURSES).includes(formData.courseTitle))) {
                    update.courseTitle = matched;
                    if (code.includes("LAB") || matched.toLowerCase().includes("lab")) {
                      update.type = "Lab";
                    }
                  }
                  setFormData((prev) => ({ ...prev, ...update }));
                }}
                placeholder="e.g. CSE 4125, MAT 1101"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>

            {/* Course Title */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Title / Subject Name
              </label>
              <input
                type="text"
                value={formData.courseTitle || ""}
                onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                placeholder="e.g. Software Engineering"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Faculty Initial */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Initials / Code
              </label>
              <div className="space-y-1">
                <input
                  type="text"
                  list="faculty-datalist"
                  value={formData.faculty || ""}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value.toUpperCase() })}
                  placeholder="e.g. MNI, TH, RBS, MAA"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 uppercase"
                />
                <datalist id="faculty-datalist">
                  {facultyList.map((f) => (
                    <option key={f.code} value={f.code}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </datalist>

                {/* Live Faculty Match Preview Badge */}
                {formData.faculty && (() => {
                  const fObj = facultyList.find((f) => f.code.toUpperCase() === formData.faculty?.toUpperCase().trim());
                  if (!fObj) return null;
                  return (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-700 dark:text-purple-300 animate-fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="font-bold truncate">{fObj.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">({fObj.designation || fObj.code})</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Room */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Room Number / Lab
              </label>
              <input
                type="text"
                list="rooms-datalist"
                value={formData.room || ""}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. 801, 802, 1502, 1503 (Lab 1)"
                className={`w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 ${
                  roomClash ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-700"
                }`}
              />
              <datalist id="rooms-datalist">
                {COMMON_ROOMS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>

              {/* Live Room Conflict Alert */}
              {roomClash && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] animate-fade-in mt-1.5 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold flex items-center gap-1">
                      <span>Room Overlap Detected!</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                      Room <strong>{formData.room}</strong> is already booked by <strong>{roomClash.section}</strong> ({roomClash.courseCode || roomClash.title || "Class"}) on {formData.day} ({roomClash.timeSlot})!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lab Auto-Span Helper Tip */}
            {formData.type === "Lab" && (
              <div className="md:col-span-2 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-medium flex items-center gap-2">
                <span className="font-bold">💡 Lab Tip:</span>
                <span>Lab sessions are typically 3 hours long (e.g. 09:30-12:30 or 1:30-4:30). The timetable card will span multiple columns automatically in the routine grid.</span>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : initialData ? "Update Class" : "Create Class"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
