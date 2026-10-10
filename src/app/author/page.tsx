"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Code2, Globe } from "lucide-react";

export default function AuthorPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full">
        
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>

        {/* Author Card */}
        <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
          
          {/* Background Glows */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 dark:bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors duration-700" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/20 dark:bg-pink-500/10 blur-3xl rounded-full group-hover:bg-pink-500/30 transition-colors duration-700" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Avatar / Photo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl mb-6 flex items-center justify-center ring-4 ring-indigo-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/author-image.jpg" 
                  alt="Razin Ibn Asad" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Razin Ibn Asad
            </h1>
            <p className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-bold mb-2 tracking-wide">
              Student, Bachelor of Computer Science
            </p>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-lg mb-8">
              University of Scholars
            </p>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-8" />

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://razinibnasad.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm transition-all shadow-lg hover:shadow-xl border border-transparent hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4" />
                View Portfolio
              </a>
              <a 
                href="mailto:razin.ibn.asad@gmail.com"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-all shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
