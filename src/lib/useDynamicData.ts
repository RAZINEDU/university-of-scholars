"use client";

import { useState, useEffect } from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { getRoutineItems, getFacultyMembers, supabase } from "@/lib/supabaseClient";
import { FacultyMember, CSE_FACULTY_MEMBERS } from "@/data/teacherData";

export function useDynamicRoutine() {
  const [routineData, setRoutineData] = useState<RoutineItem[]>(rawRoutineData as unknown as RoutineItem[]);
  const [isSupabase, setIsSupabase] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLatest = () => {
      getRoutineItems().then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setRoutineData(res.data);
          setIsSupabase(res.isSupabase);
        }
      }).catch(() => {});
    };

    // 1. Initial fetch from Supabase
    fetchLatest();

    // 2. Refetch when window regains focus (e.g. user edits in /admin and switches to /section tab)
    const handleFocus = () => {
      fetchLatest();
    };
    window.addEventListener("focus", handleFocus);

    // 3. Refetch when custom routine updated event fires (within the same tab)
    const handleUpdate = () => {
      fetchLatest();
    };
    window.addEventListener("ius_routine_updated", handleUpdate);

    // 4. Refetch on cross-tab storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ius_routine_last_update") {
        fetchLatest();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 5. Supabase Realtime — auto-update on ANY DB change to routine_items
    //    This makes /section update instantly when admin saves.
    const channel = supabase
      .channel("routine_items_realtime")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "routine_items" },
        () => {
          if (isMounted) fetchLatest();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("ius_routine_updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
      supabase.removeChannel(channel);
    };
  }, []);

  return { routineData, isSupabase };
}

export function useDynamicFaculty() {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>(CSE_FACULTY_MEMBERS);
  const [isSupabase, setIsSupabase] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLatest = () => {
      getFacultyMembers().then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setFacultyMembers(res.data);
          setIsSupabase(res.isSupabase);
        }
      }).catch(() => {});
    };

    fetchLatest();
    window.addEventListener("focus", fetchLatest);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", fetchLatest);
    };
  }, []);

  return { facultyMembers, isSupabase };
}

export function useDynamicBatches() {
  const [batches, setBatches] = useState<import("@/types/routine").BatchGroup[]>([]);
  const [isSupabase, setIsSupabase] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLatest = () => {
      import("@/lib/supabaseClient").then(({ getBatchGroups, DEFAULT_BATCH_GROUPS }) => {
        getBatchGroups().then((res) => {
          if (isMounted) {
            setBatches(res.data || DEFAULT_BATCH_GROUPS);
            setIsSupabase(res.isSupabase);
          }
        }).catch(() => {
          if (isMounted) setBatches(DEFAULT_BATCH_GROUPS);
        });
      });
    };

    fetchLatest();
    window.addEventListener("focus", fetchLatest);
    window.addEventListener("ius_routine_updated", fetchLatest);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", fetchLatest);
      window.removeEventListener("ius_routine_updated", fetchLatest);
    };
  }, []);

  return { batches, setBatches, isSupabase };
}

export function useDynamicTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<import("@/types/routine").PortalTimeSlots | null>(null);
  const [isSupabase, setIsSupabase] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    import("@/lib/supabaseClient").then(({ getPortalTimeSlots, DEFAULT_PORTAL_TIME_SLOTS }) => {
      getPortalTimeSlots().then((res) => {
        if (isMounted) {
          setTimeSlots(res.data || DEFAULT_PORTAL_TIME_SLOTS);
          setIsSupabase(res.isSupabase);
        }
      }).catch(() => {
        if (isMounted) setTimeSlots(DEFAULT_PORTAL_TIME_SLOTS);
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return { timeSlots, setTimeSlots, isSupabase };
}
