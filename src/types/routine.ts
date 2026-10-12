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
  phone?: string;
  email?: string;
  imageUrl?: string;
  room?: string;
}

export interface EducationItem {
  degree: string;
  institute: string;
  year?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
}

export interface PublicationItem {
  title: string;
  url?: string;
}

export interface FacultyProfile extends TeacherInfo {
  serial: number;
  slug: string;
  cleanSlug: string;
  profileUrl?: string;
  officeAddress?: string;
  bio?: string;
  researchInterests?: string[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  publications?: PublicationItem[];
}

export type ViewMode = 'home' | 'section' | 'today' | 'retake' | 'teacher' | 'faculty' | 'room' | 'all';

