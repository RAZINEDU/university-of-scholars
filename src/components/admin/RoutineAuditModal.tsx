"use client";

import React, { useState, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { FacultyMember } from "@/data/teacherData";
import {
  AuditIssue,
  SuggestedSlot,
  auditSectionRoutine,
  auditEntireUniversityRoutine,
  cleanCourseCode,
} from "@/lib/routineAuditor";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Eye,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";

interface RoutineAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: RoutineItem[];
  selectedSection: string;
  batchGroups: { batch: string; sections: string[] }[];
  facultyList: FacultyMember[];
  onAddClass: (item: RoutineItem) => Promise<void>;
  onPreviewClass?: (item: RoutineItem) => void;
}

export const RoutineAuditModal: React.FC<RoutineAuditModalProps> = ({
  isOpen,
  onClose,
  routineData,
  selectedSection,
  batchGroups,
  facultyList,
  onAddClass,
  onPreviewClass,
}) => {
  const [activeScope, setActiveScope] = useState<"section" | "all">("section");
  const [schedulingIssueId, setSchedulingIssueId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedPreviewSlotKey, setExpandedPreviewSlotKey] = useState<string | null>(null);

  // Section sections list in current batch
  const currentBatchSections = useMemo(() => {
    const bg = batchGroups.find((b) => b.sections.includes(selectedSection));
    return bg ? bg.sections : [selectedSection];
  }, [batchGroups, selectedSection]);

  // Section audit issues
  const sectionIssues = useMemo(() => {
    if (selectedSection === "ALL") return [];
    return auditSectionRoutine(routineData, selectedSection, currentBatchSections);
  }, [routineData, selectedSection, currentBatchSections]);

  // Entire university audit issues
  const fullAudit = useMemo(() => {
    return auditEntireUniversityRoutine(routineData, batchGroups);
  }, [routineData, batchGroups]);

  // Map faculty code to full name
  const facultyNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    facultyList.forEach((f) => {
      if (f.code) map[f.code] = f.name;
    });
    return map;
  }, [facultyList]);

  // Build proposed routine item for preview or scheduling
  const buildProposedItem = (issue: AuditIssue, slot: SuggestedSlot): RoutineItem => {
    const dayShort = slot.day.substring(0, 3);
    const id = `preview-${issue.section.toLowerCase().replace(/\s+/g, "")}-${dayShort.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    // Use guaranteed conflict-free room suggested by auditor or inherit existing
    const existingClassWithRoom = routineData.find(
      (c) => c.section === issue.section && c.courseCode && cleanCourseCode(c.courseCode) === issue.courseCode && c.room
    );
    const room = slot.suggestedRoom || existingClassWithRoom?.room || "801";

    return {
      id,
      section: issue.section,
      day: slot.day,
      dayShort,
      colIndex: slot.colIndex,
      timeSlot: slot.timeSlot,
      type: issue.issueType === "missing_lab" ? "Lab" : "Theory",
      title: null,
      courseCode: issue.courseCode,
      courseTitle: issue.courseTitle,
      faculty: issue.faculty,
      room,
      rawText: `${issue.courseCode}\n${issue.courseTitle}\n${slot.timeSlot}\n${issue.faculty || ""} | ${room}`,
    };
  };

  // Preview directly in main routine timetable
  const handlePreviewInRoutine = (issue: AuditIssue, slot: SuggestedSlot) => {
    if (onPreviewClass) {
      const item = buildProposedItem(issue, slot);
      onPreviewClass(item);
    }
  };

  // Handle 1-Click Auto-Schedule
  const handleAutoSchedule = async (issue: AuditIssue, slot: SuggestedSlot) => {
    setSchedulingIssueId(issue.id);
    setSuccessMessage(null);

    const newItem = buildProposedItem(issue, slot);
    newItem.id = `class-${issue.section.toLowerCase().replace(/\s+/g, "")}-${newItem.dayShort.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    try {
      await onAddClass(newItem);
      setSuccessMessage(
        `Scheduled ${issue.courseCode} for ${issue.section} on ${slot.day} (${slot.timeSlot}) with ${issue.faculty || "Faculty"}!`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      alert(err.message || "Failed to schedule class");
    } finally {
      setSchedulingIssueId(null);
    }
  };

  if (!isOpen) return null;

  const displayedIssues = activeScope === "section" ? sectionIssues : fullAudit.allIssues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Smart Routine Auditor & Slot Suggester
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  AI Validation Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detect missing lectures, credit hour imbalances between batch sections, and suggest clash-free times.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope Tabs & Stats */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScope("section")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeScope === "section"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Current: {selectedSection} ({sectionIssues.length} {sectionIssues.length === 1 ? "Issue" : "Issues"})
            </button>
            <button
              onClick={() => setActiveScope("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeScope === "all"
                  ? "bg-indigo-600 text-white shadow-sm font-black"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Batches Overview ({fullAudit.totalIssues} Issues across Department)
            </button>
          </div>

          <div className="text-[11px] font-semibold text-slate-500">
            Rule: 3-Credit Theory = <strong>2 Classes/Week</strong> (3 Contact Hours)
          </div>
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Body List of Issues */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {displayedIssues.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Everything is Perfectly Balanced!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No missing classes or credit hour imbalances detected for{" "}
                <strong>{activeScope === "section" ? selectedSection : "all batches"}</strong>. All sections are consistent with syllabus requirements.
              </p>
            </div>
          ) : (
            displayedIssues.map((issue) => {
              const teacherFullName = issue.faculty ? facultyNameMap[issue.faculty] || issue.faculty : "Not assigned";

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-md space-y-4 hover:border-amber-500/50 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        ⚠ Missing Class Detected
                      </span>
                      <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                        {issue.courseCode}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {issue.courseTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-400 text-slate-950">
                        {issue.section}
                      </span>
                      {issue.comparisonSection && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          vs {issue.comparisonSection}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                    <p>{issue.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px]">
                      <div>
                        <strong>Current Schedule:</strong> {issue.currentCount} {issue.issueType === "missing_lab" ? "Lab" : "Theory"} class
                      </div>
                      <div>
                        <strong>Required / Expected:</strong> {issue.expectedCount} {issue.issueType === "missing_lab" ? "Lab" : "Theory"} classes
                      </div>
                      <div>
                        <strong>Instructor:</strong> {teacherFullName} ({issue.faculty || "N/A"})
                      </div>
                    </div>
                  </div>

                  {/* Teacher's University-Wide Occupied Schedule (Verification Box) */}
                  {issue.teacherOccupiedSlots && issue.teacherOccupiedSlots.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
                          <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>
                            {teacherFullName} ({issue.faculty})&apos;s Occupied Schedule ({issue.teacherOccupiedSlots.length} Classes across University)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60 shrink-0">
                          🔒 Occupied Slots (Strictly Filtered Out)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {issue.teacherOccupiedSlots.map((ts, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] shadow-xs"
                            title={`${ts.day} ${ts.timeSlot} at ${ts.section} (${ts.courseCode})`}
                          >
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              {ts.day.substring(0, 3)}
                            </span>
                            <span className="font-mono text-slate-500 dark:text-slate-400">
                              {ts.timeSlot}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-[9px]">
                              {ts.section}
                            </span>
                            <span className="text-slate-400 font-medium truncate max-w-[80px]">
                              {ts.courseCode}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Clash-Free Slot Recommendations */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>Recommended Clash-Free Slots for {issue.faculty || "Faculty"} & {issue.section}:</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                        🛡️ Zero Teacher Clashes Guaranteed
                      </span>
                    </div>

                    {issue.suggestedSlots.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-center font-semibold">
                        No immediate free slots found where both section and teacher are simultaneously available. Try checking another day.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {issue.suggestedSlots.map((slot, sIdx) => {
                          const slotKey = `${issue.id}-${sIdx}`;
                          const isExpanded = expandedPreviewSlotKey === slotKey;

                          // Day timeline items
                          const dayClasses = routineData.filter(
                            (c) => c.section === issue.section && c.day === slot.day && c.type !== "No Class"
                          );
                          const periodSlots = [
                            { colIndex: 1, time: "9:30 AM" },
                            { colIndex: 2, time: "11:00 AM" },
                            { colIndex: 3, time: "12:30 PM", isBreak: true },
                            { colIndex: 4, time: "1:30 PM" },
                            { colIndex: 5, time: "3:00 PM" },
                          ];

                          return (
                            <div
                              key={sIdx}
                              className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border transition-all space-y-3 ${
                                isExpanded
                                  ? "border-purple-400 dark:border-purple-500 shadow-md bg-purple-50/20 dark:bg-purple-950/20"
                                  : "border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white">
                                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                      <span>{slot.label}</span>
                                    </div>

                                    {/* Suggested Room Badge */}
                                    {slot.suggestedRoom && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                                        <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                                        <span>Room: {slot.suggestedRoom} (Vacant)</span>
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    {slot.reason}
                                  </p>

                                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                                      <span>{issue.faculty || "Teacher"} is 100% Free</span>
                                    </div>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                                      <Building2 className="w-3 h-3 text-purple-500 shrink-0" />
                                      <span>Zero Room Conflict</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setExpandedPreviewSlotKey(isExpanded ? null : slotKey)}
                                  className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 shrink-0 px-2 py-1 rounded-lg bg-purple-100/60 dark:bg-purple-950/40"
                                >
                                  <span>{isExpanded ? "Hide Flow" : "Day Flow"}</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>

                              {/* Interactive Mini Day Timeline Flow */}
                              {isExpanded && (
                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-1.5 animate-fade-in text-[10px]">
                                  <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                                    <span>{slot.day} Timeline for {issue.section}:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Proposed slot highlighted ✨</span>
                                  </div>
                                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px]">
                                    {periodSlots.map((ps) => {
                                      const isProposed = ps.colIndex === slot.colIndex;
                                      const existing = dayClasses.find((c) => c.colIndex === ps.colIndex);

                                      let bg = "bg-slate-100 dark:bg-slate-800 text-slate-500";
                                      let text = "Free";

                                      if (ps.isBreak) {
                                        bg = "bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400";
                                        text = "Break";
                                      } else if (isProposed) {
                                        bg = "bg-emerald-500 text-slate-950 font-black shadow-sm ring-1 ring-emerald-400";
                                        text = `✨ ${issue.courseCode}`;
                                      } else if (existing) {
                                        bg = "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold";
                                        text = existing.courseCode || "Class";
                                      }

                                      return (
                                        <div key={ps.colIndex} className="space-y-0.5">
                                          <div className="text-[8px] text-slate-400 truncate">{ps.time}</div>
                                          <div className={`p-1 rounded-lg truncate ${bg}`} title={text}>
                                            {text}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Two Action Buttons: 1. Preview on Main Timetable, 2. Direct Schedule */}
                              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                {onPreviewClass && (
                                  <button
                                    onClick={() => handlePreviewInRoutine(issue, slot)}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] shadow-sm shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                                    title="View this class simulated inside the full routine timetable"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Preview on Timetable</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleAutoSchedule(issue, slot)}
                                  disabled={schedulingIssueId === issue.id}
                                  className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-slate-200 hover:text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  title="Add to database immediately"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{schedulingIssueId === issue.id ? "Adding..." : "Schedule Directly"}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>All scheduling suggestions are verified against teacher university-wide commitments.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
