"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FacultyMember } from "@/data/teacherData";
import {
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  Briefcase,
  BookOpen,
  MapPin,
  Sparkles,
  ChevronLeft,
  Award,
  Building2,
  BookmarkCheck,
  FileText,
  ShieldCheck,
  Share2
} from "lucide-react";

interface FacultyProfileViewProps {
  faculty: FacultyMember;
}

export const FacultyProfileView: React.FC<FacultyProfileViewProps> = ({
  faculty
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${faculty.name} | Faculty of CSE, University of Scholars`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      handleCopy(window.location.href, "share-link");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* ── BREADCRUMB & BACK NAVIGATION ────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link
          href="/faculty"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:border-indigo-800 transition-all shadow-sm group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Faculty Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            {copiedKey === "share-link" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Profile</span>
              </>
            )}
          </button>

          {faculty.profileUrl && (
            <a
              href={faculty.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
            >
              <span>IUS Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* ── PROFILE HERO CARD ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
        {/* Glow aesthetics */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Large Teacher Portrait */}
          <div className="relative shrink-0">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 ring-4 ring-indigo-500/30 bg-slate-900 flex items-center justify-center">
              {faculty.imageUrl ? (
                <img
                  src={faculty.imageUrl}
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.parentElement?.querySelector(".avatar-fallback") as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`avatar-fallback ${faculty.imageUrl ? "hidden" : "flex"} w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-4xl items-center justify-center uppercase`}
              >
                {faculty.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            </div>

            {/* Department Head Badge Icon */}
            {faculty.designation.includes("Head") && (
              <div
                className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg border-2 border-white"
                title="Head of Department"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Head</span>
              </div>
            )}
          </div>

          {/* Teacher Info & Headings */}
          <div className="space-y-4 flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{faculty.department}</span>
              </span>

              {faculty.code && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-mono font-bold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Code: {faculty.code}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 text-slate-300 text-xs font-mono font-bold">
                #{String(faculty.serial).padStart(2, "0")}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {faculty.name}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-indigo-300">
                {faculty.designation}
              </p>
            </div>

            {faculty.officeAddress && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{faculty.officeAddress}</span>
              </div>
            )}

            {/* Direct Contact Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {faculty.phone && (
                <div className="inline-flex items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 overflow-hidden shadow-sm">
                  <a
                    href={`tel:${faculty.phone.replace(/[^0-9]/g, "")}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{faculty.phone}</span>
                  </a>
                  <button
                    onClick={() => handleCopy(faculty.phone || "", "phone")}
                    title="Copy Phone Number"
                    className="p-2 border-l border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {copiedKey === "phone" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {faculty.email && (
                <div className="inline-flex items-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 overflow-hidden shadow-sm">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>{faculty.email}</span>
                  </a>
                  <button
                    onClick={() => handleCopy(faculty.email || "", "email")}
                    title="Copy Email Address"
                    className="p-2 border-l border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    {copiedKey === "email" ? (
                      <Check className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BIO / ABOUT (IF AVAILABLE) ────────────────────────────── */}
      {faculty.bio && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BookmarkCheck className="w-4 h-4" />
            <span>Professional Profile</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {faculty.bio}
          </p>
        </div>
      )}

      {/* ── RESEARCH INTERESTS ────────────────────────────────────── */}
      {faculty.researchInterests && faculty.researchInterests.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>Research Interests & Domain Specialization</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {faculty.researchInterests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs sm:text-sm font-bold shadow-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── TWO-COLUMN: EDUCATION & JOB EXPERIENCE ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Educational Qualifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <span>Educational Qualifications</span>
            </div>
            {faculty.education && faculty.education.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {faculty.education.length} Degrees
              </span>
            )}
          </div>

          {faculty.education && faculty.education.length > 0 ? (
            <div className="space-y-4">
              {faculty.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 pb-2 border-l-2 border-indigo-200 dark:border-indigo-800 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-sm" />
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                      {edu.degree}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {edu.institute}
                    </p>
                    {edu.year && (
                      <span className="inline-block mt-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Class of {edu.year}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <span>Academic credentials verified by Department of Computer Science & Engineering.</span>
            </div>
          )}
        </div>

        {/* Job & Professional Experience */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <Briefcase className="w-5 h-5 text-teal-500" />
              <span>Professional Experience</span>
            </div>
            {faculty.experience && faculty.experience.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                {faculty.experience.length} Roles
              </span>
            )}
          </div>

          {faculty.experience && faculty.experience.length > 0 ? (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {faculty.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 pb-2 border-l-2 border-teal-200 dark:border-teal-800 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-600 border-4 border-white dark:border-slate-900 shadow-sm" />
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {exp.company}
                    </p>
                    {exp.duration && (
                      <span className="inline-block mt-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <span>Currently serving at University of Scholars, Department of CSE.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── PUBLICATIONS & RESEARCH PAPERS ───────────────────────── */}
      {faculty.publications && faculty.publications.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Publications & Research Papers</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {faculty.publications.length} Papers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
            {faculty.publications.map((pub, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      #{idx + 1}
                    </span>
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                    {pub.title}
                  </h4>
                </div>

                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1 self-start"
                  >
                    <span>Read Paper / View Index</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER CALLOUT ───────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Need to contact the Department of CSE?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            University of Scholars, 40 Kemal Ataturk Avenue, Banani, Dhaka-1213
          </p>
        </div>

        <Link
          href="/faculty"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <span>View All Faculty Members</span>
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
};
