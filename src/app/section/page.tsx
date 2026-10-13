"use client";

import React, { useState } from "react";
import { useDynamicRoutine } from "@/lib/useDynamicData";
import { RoutineViewer } from "@/components/RoutineViewer";
import { ExportModal } from "@/components/ExportModal";

export default function SectionPage() {
  const [selectedSection, setSelectedSection] = useState<string>("Section 13A");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const { routineData } = useDynamicRoutine();

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
