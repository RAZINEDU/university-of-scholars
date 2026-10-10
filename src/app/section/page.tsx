"use client";

import React, { useState } from "react";
import { RoutineItem } from "@/types/routine";
import rawRoutineData from "@/data/routineData.json";
import { RoutineViewer } from "@/components/RoutineViewer";
import { ExportModal } from "@/components/ExportModal";

export default function SectionPage() {
  const [selectedSection, setSelectedSection] = useState<string>("Section 13");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const routineData = rawRoutineData as unknown as RoutineItem[];

  return (
    <>
      <RoutineViewer
        routineData={routineData}
        selectedSection={selectedSection}
        onSectionSelect={setSelectedSection}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        routineData={routineData}
        selectedSection={selectedSection}
      />
    </>
  );
}
