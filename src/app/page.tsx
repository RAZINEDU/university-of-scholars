import React from "react";
import rawRoutineData from "@/data/routineData.json";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <HeroSection totalClasses={rawRoutineData.length} />
  );
}
