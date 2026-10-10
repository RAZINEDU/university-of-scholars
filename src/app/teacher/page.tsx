"use client";

import React from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { TeacherWorkload } from "@/components/TeacherWorkload";

export default function TeacherPage() {
  const routineData = rawRoutineData as unknown as RoutineItem[];

  return <TeacherWorkload routineData={routineData} />;
}
