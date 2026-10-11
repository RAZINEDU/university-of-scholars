"use client";

import React, { useState, useEffect } from "react";
import { RoutineItem } from "@/types/routine";
import { Clock, Calendar, CheckCircle2, AlertCircle, Coffee, MapPin, User, ArrowRight } from "lucide-react";
import { TEACHER_DIRECTORY } from "@/data/teacherData";

interface TodayScheduleWidgetProps {
  routineData: RoutineItem[];
  selectedSection: string;
  onSectionSelect: (sec: string) => void;
}

const DAYS_LIST = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = ({
  routineData,
  selectedSection,
  onSectionSelect
}) => {
  const [activeDay, setActiveDay] = useState<string>("");
  const [nowTime, setNowTime] = useState<Date>(new Date());

  useEffect(() => {
    // Get actual current day
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    if (DAYS_LIST.includes(dayName)) {
      setActiveDay(dayName);
    } else {
      setActiveDay("Saturday");
    }

    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter items for activeDay & selectedSection
  const dayRoutine = routineData.filter((item) => {
    const matchDay = item.day.toLowerCase() === activeDay.toLowerCase();
    const matchSec = selectedSection === "ALL" || item.section === selectedSection;
    return matchDay && matchSec;
  });

  // Unique sections list
  const sectionsList = Array.from(new Set(routineData.map((d) => d.section))).sort();

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Live Automatic Class Tracker
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {activeDay}'s Class Schedule
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Real-time schedule monitor for CSE Fall 2026. Select your section to see your upcoming classes!
            </p>
          </div>

          {/* Section Picker */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <span className="text-xs font-semibold text-amber-300 uppercase px-2">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => onSectionSelect(e.target.value)}
              className="bg-slate-900 text-amber-300 text-sm font-bold py-1.5 px-3 rounded-lg border border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="ALL">All Sections</option>
              {sectionsList.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Selector Pills - wraps on mobile, no side scroll */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-4 border-t border-white/10">
          {DAYS_LIST.map((day) => {
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20 scale-105"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine Cards Grid for Active Day */}
      {dayRoutine.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Coffee className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-bounce-subtle" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Scheduled Classes Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            There are no classes scheduled for {activeDay} for {selectedSection === "ALL" ? "any section" : selectedSection}. Enjoy your day!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayRoutine.map((item) => {
            const facultyInfo = item.faculty ? TEACHER_DIRECTORY[item.faculty] : null;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  item.type === "Lab"
                    ? "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-900 border-sky-300 dark:border-sky-800/60 shadow-md"
                    : item.type === "Break"
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900 border-amber-300 dark:border-amber-800/60"
                    : item.type === "No Class"
                    ? "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-amber-300 dark:bg-amber-400 dark:text-slate-950">
                    {item.section}
                  </span>
                  
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.type === "Lab"
                        ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
                        : item.type === "Break"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  {item.courseCode && (
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.courseCode}
                    </div>
                  )}
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.courseTitle || item.title || item.rawText}
                  </h4>
                </div>

                {/* Time & Location */}
                <div className="space-y-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                  
                  {/* Time slot */}
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{item.timeSlot}</span>
                  </div>

                  {/* Room */}
                  {item.room && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>Room {item.room}</span>
                    </div>
                  )}

                  {/* Faculty */}
                  {item.faculty && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                      {facultyInfo?.imageUrl ? (
                        <img 
                          src={facultyInfo.imageUrl} 
                          alt={facultyInfo.name} 
                          className="w-10 h-10 rounded-full bg-white object-cover shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight">
                          {facultyInfo ? facultyInfo.name : item.faculty}
                        </span>
                        {facultyInfo && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {facultyInfo.designation.split('&')[0].trim()}
                          </span>
                        )}
                      </div>
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
};
