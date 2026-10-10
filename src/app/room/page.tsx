"use client";

import React from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { RoomSchedule } from "@/components/RoomSchedule";

export default function RoomPage() {
  const routineData = rawRoutineData as unknown as RoutineItem[];

  return <RoomSchedule routineData={routineData} />;
}
