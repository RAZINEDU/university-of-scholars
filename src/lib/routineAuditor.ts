import { RoutineItem, TimeSlotConfig } from "@/types/routine";

export interface AuditIssue {
  id: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  batch: string;
  faculty: string | null;
  facultyName?: string;
  issueType: "missing_theory" | "missing_lab" | "batch_imbalance" | "teacher_clash";
  severity: "high" | "medium" | "info";
  title: string;
  description: string;
  currentCount: number;
  expectedCount: number;
  comparisonSection?: string;
  teacherOccupiedSlots: TeacherScheduleSlot[];
  suggestedSlots: SuggestedSlot[];
}

export interface SuggestedSlot {
  day: string;
  timeSlot: string;
  colIndex: number;
  label: string;
  score: number; // Higher is better (e.g. balances student load)
  reason: string;
  suggestedRoom: string;
  availableRooms: string[];
}

export interface TeacherScheduleSlot {
  day: string;
  timeSlot: string;
  colIndex: number;
  section: string;
  courseCode: string;
  room: string;
}

const DEFAULT_SAT_THU_SLOTS = [
  { colIndex: 1, label: "9:30 AM - 11:00 AM", slotString: "09:30-11:00", isBreak: false },
  { colIndex: 2, label: "11:00 AM - 12:30 PM", slotString: "11:00-12:30", isBreak: false },
  { colIndex: 3, label: "12:30 PM - 1:30 PM", slotString: "12:30 PM - 1:30 PM", isBreak: true },
  { colIndex: 4, label: "1:30 PM - 3:00 PM", slotString: "01:30-03:00", isBreak: false },
  { colIndex: 5, label: "3:00 PM - 4:30 PM", slotString: "03:00-04:30", isBreak: false },
];

const DEFAULT_FRIDAY_SLOTS = [
  { colIndex: 1, label: "9:30 AM - 11:00 AM", slotString: "09:30-11:00", isBreak: false },
  { colIndex: 2, label: "11:00 AM - 12:30 PM", slotString: "11:00-12:30", isBreak: false },
  { colIndex: 3, label: "12:30 PM - 1:00 PM", slotString: "12:30-01:00", isBreak: false },
  { colIndex: 4, label: "1:00 PM - 2:30 PM", slotString: "01:00-02:30", isBreak: true },
  { colIndex: 5, label: "2:30 PM - 3:30 PM", slotString: "02:30-03:30", isBreak: false },
  { colIndex: 6, label: "3:30 PM - 4:00 PM", slotString: "03:30-04:00", isBreak: false },
  { colIndex: 7, label: "4:00 PM - 5:00 PM", slotString: "04:00-05:00", isBreak: false },
];

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Normalize course code like "CSE 4125 (+15B)" -> "CSE 4125"
export function cleanCourseCode(code: string | null | undefined): string {
  if (!code) return "";
  const base = code.replace(/\s*\(\+[^)]+\)/gi, "").trim();
  const parts = base.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].toUpperCase()} ${parts[1]}`;
  }
  return base.toUpperCase();
}

// Time parser
function parseTime(t: string): number {
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
}

function getTimeRange(timeSlot: string | undefined): [number, number] {
  if (!timeSlot) return [0, 0];
  const normalized = timeSlot.replace(/[–—]/g, "-");
  const parts = normalized.split("-");
  if (parts.length < 2) return [0, 0];
  return [parseTime(parts[0].trim()), parseTime(parts[1].trim())];
}

// Checks if two time intervals overlap
export function intervalsOverlap(
  range1: [number, number],
  range2: [number, number]
): boolean {
  const [s1, e1] = range1;
  const [s2, e2] = range2;
  if (s1 === 0 || e1 === 0 || s2 === 0 || e2 === 0) return false;
  return Math.max(s1, s2) < Math.min(e1, e2);
}

// Extract batch number e.g. "Section 15A" -> "15"
export function extractBatchFromSection(sec: string): string {
  const m = sec.match(/Section\s*(\d+)/i);
  return m ? m[1] : "Custom";
}

const DAY_ORDER: Record<string, number> = {
  Saturday: 1,
  Sunday: 2,
  Monday: 3,
  Tuesday: 4,
  Wednesday: 5,
  Thursday: 6,
  Friday: 7,
};

/**
 * Get all classes taught by a teacher across the entire institution (sorted chronologically)
 */
export function getTeacherWeeklySchedule(
  routineData: RoutineItem[],
  facultyCode: string
): TeacherScheduleSlot[] {
  if (!facultyCode) return [];
  const codeNorm = facultyCode.toUpperCase().trim();

  const matches = routineData.filter((item) => {
    if (item.type === "Break" || item.type === "No Class") return false;
    if (!item.faculty) return false;
    const facClean = item.faculty.toUpperCase().trim();
    if (facClean === codeNorm) return true;
    const facParts = facClean.split(/[/,;&+]/).map((s) => s.trim());
    if (facParts.includes(codeNorm)) return true;
    if (item.rawText) {
      const regex = new RegExp(`\\b${codeNorm}\\b`, "i");
      if (regex.test(item.rawText)) return true;
    }
    return false;
  });

  return matches
    .map((c) => ({
      day: c.day,
      timeSlot: c.timeSlot,
      colIndex: c.colIndex,
      section: c.section,
      courseCode: cleanCourseCode(c.courseCode) || c.title || "Class",
      room: c.room || "Room TBA",
    }))
    .sort((a, b) => {
      const dDiff = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
      if (dDiff !== 0) return dDiff;
      const [aStart] = getTimeRange(a.timeSlot);
      const [bStart] = getTimeRange(b.timeSlot);
      return aStart - bStart;
    });
}

/**
 * Get all known classrooms and computer labs across the department
 */
export function getAllUniversityRooms(routineData: RoutineItem[]): string[] {
  const rooms = new Set<string>();
  routineData.forEach((r) => {
    if (r.room && r.room.trim() && r.room.toUpperCase() !== "TBA") {
      rooms.add(r.room.trim());
    }
  });
  // Ensure common classrooms and labs are always included
  [
    "801",
    "802",
    "803",
    "804",
    "805",
    "902",
    "903",
    "1103",
    "1202",
    "1402",
    "1502",
    "1503 (Lab 1)",
    "1701",
    "1703 (Lab 2)",
    "1704",
    "2001",
    "2004",
  ].forEach((r) => rooms.add(r));
  return Array.from(rooms).sort();
}

/**
 * Get all rooms occupied across the ENTIRE university at a given day and time slot
 */
export function getOccupiedRoomsAtSlot(
  routineData: RoutineItem[],
  day: string,
  candidateTimeSlot: string
): { room: string; section: string; courseCode: string }[] {
  const [candStart, candEnd] = getTimeRange(candidateTimeSlot);
  if (candStart === 0 || candEnd === 0) return [];

  const occupied: { room: string; section: string; courseCode: string }[] = [];

  routineData.forEach((c) => {
    if (c.day !== day) return;
    if (c.type === "Break" || c.type === "No Class") return;
    if (!c.room || c.room.toUpperCase() === "TBA") return;

    const [cStart, cEnd] = getTimeRange(c.timeSlot);
    if (cStart > 0 && candStart > 0) {
      if (intervalsOverlap([candStart, candEnd], [cStart, cEnd])) {
        occupied.push({
          room: c.room.trim(),
          section: c.section,
          courseCode: cleanCourseCode(c.courseCode) || c.title || "Class",
        });
      }
    }
  });

  return occupied;
}

/**
 * Find available, conflict-free rooms at a given day and time slot
 */
export function getAvailableRoomsForSlot(
  routineData: RoutineItem[],
  day: string,
  candidateTimeSlot: string,
  preferredRoom?: string | null,
  targetType: "Theory" | "Lab" = "Theory"
): { availableRooms: string[]; suggestedRoom: string; occupiedRooms: { room: string; section: string; courseCode: string }[] } {
  const allRooms = getAllUniversityRooms(routineData);
  const occupiedList = getOccupiedRoomsAtSlot(routineData, day, candidateTimeSlot);
  const occupiedRoomNames = new Set(occupiedList.map((o) => o.room.toLowerCase().trim()));

  // Filter only rooms that are NOT currently in use by any section in the university
  const available = allRooms.filter((r) => !occupiedRoomNames.has(r.toLowerCase().trim()));

  // Choose the best suggested room:
  let suggested = "";
  if (preferredRoom && !occupiedRoomNames.has(preferredRoom.toLowerCase().trim())) {
    // If the teacher's/course's preferred room is completely free, use it!
    suggested = preferredRoom;
  } else if (targetType === "Lab") {
    // For labs, prioritize lab rooms
    const labRoom = available.find((r) => r.toLowerCase().includes("lab"));
    suggested = labRoom || (available.length > 0 ? available[0] : "Room TBA");
  } else {
    // For theory, prioritize regular classrooms (avoid labs if possible)
    const theoryRoom = available.find((r) => !r.toLowerCase().includes("lab")) || available[0];
    suggested = theoryRoom || "Room TBA";
  }

  return {
    availableRooms: available,
    suggestedRoom: suggested,
    occupiedRooms: occupiedList,
  };
}

/**
 * Find clash-free available time slots for a given teacher and section,
 * along with guaranteed conflict-free room recommendations.
 */
export function findAvailableSlotsForTeacherAndSection(
  routineData: RoutineItem[],
  facultyCode: string | null,
  section: string,
  targetType: "Theory" | "Lab" = "Theory",
  preferredRoom?: string | null
): SuggestedSlot[] {
  const suggestions: SuggestedSlot[] = [];

  // 1. Get all classes for this section
  const sectionClasses = routineData.filter(
    (c) =>
      c.section === section &&
      c.type !== "Break" &&
      c.type !== "No Class"
  );

  // 2. Get all classes for this teacher anywhere in the university
  const teacherClasses = facultyCode ? getTeacherWeeklySchedule(routineData, facultyCode) : [];

  // Check each day of the week
  WEEKDAYS.forEach((day) => {
    const isFriday = day === "Friday";
    const slotList = isFriday ? DEFAULT_FRIDAY_SLOTS : DEFAULT_SAT_THU_SLOTS;

    // Filter candidate slots (avoid lunch/jumu'ah break)
    const validSlots = slotList.filter((s) => !s.isBreak);

    validSlots.forEach((slot) => {
      const candidateRange = getTimeRange(slot.label || slot.slotString);
      if (candidateRange[0] === 0) return;

      // Check Section availability on this day and time
      const sectionClash = sectionClasses.some((c) => {
        if (c.day !== day) return false;
        const cRange = getTimeRange(c.timeSlot);
        if (cRange[0] > 0 && candidateRange[0] > 0) {
          return intervalsOverlap(candidateRange, cRange);
        }
        return c.colIndex === slot.colIndex && !isFriday;
      });

      if (sectionClash) return; // Section students have another class!

      // Check Teacher availability on this day and time across ENTIRE UNIVERSITY
      if (facultyCode && teacherClasses.length > 0) {
        const teacherClash = teacherClasses.some((c) => {
          if (c.day !== day) return false;
          const cRange = getTimeRange(c.timeSlot);
          if (cRange[0] > 0 && candidateRange[0] > 0) {
            return intervalsOverlap(candidateRange, cRange);
          }
          return c.colIndex === slot.colIndex && !isFriday;
        });

        if (teacherClash) return; // TEACHER IS OCCUPIED! Completely eliminate this slot.
      }

      // Check room availability across the entire university at this exact time slot
      const { availableRooms, suggestedRoom } = getAvailableRoomsForSlot(
        routineData,
        day,
        slot.slotString,
        preferredRoom,
        targetType
      );

      // Check how many classes section already has on this day
      const dayClassCount = sectionClasses.filter((c) => c.day === day).length;

      // Scoring: prefer days with 1-2 classes so student schedule is well-balanced
      let score = 10;
      let reason = `Conflict-free slot for teacher & section. Room ${suggestedRoom} is 100% vacant.`;

      if (dayClassCount === 0) {
        score = 8;
        reason = `${day} currently has no classes (Opens a relaxed day). Room ${suggestedRoom} is free.`;
      } else if (dayClassCount === 1) {
        score = 15;
        reason = `Best balance: ${day} only has 1 other class scheduled. Room ${suggestedRoom} is free.`;
      } else if (dayClassCount === 2) {
        score = 12;
        reason = `Convenient: ${day} has 2 existing classes. Room ${suggestedRoom} is free.`;
      } else {
        score = 6;
        reason = `${day} already has ${dayClassCount} classes scheduled. Room ${suggestedRoom} is free.`;
      }

      if (availableRooms.length === 0) {
        score -= 5;
      }

      suggestions.push({
        day,
        timeSlot: slot.slotString,
        colIndex: slot.colIndex,
        label: `${day} (${slot.label})`,
        score,
        reason,
        suggestedRoom,
        availableRooms,
      });
    });
  });

  // Sort by score descending
  return suggestions.sort((a, b) => b.score - a.score);
}

/**
 * Audit routine for a specific section and compare with other sections in the same batch
 */
export function auditSectionRoutine(
  routineData: RoutineItem[],
  targetSection: string,
  allSectionsInBatch: string[] = []
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const batch = extractBatchFromSection(targetSection);

  // Other sections in the same batch (e.g. 15B when auditing 15A)
  const peerSections = allSectionsInBatch.filter((s) => s !== targetSection);

  // Target section classes
  const targetClasses = routineData.filter(
    (c) => c.section === targetSection && c.type !== "Break" && c.type !== "No Class"
  );

  // Group target section by clean course code
  const targetCourseMap: Record<
    string,
    { theory: RoutineItem[]; lab: RoutineItem[]; title: string; faculty: string | null }
  > = {};

  targetClasses.forEach((c) => {
    const code = cleanCourseCode(c.courseCode);
    if (!code) return;
    if (!targetCourseMap[code]) {
      targetCourseMap[code] = {
        theory: [],
        lab: [],
        title: c.courseTitle || c.title || code,
        faculty: c.faculty || null,
      };
    }
    if (c.type === "Lab") targetCourseMap[code].lab.push(c);
    else targetCourseMap[code].theory.push(c);
  });

  // Collect peer sections courses
  const peerCourseStats: Record<
    string,
    Record<string, { theory: number; lab: number; faculty: string | null; title: string }>
  > = {};

  peerSections.forEach((peerSec) => {
    peerCourseStats[peerSec] = {};
    const pClasses = routineData.filter(
      (c) => c.section === peerSec && c.type !== "Break" && c.type !== "No Class"
    );
    pClasses.forEach((c) => {
      const code = cleanCourseCode(c.courseCode);
      if (!code) return;
      if (!peerCourseStats[peerSec][code]) {
        peerCourseStats[peerSec][code] = { theory: 0, lab: 0, faculty: c.faculty || null, title: c.courseTitle || "" };
      }
      if (c.type === "Lab") peerCourseStats[peerSec][code].lab++;
      else peerCourseStats[peerSec][code].theory++;
    });
  });

  // 1. Cross-Section Batch Imbalance Check (Compare with peer sections e.g. 15A vs 15B)
  Object.keys(targetCourseMap).forEach((courseCode) => {
    const info = targetCourseMap[courseCode];
    const targetTheoryCount = info.theory.length;
    const targetLabCount = info.lab.length;

    peerSections.forEach((peerSec) => {
      const peerData = peerCourseStats[peerSec]?.[courseCode];
      if (!peerData) return;

      // Check Theory Count Imbalance
      if (targetTheoryCount < peerData.theory) {
        const missingCount = peerData.theory - targetTheoryCount;
        const faculty = info.faculty || peerData.faculty || null;
        const preferredRoom = info.theory[0]?.room || targetClasses.find((c) => cleanCourseCode(c.courseCode) === courseCode)?.room || null;
        const suggestions = findAvailableSlotsForTeacherAndSection(
          routineData,
          faculty,
          targetSection,
          "Theory",
          preferredRoom
        );

        issues.push({
          id: `imbalance-theory-${targetSection}-${courseCode}-vs-${peerSec}`,
          courseCode,
          courseTitle: info.title || peerData.title,
          section: targetSection,
          batch,
          faculty,
          issueType: "missing_theory",
          severity: "high",
          title: `Missing Theory Class: ${courseCode} (${targetSection})`,
          description: `${targetSection} currently has ${targetTheoryCount} Theory class(es) scheduled for ${courseCode}, while ${peerSec} in the same batch has ${peerData.theory} Theory classes. Missing ${missingCount} class!`,
          currentCount: targetTheoryCount,
          expectedCount: peerData.theory,
          comparisonSection: peerSec,
          suggestedSlots: suggestions.slice(0, 5),
          teacherOccupiedSlots: faculty ? getTeacherWeeklySchedule(routineData, faculty) : [],
        });
      }

      // Check Lab Count Imbalance
      if (targetLabCount < peerData.lab) {
        const missingCount = peerData.lab - targetLabCount;
        const faculty = info.faculty || peerData.faculty || null;
        const preferredRoom = info.lab[0]?.room || targetClasses.find((c) => cleanCourseCode(c.courseCode) === courseCode)?.room || null;
        const suggestions = findAvailableSlotsForTeacherAndSection(
          routineData,
          faculty,
          targetSection,
          "Lab",
          preferredRoom
        );

        issues.push({
          id: `imbalance-lab-${targetSection}-${courseCode}-vs-${peerSec}`,
          courseCode,
          courseTitle: info.title || peerData.title,
          section: targetSection,
          batch,
          faculty,
          issueType: "missing_lab",
          severity: "high",
          title: `Missing Lab Class: ${courseCode} (${targetSection})`,
          description: `${targetSection} has ${targetLabCount} Lab scheduled, while ${peerSec} has ${peerData.lab} Lab(s). Missing ${missingCount} Lab class!`,
          currentCount: targetLabCount,
          expectedCount: peerData.lab,
          comparisonSection: peerSec,
          suggestedSlots: suggestions.slice(0, 5),
          teacherOccupiedSlots: faculty ? getTeacherWeeklySchedule(routineData, faculty) : [],
        });
      }
    });
  });

  // 2. Standard Credit Rule Check (3-Credit Theory standard = 2 classes per week)
  Object.keys(targetCourseMap).forEach((courseCode) => {
    const info = targetCourseMap[courseCode];
    // If it only has 1 Theory class and no peer section had 2 (or no peer section exists)
    const hasExistingIssue = issues.some((i) => i.courseCode === courseCode && i.issueType === "missing_theory");

    // Most 3-credit theory courses have 2 classes per week (except combined project CSE 3108)
    if (!hasExistingIssue && info.theory.length === 1 && !courseCode.includes("3108")) {
      const preferredRoom = info.theory[0]?.room || null;
      const suggestions = findAvailableSlotsForTeacherAndSection(
        routineData,
        info.faculty,
        targetSection,
        "Theory",
        preferredRoom
      );

      issues.push({
        id: `standard-rule-${targetSection}-${courseCode}`,
        courseCode,
        courseTitle: info.title,
        section: targetSection,
        batch,
        faculty: info.faculty,
        issueType: "missing_theory",
        severity: "medium",
        title: `Possible Missing Theory Slot: ${courseCode}`,
        description: `Standard 3-credit theory courses generally require 2 lecture slots (3 contact hours/week). ${targetSection} currently only has 1 slot scheduled for this course.`,
        currentCount: 1,
        expectedCount: 2,
        suggestedSlots: suggestions.slice(0, 5),
        teacherOccupiedSlots: info.faculty ? getTeacherWeeklySchedule(routineData, info.faculty) : [],
      });
    }
  });

  return issues;
}

/**
 * Full Routine Auditor across all batches and sections
 */
export function auditEntireUniversityRoutine(
  routineData: RoutineItem[],
  batchGroups: { batch: string; sections: string[] }[]
): {
  totalIssues: number;
  sectionIssues: Record<string, AuditIssue[]>;
  allIssues: AuditIssue[];
} {
  const sectionIssues: Record<string, AuditIssue[]> = {};
  const allIssues: AuditIssue[] = [];

  batchGroups.forEach((bg) => {
    bg.sections.forEach((sec) => {
      const issues = auditSectionRoutine(routineData, sec, bg.sections);
      if (issues.length > 0) {
        sectionIssues[sec] = issues;
        allIssues.push(...issues);
      }
    });
  });

  // Deduplicate by id — same issue could be generated from multiple peer sections
  const seenIds = new Set<string>();
  const dedupedIssues = allIssues.filter((issue) => {
    if (seenIds.has(issue.id)) return false;
    seenIds.add(issue.id);
    return true;
  });

  return {
    totalIssues: dedupedIssues.length,
    sectionIssues,
    allIssues: dedupedIssues,
  };
}
