"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FacultyMember } from "@/data/teacherData";
import { useDynamicFaculty } from "@/lib/useDynamicData";
import {
  Search,
  Phone,
  Mail,
  Copy,
  Check,
  Award,
  Sparkles,
  Filter,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  ArrowRight
} from "lucide-react";

interface FacultyDirectoryProps {
  onSelectTeacherForSchedule?: (teacherCode: string) => void;
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  onSelectTeacherForSchedule
}) => {
  const router = useRouter();
  const { facultyMembers } = useDynamicFaculty();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Copy to clipboard helper
  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Designation category filter
  const filterCategories = [
    { id: "ALL", label: "All Faculty", count: facultyMembers.length },
    {
      id: "HEAD_ASSOC",
      label: "Head & Assoc. Prof",
      match: (m: FacultyMember) =>
        m.designation.includes("Head") || m.designation.includes("Associate Professor")
    },
    {
      id: "ASST_PROF",
      label: "Assistant Prof",
      match: (m: FacultyMember) => m.designation.includes("Assistant Professor")
    },
    {
      id: "SR_LEC",
      label: "Senior Lecturer",
      match: (m: FacultyMember) => m.designation.includes("Senior Lecturer")
    },
    {
      id: "LEC",
      label: "Lecturer",
      match: (m: FacultyMember) =>
        m.designation.includes("Lecturer") && !m.designation.includes("Senior Lecturer")
    },
    {
      id: "RESEARCH_STAFF",
      label: "Research & Staff",
      match: (m: FacultyMember) =>
        m.designation.includes("Research") ||
        m.designation.includes("Teaching Assistant") ||
        m.designation.includes("Lab") ||
        m.designation.includes("Intern")
    }
  ];

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return facultyMembers.filter((faculty) => {
      // Category filter
      if (selectedFilter !== "ALL") {
        const cat = filterCategories.find((c) => c.id === selectedFilter);
        if (cat?.match && !cat.match(faculty)) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = faculty.name.toLowerCase().includes(q);
        const matchesDesignation = faculty.designation.toLowerCase().includes(q);
        const matchesPhone = faculty.phone?.toLowerCase().includes(q) || false;
        const matchesEmail = faculty.email?.toLowerCase().includes(q) || false;
        const matchesCode = faculty.code.toLowerCase().includes(q);
        const matchesSlug = faculty.slug.toLowerCase().includes(q);
        return matchesName || matchesDesignation || matchesPhone || matchesEmail || matchesCode || matchesSlug;
      }

      return true;
    });
  }, [searchQuery, selectedFilter]);

  // Rank-specific badge styling
  const getBadgeStyle = (designation: string) => {
    if (designation.includes("Head")) {
      return "bg-gradient-to-r from-amber-500/15 to-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/30 ring-1 ring-purple-400/20";
    }
    if (designation.includes("Associate Professor")) {
      return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
    }
    if (designation.includes("Assistant Professor")) {
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    }
    if (designation.includes("Senior Lecturer")) {
      return "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20";
    }
    if (designation.includes("Lecturer")) {
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    }
    return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
  };

  // Gradient for avatar fallback
  const getAvatarGradient = (serial: number) => {
    const gradients = [
      "from-indigo-600 to-purple-600",
      "from-purple-600 to-pink-600",
      "from-blue-600 to-cyan-600",
      "from-emerald-600 to-teal-600",
      "from-amber-600 to-rose-600",
      "from-violet-600 to-indigo-600"
    ];
    return gradients[(serial - 1) % gradients.length];
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Department of Computer Science & Engineering</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>Faculty Information & Directory</span>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-xs font-bold text-indigo-200">
                  {facultyMembers.length} Faculty Members
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                Official faculty directory of University of Scholars CSE Department. Search any teacher to view their full profile, contact info, research domains, education, and publications.
              </p>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-3 py-2">
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  {facultyMembers.length}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Total Faculty</div>
              </div>
              <div className="text-center px-3 py-2 border-x border-white/10">
                <div className="text-xl sm:text-2xl font-black text-indigo-400">27</div>
                <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Slug Pages</div>
              </div>
              <div className="text-center px-3 py-2">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">Direct</div>
                <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Contacts</div>
              </div>
            </div>
          </div>

          {/* Search Bar + Quick Dropdown Selector */}
          <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher by name, designation, phone, email, or code (MAA)..."
                className="w-full pl-12 pr-4 py-3 text-sm font-medium rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400 backdrop-blur-md transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-slate-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Direct Jump Dropdown */}
            <div className="relative md:w-72 shrink-0">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/faculty/${e.target.value}`);
                  }
                }}
                defaultValue=""
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-indigo-900/60 hover:bg-indigo-900/80 border border-indigo-400/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all cursor-pointer"
              >
                <option value="" disabled className="bg-slate-900 text-slate-400">
                  ⚡ Select Specific Faculty...
                </option>
                {facultyMembers.map((fac: FacultyMember) => (
                  <option key={fac.slug || fac.code} value={fac.slug || fac.cleanSlug || fac.code} className="bg-slate-900 text-white py-1">
                    {fac.name} ({fac.code || fac.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter:</span>
            </div>
            {filterCategories.map((cat) => {
              const isActive = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FACULTY CARDS GRID ─────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Results Counter */}
        <div className="flex items-center justify-between px-2">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredFaculty.length}</span> of {facultyMembers.length} Faculty Members
          </div>
          {searchQuery && (
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Filtered by &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredFaculty.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No faculty members found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No teacher matches &ldquo;{searchQuery}&rdquo;. Try searching by name, code, or clearing your filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("ALL");
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredFaculty.map((faculty) => {
            const phoneKey = `phone-${faculty.serial}`;
            const emailKey = `email-${faculty.serial}`;
            const isPhoneCopied = copiedKey === phoneKey;
            const isEmailCopied = copiedKey === emailKey;
            const slugUrl = `/faculty/${faculty.slug}`;

            return (
              <div
                key={faculty.serial}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* Top Colored Accent Stripe */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:h-2 transition-all duration-300" />

                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  {/* Top Bar: Serial # + Teacher Code Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-black text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                      #{String(faculty.serial).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {faculty.code && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-wide border border-indigo-200 dark:border-indigo-800/60 shadow-sm">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          {faculty.code}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Section: Avatar + Name + Designation */}
                  <div className="flex items-start gap-4">
                    {/* Avatar / Photo Link */}
                    <Link href={slugUrl} className="relative shrink-0 block group/avatar" title={`View ${faculty.name}'s Profile`}>
                      {faculty.imageUrl ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-800 ring-2 ring-indigo-500/20 group-hover/avatar:ring-indigo-500 group-hover/avatar:scale-105 transition-all duration-300 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={faculty.imageUrl}
                            alt={faculty.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.parentElement?.querySelector(".avatar-fallback") as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div
                            className="avatar-fallback hidden w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-xl items-center justify-center uppercase"
                          >
                            {faculty.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                            faculty.serial
                          )} text-white font-black text-xl flex items-center justify-center uppercase shadow-md border-2 border-white dark:border-slate-800 ring-2 ring-indigo-500/20 group-hover/avatar:scale-105 transition-transform duration-300`}
                        >
                          {faculty.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}

                      {/* Head indicator icon */}
                      {faculty.designation.includes("Head") && (
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900"
                          title="Head of Department"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </Link>

                    {/* Name & Designation Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Link href={slugUrl} className="block group/title" title={`View ${faculty.name}'s Profile`}>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate-2-lines group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                          {faculty.name}
                        </h2>
                      </Link>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getBadgeStyle(
                            faculty.designation
                          )}`}
                        >
                          {faculty.designation}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {faculty.department}
                      </p>
                    </div>
                  </div>

                  {/* Highlights (Research tags or Education) */}
                  {faculty.researchInterests && faculty.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {faculty.researchInterests.slice(0, 3).map((res, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 truncate max-w-[170px]"
                        >
                          {res}
                        </span>
                      ))}
                      {faculty.researchInterests.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-400">
                          +{faculty.researchInterests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact Information Box */}
                  <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800/80">
                    {/* Phone Number */}
                    {faculty.phone ? (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-300">
                              Direct Phone / Mobile
                            </span>
                            <a
                              href={`tel:${faculty.phone.replace(/[^0-9]/g, "")}`}
                              className="font-mono text-xs font-black text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                              {faculty.phone}
                            </a>
                          </div>
                        </div>

                        {/* Copy Phone Button */}
                        <button
                          onClick={() => handleCopy(faculty.phone || "", phoneKey)}
                          title="Copy Phone Number"
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                            isPhoneCopied
                              ? "bg-emerald-500 text-white shadow-sm"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700"
                          }`}
                        >
                          {isPhoneCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold pr-1">Copied</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 text-[11px] text-slate-400 italic">
                        Phone contact available upon departmental request
                      </div>
                    )}

                    {/* Email Address */}
                    {faculty.email && (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-300">
                              Official Email
                            </span>
                            <a
                              href={`mailto:${faculty.email}`}
                              title={faculty.email}
                              className="font-mono text-xs font-black text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate transition-colors"
                            >
                              {faculty.email}
                            </a>
                          </div>
                        </div>

                        {/* Copy Email Button */}
                        <button
                          onClick={() => handleCopy(faculty.email || "", emailKey)}
                          title="Copy Email Address"
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                            isEmailCopied
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700"
                          }`}
                        >
                          {isEmailCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold pr-1">Copied</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Quick-Action Footer */}
                <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Call Link */}
                    {faculty.phone && (
                      <a
                        href={`tel:${faculty.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all active:scale-95"
                        title="Call Phone"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    )}

                    {/* Email Link */}
                    {faculty.email && (
                      <a
                        href={`mailto:${faculty.email}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all active:scale-95"
                        title="Send Email"
                      >
                        <Mail className="w-3 h-3" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                    )}
                  </div>

                  {/* Primary Link to Full Slug Profile Page */}
                  <Link
                    href={slugUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/20 active:scale-95 ml-auto group/btn"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
