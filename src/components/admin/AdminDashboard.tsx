"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { RoutineItem, BatchGroup, PortalTimeSlots, RoutinePublishStatus } from "@/types/routine";
import { FacultyMember } from "@/data/teacherData";
import {
  getRoutineDrafts,
  getRoutineItems,
  getFacultyMembers,
  getAppSettings,
  upsertRoutineDraftItem,
  deleteRoutineDraftItem,
  publishRoutineDraft,
  revertRoutineDraftToLive,
  getRoutinePublishStatus,
  upsertRoutineItem,
  deleteRoutineItem,
  upsertFacultyMember,
  deleteFacultyMember,
  updateAppSettings,
  syncAllDataToSupabase,
  getBatchGroups,
  saveBatchGroups,
  getPortalTimeSlots,
  savePortalTimeSlots,
  DEFAULT_BATCH_GROUPS,
  DEFAULT_PORTAL_TIME_SLOTS,
  AppSettings,
  supabase,
} from "@/lib/supabaseClient";
import { RoutineModal } from "./RoutineModal";
import { FacultyModal } from "./FacultyModal";
import { AdminRoutineTimetable } from "./AdminRoutineTimetable";
import {
  Calendar,
  Users,
  Database,
  Settings,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Eye,
  LogOut,
  Layers,
  ChevronRight,
  BookOpen,
  MapPin,
  Flame,
  X,
  Send,
  RotateCcw,
  Globe,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<"routine" | "faculty" | "database" | "settings">("routine");

  // Data states
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  // Snapshot of what's currently in DB (used to detect real dirty state)
  const publishedBaseline = useRef<string>("");
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [batchGroups, setBatchGroups] = useState<BatchGroup[]>(DEFAULT_BATCH_GROUPS);
  const [portalTimeSlots, setPortalTimeSlots] = useState<PortalTimeSlots>(DEFAULT_PORTAL_TIME_SLOTS);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    semesterName: "Fall 2026",
    announcement: "Welcome to IUS CSE Class Routine & Schedule Portal!",
    announcementActive: true,
    maintenanceMode: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Modals state
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);

  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [deletingFacultyCode, setDeletingFacultyCode] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");

  // Filters for Routine
  const [routineSearch, setRoutineSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");

  // Filters for Faculty
  const [facultySearch, setFacultySearch] = useState("");

  // SQL code state
  const [sqlContent, setSqlContent] = useState<string>("");
  const [isCopiedSql, setIsCopiedSql] = useState(false);
  const [isLoadingSql, setIsLoadingSql] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<AppSettings>({
    semesterName: "Fall 2026",
    announcement: "",
    announcementActive: true,
    maintenanceMode: false,
  });
  const [newAdminPin, setNewAdminPin] = useState("");

  // Routine Draft & Publishing State
  const [publishStatus, setPublishStatus] = useState<RoutinePublishStatus>({
    lastPublishedAt: null,
    publishedCount: 323,
    hasUnpublishedChanges: false,
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [showRevertConfirmModal, setShowRevertConfirmModal] = useState(false);

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rRes, fRes, sRes, bRes, tRes, pubStatus] = await Promise.all([
        getRoutineDrafts(),
        getFacultyMembers(),
        getAppSettings(),
        getBatchGroups(),
        getPortalTimeSlots(),
        getRoutinePublishStatus(),
      ]);

      setRoutineItems(rRes.data);
      // Save baseline snapshot — what's actually in DB right now
      publishedBaseline.current = JSON.stringify(
        [...rRes.data].sort((a, b) => a.id.localeCompare(b.id))
      );
      setFacultyMembers(fRes.data);
      setAppSettings(sRes);
      setSettingsForm(sRes);
      setPublishStatus({ ...pubStatus, hasUnpublishedChanges: false });
      if (bRes.data?.length) setBatchGroups(bRes.data);
      if (tRes.data?.satThuSlots?.length) setPortalTimeSlots(tRes.data);
      setIsSupabaseLive(rRes.isSupabase || fRes.isSupabase || bRes.isSupabase);
    } catch (err: any) {
      showToast(err.message || "Error loading portal data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Section list
  const sectionsList = useMemo(() => {
    const set = new Set(routineItems.map((r) => r.section));
    return Array.from(set).sort();
  }, [routineItems]);

  // Filtered Routine Items
  const filteredRoutine = useMemo(() => {
    return routineItems.filter((item) => {
      const matchSection = selectedSection === "ALL" || item.section === selectedSection;
      const matchDay = selectedDay === "ALL" || item.day.toLowerCase() === selectedDay.toLowerCase();
      const matchType = selectedType === "ALL" || item.type.toLowerCase() === selectedType.toLowerCase();

      const q = routineSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.courseCode && item.courseCode.toLowerCase().includes(q)) ||
        (item.courseTitle && item.courseTitle.toLowerCase().includes(q)) ||
        (item.faculty && item.faculty.toLowerCase().includes(q)) ||
        (item.room && item.room.toLowerCase().includes(q)) ||
        (item.section && item.section.toLowerCase().includes(q));

      return matchSection && matchDay && matchType && matchSearch;
    });
  }, [routineItems, selectedSection, selectedDay, selectedType, routineSearch]);

  // Filtered Faculty Members
  const filteredFaculty = useMemo(() => {
    const q = facultySearch.toLowerCase().trim();
    if (!q) return facultyMembers;

    return facultyMembers.filter((f) => {
      return (
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        (f.designation && f.designation.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.phone && f.phone.includes(q))
      );
    });
  }, [facultyMembers, facultySearch]);

  // ─────────────────────────────────────────────────────────────
  // DIRTY CHECK — compare current items vs DB baseline
  // ─────────────────────────────────────────────────────────────
  const checkAndSetDirty = useCallback((nextItems: RoutineItem[]) => {
    const currentSnapshot = JSON.stringify(
      [...nextItems].sort((a, b) => a.id.localeCompare(b.id))
    );
    const isDirty = currentSnapshot !== publishedBaseline.current;
    setPublishStatus((prev) => ({ ...prev, hasUnpublishedChanges: isDirty }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: ROUTINE (DIRECT LIVE DATABASE CONNECTION)
  // ─────────────────────────────────────────────────────────────
  const handleSaveRoutine = async (item: RoutineItem) => {
    // 1. Save directly to live routine_items table in Supabase
    const res = await upsertRoutineItem(item);
    if (!res.success) {
      throw new Error(res.error || "Failed to save to database");
    }

    // 2. Also keep routine_drafts synchronized
    await upsertRoutineDraftItem(item).catch(() => {});

    setRoutineItems((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const next = exists
        ? prev.map((x) => (x.id === item.id ? item : x))
        : [item, ...prev];
      // Smart dirty check — if user undid the change, button goes back to dimmed
      checkAndSetDirty(next);
      return next;
    });

    // 3. Notify other open tabs (/section, /today, etc.) to immediately refresh live
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ius_routine_updated"));
      localStorage.setItem("ius_routine_last_update", Date.now().toString());
    }

    showToast(`✅ "${item.courseCode || item.section}" saved to database!`, "success");
  };

  const handleDeleteRoutine = async (id: string) => {
    // 1. Delete directly from live routine_items table in Supabase
    const res = await deleteRoutineItem(id);
    if (!res.success) {
      showToast(res.error || "Failed to delete item", "error");
      return;
    }

    // 2. Also keep routine_drafts synchronized
    await deleteRoutineDraftItem(id).catch(() => {});

    setRoutineItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      checkAndSetDirty(next);
      return next;
    });
    setDeletingRoutineId(null);

    // 3. Notify other open tabs (/section, /today, etc.)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ius_routine_updated"));
      localStorage.setItem("ius_routine_last_update", Date.now().toString());
    }

    showToast("Class deleted from Supabase!", "info");
  };

  const handleDuplicateRoutine = async (item: RoutineItem) => {
    const newId = `${item.id}-copy-${Date.now().toString().slice(-4)}`;
    const duplicated: RoutineItem = {
      ...item,
      id: newId,
    };

    const res = await upsertRoutineItem(duplicated);
    if (!res.success) {
      showToast(res.error || "Failed to duplicate class", "error");
      return;
    }

    await upsertRoutineDraftItem(duplicated).catch(() => {});

    setRoutineItems((prev) => {
      const next = [duplicated, ...prev];
      checkAndSetDirty(next);
      return next;
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ius_routine_updated"));
      localStorage.setItem("ius_routine_last_update", Date.now().toString());
    }

    showToast(`Duplicated class created for ${duplicated.section}!`, "success");
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: PUBLISHING & REVERT
  // ─────────────────────────────────────────────────────────────
  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const res = await publishRoutineDraft(routineItems);
      if (!res.success) {
        showToast(res.error || "Failed to publish routine live", "error");
        return;
      }

      // Update baseline to current published state — button goes back to dimmed
      publishedBaseline.current = JSON.stringify(
        [...routineItems].sort((a, b) => a.id.localeCompare(b.id))
      );

      setPublishStatus({
        lastPublishedAt: new Date().toISOString(),
        publishedCount: res.count || routineItems.length,
        hasUnpublishedChanges: false,
      });

      setShowPublishConfirmModal(false);
      showToast("🎉 Routine successfully published to live website! All students can now view the latest version.", "success");
    } catch (err: any) {
      showToast(err.message || "Publish error occurred", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevertDraft = async () => {
    setIsReverting(true);
    try {
      const res = await revertRoutineDraftToLive();
      if (!res.success) {
        showToast(res.error || "Failed to revert draft", "error");
        return;
      }

      await loadData();
      setShowRevertConfirmModal(false);
      showToast("Draft changes reverted! Restored currently published live routine.", "info");
    } catch (err: any) {
      showToast(err.message || "Revert error occurred", "error");
    } finally {
      setIsReverting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: FACULTY
  // ─────────────────────────────────────────────────────────────
  const handleSaveFaculty = async (faculty: FacultyMember) => {
    const res = await upsertFacultyMember(faculty);
    if (!res.success) {
      throw new Error(res.error || "Failed to save faculty");
    }

    setFacultyMembers((prev) => {
      const exists = prev.some((x) => x.code === faculty.code);
      if (exists) {
        return prev.map((x) => (x.code === faculty.code ? faculty : x));
      }
      return [...prev, faculty];
    });

    showToast(`Faculty "${faculty.name}" saved successfully!`, "success");
  };

  const handleDeleteFaculty = async (code: string) => {
    const res = await deleteFacultyMember(code);
    if (!res.success) {
      showToast(res.error || "Failed to delete faculty", "error");
      return;
    }

    setFacultyMembers((prev) => prev.filter((x) => x.code !== code));
    setDeletingFacultyCode(null);
    showToast(`Faculty member removed (${code})`, "success");
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: BATCHES & TIME SLOTS
  // ─────────────────────────────────────────────────────────────
  const handleSaveBatches = async (updated: BatchGroup[]) => {
    const res = await saveBatchGroups(updated);
    if (!res.success) {
      throw new Error(res.error || "Failed to save batches to Supabase");
    }
    setBatchGroups(updated);
    showToast("Batches & Sections updated successfully!", "success");
  };

  const handleSaveTimeSlots = async (updated: PortalTimeSlots) => {
    const res = await savePortalTimeSlots(updated);
    if (!res.success) {
      throw new Error(res.error || "Failed to save time slots to Supabase");
    }
    setPortalTimeSlots(updated);
    showToast("Timetable columns updated successfully!", "success");
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: SYNC & SQL
  // ─────────────────────────────────────────────────────────────
  const handleSyncToSupabase = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(5);
    setSyncStatus("Initiating Supabase sync...");

    const result = await syncAllDataToSupabase((msg, pct) => {
      setSyncStatus(msg);
      setSyncProgress(pct);
    });

    setIsSyncing(false);
    if (result.success) {
      showToast(result.message, "success");
      loadData();
    } else {
      showToast(result.message, "error");
    }
  };

  const handleFetchSql = async () => {
    if (sqlContent) return;
    setIsLoadingSql(true);
    try {
      const res = await fetch("/api/admin/sql");
      const text = await res.text();
      setSqlContent(text);
    } catch {
      showToast("Failed to load SQL file", "error");
    } finally {
      setIsLoadingSql(false);
    }
  };

  const handleCopySql = async () => {
    if (!sqlContent) {
      await handleFetchSql();
    }
    try {
      await navigator.clipboard.writeText(sqlContent);
      setIsCopiedSql(true);
      showToast("Full SQL Code copied to clipboard!", "success");
      setTimeout(() => setIsCopiedSql(false), 3000);
    } catch {
      showToast("Clipboard access denied", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: SETTINGS
  // ─────────────────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateAppSettings(settingsForm);
    if (!res.success) {
      showToast(res.error || "Failed to update settings", "error");
      return;
    }

    if (newAdminPin.trim()) {
      localStorage.setItem("ius_admin_pin", newAdminPin.trim());
      setNewAdminPin("");
      showToast("Settings & Admin PIN updated successfully!", "success");
    } else {
      showToast("Portal settings updated successfully!", "success");
    }

    setAppSettings(settingsForm);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border animate-bounce-subtle text-xs font-bold ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
              : toast.type === "error"
              ? "bg-rose-950/90 text-rose-300 border-rose-500/30"
              : "bg-indigo-950/90 text-indigo-300 border-indigo-500/30"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── TOP HERO & KPI STRIP ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Department Administrator
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                  isSupabaseLive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                {isSupabaseLive ? "Supabase Connected" : "Local Fallback Active"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              IUS Routine Management Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time database administration engine. Add, update, or remove timetable schedules, faculty credentials, and semester policies.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Publish Live Button */}
            <button
              onClick={() => setShowPublishConfirmModal(true)}
              disabled={isPublishing || !publishStatus.hasUnpublishedChanges}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all cursor-pointer ${
                publishStatus.hasUnpublishedChanges
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400/50 animate-pulse"
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              }`}
              title="Publish all draft changes live to students and public portals"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isPublishing
                  ? "Publishing..."
                  : publishStatus.hasUnpublishedChanges
                  ? "Publish Routine Live"
                  : "Published (Live)"}
              </span>
              {publishStatus.hasUnpublishedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            <button
              onClick={handleSyncToSupabase}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              title="Upload current local data into Supabase tables"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync All"}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("database");
                handleFetchSql();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>SQL Code</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-bold transition-all cursor-pointer"
              title="Open public routine website in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Lock Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Sync Progress Bar */}
        {isSyncing && (
          <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>{syncStatus}</span>
              <span className="font-mono">{syncProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* KPI Counts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[11px] font-semibold text-slate-400">Total Classes</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{routineItems.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[11px] font-semibold text-slate-400">Faculty Members</div>
            <div className="text-2xl font-black text-purple-400 mt-0.5">{facultyMembers.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[11px] font-semibold text-slate-400">Active Sections</div>
            <div className="text-2xl font-black text-sky-400 mt-0.5">{sectionsList.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[11px] font-semibold text-slate-400">Portal Status</div>
            <div className="text-xs font-bold mt-1.5 flex items-center gap-1.5">
              {publishStatus.hasUnpublishedChanges ? (
                <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Draft Changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Live Synced
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STAGING / UNPUBLISHED DRAFT ALERT BANNER ── */}
      {publishStatus.hasUnpublishedChanges && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 px-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 backdrop-blur-md text-amber-200 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Unpublished Draft Mode Active</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-[10px] font-black text-amber-200 border border-amber-500/40">
                  Hidden from Students
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                All changes you make are safely preserved in draft mode. Click <strong>"Publish Routine"</strong> when all editing is completed to make them live for all students!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setShowRevertConfirmModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Discard unpublished changes and reset to current live routine"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Discard Draft</span>
            </button>
            <button
              onClick={() => setShowPublishConfirmModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Live Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("routine")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "routine"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Class Routine ({routineItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("faculty")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "faculty"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Directory ({facultyMembers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("database");
            handleFetchSql();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "database"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase SQL & Sync</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Portal Settings</span>
        </button>
      </div>

      {/* ── TAB CONTENT 1: CLASS ROUTINE (SAME INTERFACE AS MAIN SITE, LIVE EDITABLE MODE) ── */}
      {activeTab === "routine" && (
        <AdminRoutineTimetable
          routineData={routineItems}
          onSaveRoutine={handleSaveRoutine}
          onDeleteRoutine={handleDeleteRoutine}
          onDuplicateRoutine={handleDuplicateRoutine}
          facultyList={facultyMembers}
          sectionsList={sectionsList}
          isSupabaseLive={isSupabaseLive}
          batchGroups={batchGroups}
          portalTimeSlots={portalTimeSlots}
          onSaveBatches={handleSaveBatches}
          onSaveTimeSlots={handleSaveTimeSlots}
        />
      )}

      {/* ── TAB CONTENT 2: FACULTY DIRECTORY ── */}
      {activeTab === "faculty" && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                placeholder="Search faculty by name, initials code (e.g. MAA), designation, or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingFaculty(null);
                setIsFacultyModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculty.map((f) => (
              <div
                key={f.code}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={f.imageUrl || "/avatar-placeholder.png"}
                      alt={f.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628522/ius_faculty/eylkudgmeithba6u79ql.png";
                      }}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {f.code}
                        </span>
                        {f.serial && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{f.serial}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">
                        {f.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {f.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 py-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    {f.email && (
                      <div className="truncate">
                        <strong className="text-slate-800 dark:text-slate-200">Email:</strong> {f.email}
                      </div>
                    )}
                    {f.phone && (
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Phone:</strong> {f.phone}
                      </div>
                    )}
                    {f.officeAddress && (
                      <div className="truncate">
                        <strong className="text-slate-800 dark:text-slate-200">Office:</strong> {f.officeAddress}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <Link
                    href={`/faculty/${f.slug || f.cleanSlug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFaculty(f);
                        setIsFacultyModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingFacultyCode(f.code)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Faculty"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 3: SUPABASE & SQL ── */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-500" />
                  <span>Supabase Database & SQL Engine</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connected to: <code className="text-indigo-600 dark:text-indigo-400 font-mono">https://ngmxgqablklfmvxtbqso.supabase.co</code>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isCopiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopiedSql ? "Copied!" : "Copy Full SQL Script"}</span>
                </button>

                <a
                  href="/api/admin/sql"
                  download="supabase_schema_and_seed.sql"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .sql</span>
                </a>

                <a
                  href="https://supabase.com/dashboard/project/ngmxgqablklfmvxtbqso/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Supabase SQL Editor</span>
                </a>
              </div>
            </div>

            {/* Quick Setup Instructions */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
              <div className="font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" />
                <span>How to initialize or reset your database in Supabase:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
                <li>
                  Click the <strong>"Copy Full SQL Script"</strong> button above (or download the file).
                </li>
                <li>
                  Open your <strong>Supabase Dashboard → SQL Editor</strong>.
                </li>
                <li>
                  Paste the SQL code into the editor and click <strong>"Run"</strong>.
                </li>
                <li>
                  It will automatically create <code>routine_items</code>, <code>faculty_members</code>, <code>app_settings</code> tables, setup <strong>Row Level Security (RLS)</strong>, and populate all 323 class schedules & 34 faculty members!
                </li>
                <li>
                  Or simply click <strong>"Sync All to Supabase"</strong> at the top to upload directly through the API!
                </li>
              </ol>
            </div>

            {/* SQL Code Preview */}
            <div className="relative">
              <div className="flex items-center justify-between p-3 rounded-t-2xl bg-slate-800 text-slate-300 text-xs font-mono border-b border-slate-700">
                <span>supabase_schema_and_seed.sql (PostgreSQL + RLS + 323 Classes)</span>
                <button
                  onClick={handleCopySql}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto bg-slate-950 p-4 rounded-b-2xl font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
                {isLoadingSql ? (
                  <div className="text-center py-8 text-slate-500">Loading SQL script...</div>
                ) : (
                  <pre className="whitespace-pre-wrap">{sqlContent || "Click 'Copy Full SQL Script' or open Supabase Editor."}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 4: SETTINGS ── */}
      {activeTab === "settings" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              <span>Portal Configuration & Security</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure global announcements, semester labels, and admin passcode
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Semester Name
              </label>
              <input
                type="text"
                value={settingsForm.semesterName}
                onChange={(e) => setSettingsForm({ ...settingsForm, semesterName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Global Header Announcement
              </label>
              <textarea
                rows={3}
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                placeholder="Important department notice, exam schedule, class cancelation, etc."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium resize-none"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="announcementActive"
                checked={settingsForm.announcementActive}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="announcementActive" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Display announcement banner on website
              </label>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Change Admin Access PIN
              </label>
              <input
                type="text"
                value={newAdminPin}
                onChange={(e) => setNewAdminPin(e.target.value)}
                placeholder="Leave blank to keep current PIN (Default: ius2026)"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Current PIN defaults to <strong className="font-mono text-purple-600 dark:text-purple-400">ius2026</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-98 transition-all cursor-pointer"
            >
              Save Portal Settings
            </button>
          </form>
        </div>
      )}

      {/* ── MODALS ── */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        onSave={handleSaveRoutine}
        initialData={editingRoutine}
        facultyList={facultyMembers}
        sectionsList={sectionsList}
        routineData={routineItems}
      />

      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSave={handleSaveFaculty}
        initialData={editingFaculty}
      />

      {/* Delete Confirmation Modal for Routine */}
      {deletingRoutineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Class Schedule?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this schedule item? This will remove it from the routine.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingRoutineId(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRoutine(deletingRoutineId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              >
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Faculty */}
      {deletingFacultyCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Faculty Member?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove teacher <strong>{deletingFacultyCode}</strong> from the faculty directory?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingFacultyCode(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFaculty(deletingFacultyCode)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              >
                Delete Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Live Confirmation Modal */}
      {showPublishConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <Send className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Publish Routine to Live Site?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  This will make all current draft edits immediately visible to students and faculty.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Total Classes to Publish:</span>
                <span className="font-black text-emerald-400 text-sm">{routineItems.length} Classes</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Target Portals:</span>
                <span className="font-semibold text-slate-200">/section, /today, /teacher, /room</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                <span className="text-slate-400">Semester:</span>
                <span className="font-semibold text-slate-200">{settingsForm.semesterName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Last Live Publish:</span>
                <span className="font-mono text-slate-300">
                  {publishStatus.lastPublishedAt
                    ? new Date(publishStatus.lastPublishedAt).toLocaleString()
                    : "Not yet recorded"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishConfirmModal(false)}
                disabled={isPublishing}
                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                Keep as Draft
              </button>

              <button
                type="button"
                onClick={handlePublishLive}
                disabled={isPublishing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isPublishing ? "animate-spin" : ""}`} />
                <span>{isPublishing ? "Publishing to Live..." : "Yes, Publish to Live Site"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard / Revert Draft Confirmation Modal */}
      {showRevertConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <RotateCcw className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Discard Draft Changes?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to discard all unpublished draft edits? This will restore the routine exactly to what is currently published live.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowRevertConfirmModal(false)}
                disabled={isReverting}
                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Keep Draft Edits
              </button>

              <button
                onClick={handleRevertDraft}
                disabled={isReverting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isReverting ? "animate-spin" : ""}`} />
                <span>{isReverting ? "Reverting..." : "Discard & Reset"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-600/95 text-white border-emerald-400 shadow-emerald-500/25"
                : toast.type === "error"
                ? "bg-rose-600/95 text-white border-rose-400 shadow-rose-500/25"
                : "bg-indigo-600/95 text-white border-indigo-400 shadow-indigo-600/25"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
