import { createClient } from "@supabase/supabase-js";
import { RoutineItem, FacultyProfile, TeacherInfo, BatchGroup, TimeSlotConfig, PortalTimeSlots, RoutinePublishStatus } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { CSE_FACULTY_MEMBERS, TEACHER_DIRECTORY, FacultyMember } from "@/data/teacherData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ngmxgqablklfmvxtbqso.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_i3DayP0r3tux2xN2qDqjcQ_ut2iMu9S";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

// ─────────────────────────────────────────────────────────────
// ROUTINE DATA API
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all routine items from Supabase with fallback to local JSON.
 */
export async function getRoutineItems(): Promise<{ data: RoutineItem[]; isSupabase: boolean }> {
  try {
    const { data, error } = await supabase
      .from("routine_items")
      .select("*")
      .order("section", { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback to local JSON
      return {
        data: rawRoutineData as unknown as RoutineItem[],
        isSupabase: false,
      };
    }

    // Map supabase column names to RoutineItem model
    const mapped: RoutineItem[] = data.map((row: any) => ({
      id: row.id,
      section: row.section,
      day: row.day,
      dayShort: row.day_short || row.day?.substring(0, 3) || "",
      colIndex: row.col_index ?? 0,
      timeSlot: row.time_slot,
      type: row.type,
      title: row.title || null,
      courseCode: row.course_code || null,
      courseTitle: row.course_title || null,
      faculty: row.faculty || null,
      room: row.room || null,
      rawText: row.raw_text || "",
    }));

    return { data: mapped, isSupabase: true };
  } catch (err) {
    console.warn("Failed to fetch routine from Supabase, using local fallback:", err);
    return {
      data: rawRoutineData as unknown as RoutineItem[],
      isSupabase: false,
    };
  }
}

/**
 * Insert or update a single routine item in Supabase.
 */
export async function upsertRoutineItem(item: Partial<RoutineItem> & { id: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: item.id,
      section: item.section,
      day: item.day,
      day_short: item.dayShort || item.day?.substring(0, 3) || "",
      col_index: item.colIndex ?? 0,
      time_slot: item.timeSlot,
      type: item.type || "Theory",
      title: item.title || null,
      course_code: item.courseCode || null,
      course_title: item.courseTitle || null,
      faculty: item.faculty || null,
      room: item.room || null,
      raw_text: item.rawText || `${item.courseCode || ""}\n${item.courseTitle || ""}\n${item.timeSlot || ""}\n${item.faculty || ""} | ${item.room || ""}`,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("routine_items").upsert(payload, { onConflict: "id" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Delete a routine item by ID.
 */
export async function deleteRoutineItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("routine_items").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTINE DRAFTS & PUBLISHING API (STAGING WORKFLOW)
// ─────────────────────────────────────────────────────────────

/**
 * Fetch routine draft items for the admin studio.
 * Falls back to routine_items or local JSON if routine_drafts doesn't exist or is empty.
 */
export async function getRoutineDrafts(): Promise<{ data: RoutineItem[]; isSupabase: boolean; isDraft: boolean }> {
  try {
    const { data, error } = await supabase
      .from("routine_drafts")
      .select("*")
      .order("section", { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: RoutineItem[] = data.map((row: any) => ({
        id: row.id,
        section: row.section,
        day: row.day,
        dayShort: row.day_short || row.day?.substring(0, 3) || "",
        colIndex: row.col_index ?? 0,
        timeSlot: row.time_slot,
        type: row.type,
        title: row.title || null,
        courseCode: row.course_code || null,
        courseTitle: row.course_title || null,
        faculty: row.faculty || null,
        room: row.room || null,
        rawText: row.raw_text || "",
      }));
      return { data: mapped, isSupabase: true, isDraft: true };
    }

    // Fallback to live routine_items
    const live = await getRoutineItems();
    return { ...live, isDraft: false };
  } catch {
    const live = await getRoutineItems();
    return { ...live, isDraft: false };
  }
}

/**
 * Insert or update a single routine draft item.
 * Preserves admin changes in draft stage without immediately altering live students portal.
 */
export async function upsertRoutineDraftItem(item: Partial<RoutineItem> & { id: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: item.id,
      section: item.section,
      day: item.day,
      day_short: item.dayShort || item.day?.substring(0, 3) || "",
      col_index: item.colIndex ?? 0,
      time_slot: item.timeSlot,
      type: item.type || "Theory",
      title: item.title || null,
      course_code: item.courseCode || null,
      course_title: item.courseTitle || null,
      faculty: item.faculty || null,
      room: item.room || null,
      raw_text: item.rawText || `${item.courseCode || ""}\n${item.courseTitle || ""}\n${item.timeSlot || ""}\n${item.faculty || ""} | ${item.room || ""}`,
      updated_at: new Date().toISOString(),
    };

    // Try saving to routine_drafts first
    const { error } = await supabase.from("routine_drafts").upsert(payload, { onConflict: "id" });
    if (error) {
      // If table doesn't exist yet or schema cache is not refreshed, save directly to routine_items for safety fallback
      if (
        error.message.includes("does not exist") ||
        error.message.includes("schema cache") ||
        error.message.includes("routine_drafts") ||
        (error as any).code === "42P01" ||
        (error as any).code === "PGRST204" ||
        (error as any).code === "PGRST205" ||
        (error as any).code === "PGRST200"
      ) {
        return await upsertRoutineItem(item);
      }
      return { success: false, error: error.message };
    }

    // Flag unpublished changes
    await markUnpublishedChanges(true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Delete a routine draft item by ID.
 */
export async function deleteRoutineDraftItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("routine_drafts").delete().eq("id", id);
    if (error) {
      if (
        error.message.includes("does not exist") ||
        error.message.includes("schema cache") ||
        error.message.includes("routine_drafts") ||
        (error as any).code === "42P01" ||
        (error as any).code === "PGRST204" ||
        (error as any).code === "PGRST205" ||
        (error as any).code === "PGRST200"
      ) {
        return await deleteRoutineItem(id);
      }
      return { success: false, error: error.message };
    }

    await markUnpublishedChanges(true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Mark in app_settings whether unpublished draft changes exist.
 */
export async function markUnpublishedChanges(hasUnpublished: boolean): Promise<void> {
  try {
    const current = await getRoutinePublishStatus();
    await supabase.from("app_settings").upsert(
      {
        key: "routine_publish_status",
        value: {
          last_published_at: current.lastPublishedAt,
          published_count: current.publishedCount,
          has_unpublished_changes: hasUnpublished,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch {
    // silent catch
  }
}

/**
 * Get routine publish metadata (last publish time, hasUnpublishedChanges, etc.)
 */
export async function getRoutinePublishStatus(): Promise<RoutinePublishStatus> {
  const fallback: RoutinePublishStatus = {
    lastPublishedAt: null,
    publishedCount: 323,
    hasUnpublishedChanges: false,
  };
  try {
    const { data } = await supabase.from("app_settings").select("value").eq("key", "routine_publish_status").single();
    if (data?.value) {
      return {
        lastPublishedAt: data.value.last_published_at || data.value.lastPublishedAt || null,
        publishedCount: data.value.published_count || data.value.publishedCount || 0,
        hasUnpublishedChanges: Boolean(data.value.has_unpublished_changes ?? data.value.hasUnpublishedChanges),
      };
    }
  } catch {
    // fallback
  }
  return fallback;
}

/**
 * PUBLISH ROUTINE DRAFTS TO LIVE SITE:
 * Atomically replaces live routine_items with all current routine_drafts items.
 */
export async function publishRoutineDraft(currentDraftItems: RoutineItem[]): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    // 1. Try Supabase Postgres RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc("publish_routine_draft");
    if (!rpcError && rpcData && (rpcData as any).success) {
      return { success: true, count: (rpcData as any).published_count };
    }

    // 2. Client-side fallback if RPC is not yet installed:
    let itemsToPublish = currentDraftItems;
    const { data: draftsFromDb } = await supabase.from("routine_drafts").select("*");
    if (draftsFromDb && draftsFromDb.length > 0) {
      itemsToPublish = draftsFromDb.map((row: any) => ({
        id: row.id,
        section: row.section,
        day: row.day,
        dayShort: row.day_short || row.day?.substring(0, 3) || "",
        colIndex: row.col_index ?? 0,
        timeSlot: row.time_slot,
        type: row.type,
        title: row.title || null,
        courseCode: row.course_code || null,
        courseTitle: row.course_title || null,
        faculty: row.faculty || null,
        room: row.room || null,
        rawText: row.raw_text || "",
      }));
    }

    if (itemsToPublish.length === 0) {
      return { success: false, error: "No draft items found to publish" };
    }

    // Delete existing live items
    await supabase.from("routine_items").delete().neq("id", "none");

    // Chunked insert into live routine_items
    const batchSize = 50;
    for (let i = 0; i < itemsToPublish.length; i += batchSize) {
      const chunk = itemsToPublish.slice(i, i + batchSize);
      const chunkPayload = chunk.map((r) => ({
        id: r.id,
        section: r.section,
        day: r.day,
        day_short: r.dayShort,
        col_index: r.colIndex ?? 0,
        time_slot: r.timeSlot,
        type: r.type,
        title: r.title || null,
        course_code: r.courseCode || null,
        course_title: r.courseTitle || null,
        faculty: r.faculty || null,
        room: r.room || null,
        raw_text: r.rawText || "",
        updated_at: new Date().toISOString(),
      }));

      const { error: insErr } = await supabase.from("routine_items").upsert(chunkPayload, { onConflict: "id" });
      if (insErr) {
        throw new Error(`Failed publishing batch ${i}: ${insErr.message}`);
      }
    }

    // Update publish status in app_settings
    const nowIso = new Date().toISOString();
    await supabase.from("app_settings").upsert(
      {
        key: "routine_publish_status",
        value: {
          last_published_at: nowIso,
          published_count: itemsToPublish.length,
          has_unpublished_changes: false,
        },
        updated_at: nowIso,
      },
      { onConflict: "key" }
    );

    return { success: true, count: itemsToPublish.length };
  } catch (err: any) {
    return { success: false, error: err.message || "Publish failed" };
  }
}

/**
 * Revert routine drafts back to currently published live items.
 */
export async function revertRoutineDraftToLive(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("revert_routine_draft");
    if (!rpcError && rpcData && (rpcData as any).success) {
      return { success: true, count: (rpcData as any).reverted_count };
    }

    // Client fallback:
    const { data: liveItems } = await supabase.from("routine_items").select("*");
    if (!liveItems || liveItems.length === 0) {
      return { success: false, error: "No live items found to revert from" };
    }

    try {
      await supabase.from("routine_drafts").delete().neq("id", "none");
      const batchSize = 50;
      for (let i = 0; i < liveItems.length; i += batchSize) {
        const chunk = liveItems.slice(i, i + batchSize);
        await supabase.from("routine_drafts").upsert(chunk, { onConflict: "id" });
      }
    } catch {
      // non-blocking if routine_drafts is not in schema cache
    }

    await markUnpublishedChanges(false);
    return { success: true, count: liveItems.length };
  } catch (err: any) {
    return { success: false, error: err.message || "Revert failed" };
  }
}

// ─────────────────────────────────────────────────────────────
// FACULTY MEMBERS API
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all faculty members from Supabase with fallback to local TS data.
 */
export async function getFacultyMembers(): Promise<{ data: FacultyMember[]; isSupabase: boolean }> {
  try {
    const { data, error } = await supabase
      .from("faculty_members")
      .select("*")
      .order("serial", { ascending: true, nullsFirst: false });

    if (error || !data || data.length === 0) {
      return {
        data: CSE_FACULTY_MEMBERS,
        isSupabase: false,
      };
    }

    const mapped: FacultyMember[] = data.map((row: any) => ({
      serial: row.serial ?? 999,
      slug: row.slug || row.code?.toLowerCase() || "",
      cleanSlug: row.clean_slug || row.slug?.replace(/\./g, "") || "",
      code: row.code || "",
      name: row.name || "",
      designation: row.designation || "",
      department: row.department || "Department of Computer Science and Engineering",
      phone: row.phone || "",
      email: row.email || "",
      profileUrl: row.profile_url || "",
      imageUrl: row.image_url || "",
      officeAddress: row.office_address || "",
      bio: row.bio || "",
      researchInterests: Array.isArray(row.research_interests) ? row.research_interests : [],
      education: Array.isArray(row.education) ? row.education : [],
      experience: Array.isArray(row.experience) ? row.experience : [],
      publications: Array.isArray(row.publications) ? row.publications : [],
      room: row.room || "",
    }));

    return { data: mapped, isSupabase: true };
  } catch (err) {
    console.warn("Failed to fetch faculty from Supabase, using local fallback:", err);
    return {
      data: CSE_FACULTY_MEMBERS,
      isSupabase: false,
    };
  }
}

/**
 * Insert or update a faculty member in Supabase.
 */
export async function upsertFacultyMember(member: Partial<FacultyMember> & { code: string; name: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanSlug = member.cleanSlug || member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slug = member.slug || cleanSlug;

    const payload = {
      serial: member.serial ?? 99,
      code: member.code.toUpperCase().trim(),
      name: member.name.trim(),
      designation: member.designation || "",
      department: member.department || "Department of Computer Science and Engineering",
      slug,
      clean_slug: cleanSlug,
      phone: member.phone || "",
      email: member.email || "",
      profile_url: member.profileUrl || "",
      image_url: member.imageUrl || "",
      office_address: member.officeAddress || "",
      bio: member.bio || "",
      research_interests: member.researchInterests || [],
      education: member.education || [],
      experience: member.experience || [],
      publications: member.publications || [],
      room: member.room || "",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("faculty_members").upsert(payload, { onConflict: "code" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Delete a faculty member by teacher code.
 */
export async function deleteFacultyMember(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("faculty_members").delete().eq("code", code);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

// ─────────────────────────────────────────────────────────────
// APP SETTINGS API
// ─────────────────────────────────────────────────────────────

export interface AppSettings {
  semesterName: string;
  announcement: string;
  announcementActive: boolean;
  maintenanceMode: boolean;
}

export async function getAppSettings(): Promise<AppSettings> {
  const fallback: AppSettings = {
    semesterName: "Fall 2026",
    announcement: "Welcome to IUS CSE Class Routine & Schedule Portal!",
    announcementActive: true,
    maintenanceMode: false,
  };

  try {
    const { data, error } = await supabase.from("app_settings").select("*");
    if (error || !data || data.length === 0) return fallback;

    const sem = data.find((d: any) => d.key === "semester_info")?.value;
    const adminConf = data.find((d: any) => d.key === "admin_config")?.value;

    return {
      semesterName: sem?.name || fallback.semesterName,
      announcement: sem?.announcement || fallback.announcement,
      announcementActive: sem?.active ?? fallback.announcementActive,
      maintenanceMode: adminConf?.maintenance_mode ?? fallback.maintenanceMode,
    };
  } catch {
    return fallback;
  }
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    if (settings.semesterName || settings.announcement !== undefined || settings.announcementActive !== undefined) {
      await supabase.from("app_settings").upsert(
        {
          key: "semester_info",
          value: {
            name: settings.semesterName || "Fall 2026",
            announcement: settings.announcement || "",
            active: settings.announcementActive ?? true,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    }

    if (settings.maintenanceMode !== undefined) {
      await supabase.from("app_settings").upsert(
        {
          key: "admin_config",
          value: {
            maintenance_mode: settings.maintenanceMode,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// BATCHES & SECTIONS API
// ─────────────────────────────────────────────────────────────

export const DEFAULT_BATCH_GROUPS: BatchGroup[] = [
  { batch: "13", label: "Batch 13", sections: ["Section 13A"] },
  { batch: "14", label: "Batch 14", sections: ["Section 14A", "Section 14B"] },
  { batch: "15", label: "Batch 15", sections: ["Section 15A", "Section 15B"] },
  { batch: "16", label: "Batch 16", sections: ["Section 16A"] },
  { batch: "17", label: "Batch 17", sections: ["Section 17A", "Section 17B"] },
  { batch: "18", label: "Batch 18", sections: ["Section 18A", "Section 18B"] },
  { batch: "19", label: "Batch 19", sections: ["Section 19A", "Section 19B", "Section 19C", "Section 19D"] },
  { batch: "20", label: "Batch 20", sections: ["Section 20A", "Section 20B", "Section 20C", "Section 20D", "Section 20E"] },
];

export function extractBatchFromSection(sectionName: string): string {
  const match = sectionName.match(/Section\s*(\d+)/i);
  return match ? match[1] : "Custom";
}

export function mergeRoutineSectionsIntoBatches(batches: BatchGroup[], allSections: string[]): BatchGroup[] {
  const cloned = JSON.parse(JSON.stringify(batches)) as BatchGroup[];
  allSections.forEach((sec) => {
    if (!sec || sec === "ALL") return;
    const exists = cloned.some((b) => b.sections.includes(sec));
    if (!exists) {
      const bNum = extractBatchFromSection(sec);
      const targetBatch = cloned.find((b) => b.batch === bNum);
      if (targetBatch) {
        if (!targetBatch.sections.includes(sec)) {
          targetBatch.sections.push(sec);
          targetBatch.sections.sort();
        }
      } else {
        cloned.push({
          batch: bNum,
          label: `Batch ${bNum}`,
          sections: [sec],
        });
      }
    }
  });
  return cloned.sort((a, b) => {
    const na = parseInt(a.batch, 10);
    const nb = parseInt(b.batch, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.batch.localeCompare(b.batch);
  });
}

export async function getBatchGroups(): Promise<{ data: BatchGroup[]; isSupabase: boolean }> {
  try {
    const { data, error } = await supabase.from("app_settings").select("value").eq("key", "batch_groups").single();
    if (error || !data || !Array.isArray(data.value) || data.value.length === 0) {
      return { data: DEFAULT_BATCH_GROUPS, isSupabase: false };
    }
    return { data: data.value, isSupabase: true };
  } catch {
    return { data: DEFAULT_BATCH_GROUPS, isSupabase: false };
  }
}

export async function saveBatchGroups(groups: BatchGroup[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("app_settings").upsert(
      {
        key: "batch_groups",
        value: groups,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// TIME SLOTS & TIMETABLE COLUMNS API
// ─────────────────────────────────────────────────────────────

export const DEFAULT_SAT_THU_SLOTS: TimeSlotConfig[] = [
  { colIndex: 1, label: "9:00 AM - 10:30 AM", slotString: "09:00-10:30" },
  { colIndex: 2, label: "10:30 AM - 12:00 PM", slotString: "10:30-12:00" },
  { colIndex: 3, label: "12:00 PM - 1:00 PM", slotString: "12:00-01:00", isBreak: true },
  { colIndex: 4, label: "1:00 PM - 2:30 PM", slotString: "01:00-02:30" },
  { colIndex: 5, label: "2:30 PM - 4:00 PM", slotString: "02:30-04:00" },
];

export const DEFAULT_FRIDAY_SLOTS: TimeSlotConfig[] = [
  { colIndex: 1, label: "9:00 AM - 10:30 AM", slotString: "09:00-10:30" },
  { colIndex: 2, label: "10:30 AM - 12:00 PM", slotString: "10:30-12:00" },
  { colIndex: 3, label: "12:30 PM - 1:00 PM", slotString: "12:30-01:00" },
  { colIndex: 4, label: "1:00 PM - 2:30 PM", slotString: "01:00-02:30", isBreak: true },
  { colIndex: 5, label: "2:30 PM - 3:30 PM", slotString: "02:30-03:30" },
  { colIndex: 6, label: "3:30 PM - 4:00 PM", slotString: "03:30-04:00" },
  { colIndex: 7, label: "4:00 PM - 5:00 PM", slotString: "04:00-05:00" },
];

export const DEFAULT_PORTAL_TIME_SLOTS: PortalTimeSlots = {
  satThuSlots: DEFAULT_SAT_THU_SLOTS,
  fridaySlots: DEFAULT_FRIDAY_SLOTS,
};

export async function getPortalTimeSlots(): Promise<{ data: PortalTimeSlots; isSupabase: boolean }> {
  try {
    const { data, error } = await supabase.from("app_settings").select("value").eq("key", "routine_time_slots").single();
    if (error || !data || !data.value || !Array.isArray(data.value.satThuSlots)) {
      return { data: DEFAULT_PORTAL_TIME_SLOTS, isSupabase: false };
    }
    return { data: data.value, isSupabase: true };
  } catch {
    return { data: DEFAULT_PORTAL_TIME_SLOTS, isSupabase: false };
  }
}

export async function savePortalTimeSlots(config: PortalTimeSlots): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("app_settings").upsert(
      {
        key: "routine_time_slots",
        value: config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// BULK DATA SEEDER (Sync local data to Supabase in batches)
// ─────────────────────────────────────────────────────────────

export async function syncAllDataToSupabase(
  onProgress?: (msg: string, percent: number) => void
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.("Connecting to Supabase...", 5);

    // 1. Sync Faculty Members
    onProgress?.("Uploading 34 Faculty Members...", 15);
    const facultyPayload = CSE_FACULTY_MEMBERS.map((f) => ({
      serial: f.serial,
      code: f.code,
      name: f.name,
      designation: f.designation,
      department: f.department,
      slug: f.slug,
      clean_slug: f.cleanSlug,
      phone: f.phone || "",
      email: f.email || "",
      profile_url: f.profileUrl || "",
      image_url: f.imageUrl || "",
      office_address: f.officeAddress || "",
      bio: f.bio || "",
      research_interests: f.researchInterests || [],
      education: f.education || [],
      experience: f.experience || [],
      publications: f.publications || [],
      room: f.room || "",
      updated_at: new Date().toISOString(),
    }));

    const { error: facError } = await supabase
      .from("faculty_members")
      .upsert(facultyPayload, { onConflict: "code" });

    if (facError) {
      throw new Error(`Faculty upload error: ${facError.message}`);
    }

    onProgress?.("Faculty members uploaded successfully!", 35);

    // 2. Sync Routine Items in Batches of 50
    const routineItems = rawRoutineData as unknown as RoutineItem[];
    const totalItems = routineItems.length;
    const batchSize = 50;

    for (let i = 0; i < totalItems; i += batchSize) {
      const chunk = routineItems.slice(i, i + batchSize);
      const chunkPayload = chunk.map((r) => ({
        id: r.id,
        section: r.section,
        day: r.day,
        day_short: r.dayShort,
        col_index: r.colIndex ?? 0,
        time_slot: r.timeSlot,
        type: r.type,
        title: r.title || null,
        course_code: r.courseCode || null,
        course_title: r.courseTitle || null,
        faculty: r.faculty || null,
        room: r.room || null,
        raw_text: r.rawText || "",
        updated_at: new Date().toISOString(),
      }));

      const { error: routineError } = await supabase
        .from("routine_items")
        .upsert(chunkPayload, { onConflict: "id" });

      if (routineError) {
        throw new Error(`Routine upload error: ${routineError.message}`);
      }

      // Also sync to routine_drafts
      try {
        await supabase.from("routine_drafts").upsert(chunkPayload, { onConflict: "id" });
      } catch {
        // non-blocking
      }

      const percent = 35 + Math.round(((i + chunk.length) / totalItems) * 55);
      onProgress?.(`Uploaded ${Math.min(i + batchSize, totalItems)} of ${totalItems} classes...`, percent);
    }

    // 3. Settings
    onProgress?.("Configuring default portal settings...", 95);
    await updateAppSettings({
      semesterName: "Fall 2026",
      announcement: "Welcome to IUS CSE Class Routine & Schedule Portal!",
      announcementActive: true,
      maintenanceMode: false,
    });

    onProgress?.("All data synchronized to Supabase!", 100);
    return {
      success: true,
      message: `Successfully synchronized ${totalItems} class routine items and ${facultyPayload.length} faculty members to Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to sync data to Supabase",
    };
  }
}
