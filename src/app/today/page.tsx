"use client";

import React, { useState } from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { TodayScheduleWidget } from "@/components/TodayScheduleWidget";

export default function TodayPage() {
  const [selectedSection, setSelectedSection] = useState<string>("Section 13");
  const routineData = rawRoutineData as unknown as RoutineItem[];

  return (
    <TodayScheduleWidget
      routineData={routineData}
      selectedSection={selectedSection}
      onSectionSelect={setSelectedSection}
    />
  );
}
