import React from "react";
import { FacultyDirectory } from "@/components/FacultyDirectory";

export const metadata = {
  title: "Faculty Information Directory | Department of CSE - IUS",
  description: "Official contact information and directory of CSE faculty members at University of Scholars. Direct phone numbers, emails, and designations.",
};

export default function FacultyPage() {
  return (
    <div className="w-full">
      <FacultyDirectory />
    </div>
  );
}
