"use client";

import React from "react";
import { useDynamicRoutine } from "@/lib/useDynamicData";
import { RetakeBuilder } from "@/components/RetakeBuilder";

export default function RetakePage() {
  const { routineData } = useDynamicRoutine();

  return <RetakeBuilder routineData={routineData} />;
}
