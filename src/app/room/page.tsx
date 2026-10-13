"use client";

import React from "react";
import { useDynamicRoutine } from "@/lib/useDynamicData";
import { RoomSchedule } from "@/components/RoomSchedule";

export default function RoomPage() {
  const { routineData } = useDynamicRoutine();

  return <RoomSchedule routineData={routineData} />;
}
