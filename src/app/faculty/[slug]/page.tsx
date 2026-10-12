import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CSE_FACULTY_MEMBERS, getFacultyBySlug } from "@/data/teacherData";
import { FacultyProfileView } from "@/components/FacultyProfileView";
import { Search, ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const faculty = getFacultyBySlug(slug);

  if (!faculty) {
    return {
      title: "Faculty Member Not Found | Department of CSE - IUS",
      description: "Faculty profile not found in University of Scholars directory."
    };
  }

  return {
    title: `${faculty.name} - ${faculty.designation} | Faculty Directory - IUS`,
    description: `Official profile and contact information for ${faculty.name}, ${faculty.designation} at Department of CSE, University of Scholars. Phone, email, research interests, education, and publications.`,
    openGraph: {
      title: `${faculty.name} | University of Scholars`,
      description: `${faculty.designation} - Department of Computer Science and Engineering, IUS.`,
      images: faculty.imageUrl ? [faculty.imageUrl] : []
    }
  };
}

export async function generateStaticParams() {
  const slugs = new Set<string>();
  CSE_FACULTY_MEMBERS.forEach((f) => {
    slugs.add(f.slug);
    if (f.cleanSlug) slugs.add(f.cleanSlug);
    if (f.code) slugs.add(f.code.toLowerCase());
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function FacultySlugPage({ params }: Props) {
  const { slug } = await params;
  const faculty = getFacultyBySlug(slug);

  if (!faculty) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
          <Search className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Faculty Member Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Could not find any faculty profile matching &ldquo;{decodeURIComponent(slug)}&rdquo;. The teacher may be listed under another designation or name.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Faculty Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FacultyProfileView faculty={faculty} />
    </div>
  );
}
