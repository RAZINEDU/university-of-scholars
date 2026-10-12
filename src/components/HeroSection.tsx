import React from "react";
import Link from "next/link";
import { ViewMode } from "@/types/routine";
import { 
  Calendar, 
  Clock, 
  Layers, 
  Users, 
  Building,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  UserCheck
} from "lucide-react";

interface HeroSectionProps {
  totalClasses?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ totalClasses }) => {
  const features = [
    {
      id: "section" as ViewMode,
      title: "Section Routine",
      description: "View the complete semester routine for any specific section in a beautiful grid layout.",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "today" as ViewMode,
      title: "Today's Live",
      description: "See what's happening right now with live indicators for ongoing and upcoming classes.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-400 to-orange-500",
      bgLight: "bg-amber-50",
      bgDark: "dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      id: "retake" as ViewMode,
      title: "Retake Builder & Clash Checker",
      description: "Build your custom routine combining different sections. Automatically detects time clashes.",
      icon: <Layers className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-600",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: "teacher" as ViewMode,
      title: "Teacher Schedule",
      description: "Track faculty routine schedules, finding out when they are in class or free for consultation.",
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-500",
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      id: "faculty" as ViewMode,
      title: "Faculty Profiles",
      description: "Official profiles of CSE faculty members with individual slug pages, contacts, research, and schedule.",
      icon: <Users className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-600",
      bgLight: "bg-indigo-50",
      bgDark: "dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      id: "room" as ViewMode,
      title: "Room Availability",
      description: "Quickly find empty rooms across campus for makeup classes, labs, or meetings.",
      icon: <Building className="w-6 h-6" />,
      color: "from-rose-400 to-red-500",
      bgLight: "bg-rose-50",
      bgDark: "dark:bg-rose-900/20",
      textColor: "text-rose-600 dark:text-rose-400"
    }
  ];

  return (
    <div className="relative w-full flex flex-col justify-center animate-in fade-in duration-700 py-6 md:py-10 overflow-hidden">
      
      <div className="relative z-10 w-full">
        {/* ── Hero Header (Centered) ── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16 mt-8 px-4">
          
          <div className="flex justify-center mb-6">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-500">
              <img src="/logo.png" alt="University of Scholars Logo" className="h-16 md:h-20 object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-2 border border-indigo-200/50 dark:border-indigo-700/30 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Scheduling Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-sm">
            Master Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              University Routine
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            The ultimate platform to explore section routines, build custom schedules, find free rooms, and never miss a class clash again.
          </p>
          
          {totalClasses !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 pt-4 drop-shadow-sm">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Powering {totalClasses} classes this semester</span>
            </div>
          )}
        </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-5 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {features.map((feature, idx) => (
          <Link
            key={feature.id}
            href={`/${feature.id}`}
            className={`group relative p-1 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-40 dark:opacity-20 blur-xl rounded-3xl transition-opacity group-hover:opacity-60 dark:group-hover:opacity-40`} />
            
            <div className="relative h-full bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 p-6 xl:p-8 rounded-[1.4rem] shadow-xl hover:shadow-2xl transition-all flex flex-col">
              
              <div className={`w-12 h-12 xl:w-14 xl:h-14 rounded-2xl flex items-center justify-center mb-5 xl:mb-6 shadow-inner ${feature.bgLight} ${feature.bgDark} ${feature.textColor}`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl xl:text-2xl font-bold text-slate-900 dark:text-white mb-2 xl:mb-3">
                {feature.title}
              </h3>
              
              <p className="text-sm xl:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6 xl:mb-8 flex-grow">
                {feature.description}
              </p>
              
              <div className="mt-auto flex items-center text-xs xl:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      </div>
    </div>
  );
};
