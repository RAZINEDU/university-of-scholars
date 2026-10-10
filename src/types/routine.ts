export type ClassType = 'Theory' | 'Lab' | 'Break' | 'No Class' | string;

export interface RoutineItem {
  id: string;
  section: string;
  day: string;
  dayShort: string;
  colIndex: number;
  timeSlot: string;
  type: ClassType;
  title?: string | null;
  courseCode?: string | null;
  courseTitle?: string | null;
  faculty?: string | null;
  room?: string | null;
  rawText: string;
}

export interface TeacherInfo {
  code: string;
  name: string;
  designation: string;
  department: string;
  email?: string;
  imageUrl?: string;
}

export type ViewMode = 'home' | 'section' | 'today' | 'retake' | 'teacher' | 'room' | 'all';
