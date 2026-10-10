"use client";

import React from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { RetakeBuilder } from "@/components/RetakeBuilder";

export default function RetakePage() {
  const routineData = rawRoutineData as unknown as RoutineItem[];

  return <RetakeBuilder routineData={routineData} />;
}
