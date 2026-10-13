"use client";

import React from "react";
import { useDynamicRoutine } from "@/lib/useDynamicData";
import { TeacherWorkload } from "@/components/TeacherWorkload";

export default function TeacherPage() {
  const { routineData } = useDynamicRoutine();

  return <TeacherWorkload routineData={routineData} />;
}
