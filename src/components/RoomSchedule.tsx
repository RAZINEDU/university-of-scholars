"use client";

import React, { useState, useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { TEACHER_DIRECTORY } from "@/data/teacherData";
import { Building2, Search, Clock, User, Calendar, MapPin } from "lucide-react";

interface RoomScheduleProps {
  routineData: RoutineItem[];
}

export const RoomSchedule: React.FC<RoomScheduleProps> = ({ routineData }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>("1502");
  const [roomSearch, setRoomSearch] = useState<string>("");

  // Get unique rooms
  const roomsList = useMemo(() => {
    const set = new Set<string>();
    routineData.forEach((item) => {
      if (item.room) {
        set.add(item.room);
      }
    });
    return Array.from(set).sort();
  }, [routineData]);

  const filteredRooms = useMemo(() => {
    if (!roomSearch.trim()) return roomsList;
    const q = roomSearch.toLowerCase();
    return roomsList.filter((r) => r.toLowerCase().includes(q));
  }, [roomsList, roomSearch]);

  const roomClasses = useMemo(() => {
    return routineData.filter((item) => item.room === selectedRoom);
  }, [routineData, selectedRoom]);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Room Selector Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              Campus Room Occupancy & Availability
            </div>
            <h2 className="text-2xl font-bold">Room Schedule Finder</h2>
            <p className="text-sm text-slate-300 mt-1">
              Select any classroom or laboratory to inspect its full weekly utilization timetable.
            </p>
          </div>

          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search room number..."
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Room Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          {filteredRooms.map((room) => {
            const isActive = selectedRoom === room;
            return (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-105"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Room {room}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Room Details */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Room {selectedRoom} Timetable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total {roomClasses.length} weekly classes scheduled in this room
              </p>
            </div>
          </div>
        </div>

        {roomClasses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No scheduled classes in Room {selectedRoom}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomClasses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-600 text-white">
                    {item.section}
                  </span>
                  <span className="text-[11px] font-bold text-amber-500">{item.day}</span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.courseCode && <span className="text-indigo-600 dark:text-indigo-400 mr-1.5">{item.courseCode}</span>}
                  {item.courseTitle || item.title}
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {item.timeSlot}
                  </span>

                  {item.faculty && (
                    <span className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                      <User className="w-3.5 h-3.5" />
                      {item.faculty}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
