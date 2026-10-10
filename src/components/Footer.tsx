"use client";

import React from "react";
import { ExternalLink, Globe, Heart, ShieldCheck, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 pt-10 pb-32 relative overflow-hidden">
      
      {/* Background Animation Images */}
      <div className="footer_bg">
        <div className="footer_bg_one"></div>
        <div className="footer_bg_two"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: University Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg">
                IUS
              </div>
              <div>
                <h3 className="text-base font-bold text-white">The International University of Scholars</h3>
                <p className="text-xs text-amber-400 font-semibold">Department of Computer Science & Engineering (CSE)</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Official Automatic Class Routine Checking Portal for Fall 2026 semester. Built to simplify class schedule tracking, retake clash detection, and room lookup for students and faculty.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <a
                href="https://ius.edu.bd/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-amber-400 hover:underline font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>https://ius.edu.bd/</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Campus Info
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Bulbul Centre, 40/Kha, Progressive Tower, Kuril, Pragati Sarani, Dhaka 1229</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>info@ius.edu.bd</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Semester Info */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Semester
            </h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div className="font-bold text-white">Fall 2026 Semester</div>
              <p className="text-[11px] text-slate-400">
                CSE Final Draft Routine (19 Sections)
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Data Engine
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Author Link */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center relative z-20 pb-4">
          <a 
            href="/author"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/90 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-sm font-bold text-slate-200 hover:text-white shadow-xl transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Meet the Author</span>
          </a>
        </div>

      </div>
    </footer>
  );
};
