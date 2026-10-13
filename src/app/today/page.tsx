"use client";

import React, { useState } from "react";
import { useDynamicRoutine } from "@/lib/useDynamicData";
import { TodayScheduleWidget } from "@/components/TodayScheduleWidget";

export default function TodayPage() {
  const [selectedSection, setSelectedSection] = useState<string>("Section 13");
  const { routineData } = useDynamicRoutine();

  return (
    <TodayScheduleWidget
      routineData={routineData}
      selectedSection={selectedSection}
      onSectionSelect={setSelectedSection}
    />
  );
}
