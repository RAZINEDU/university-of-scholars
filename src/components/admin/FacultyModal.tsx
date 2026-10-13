"use client";

import React, { useState, useEffect } from "react";
import { FacultyMember } from "@/data/teacherData";
import { X, Save, User, Mail, Phone, MapPin, Image as ImageIcon, Sparkles, Building } from "lucide-react";

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: FacultyMember) => Promise<void>;
  initialData?: FacultyMember | null;
}

export const FacultyModal: React.FC<FacultyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<FacultyMember>>({
    code: "",
    name: "",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "",
    officeAddress: "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    bio: "",
    researchInterests: [],
  });

  const [researchStr, setResearchStr] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setResearchStr((initialData.researchInterests || []).join(", "));
    } else {
      setFormData({
        serial: 99,
        code: "",
        name: "",
        designation: "Lecturer",
        department: "Department of Computer Science and Engineering",
        phone: "",
        email: "",
        imageUrl: "",
        officeAddress: "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
        bio: "",
        researchInterests: [],
      });
      setResearchStr("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) {
      setError("Please provide Teacher Name and Initials/Code");
      return;
    }

    setIsSaving(true);
    setError("");

    const code = formData.code.toUpperCase().trim();
    const cleanSlug = formData.cleanSlug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slug = formData.slug || cleanSlug;

    const researchInterests = researchStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const completeFaculty: FacultyMember = {
      serial: formData.serial ?? 99,
      code,
      name: formData.name.trim(),
      designation: formData.designation || "Lecturer",
      department: formData.department || "Department of Computer Science and Engineering",
      slug,
      cleanSlug,
      phone: formData.phone || "",
      email: formData.email || "",
      profileUrl: formData.profileUrl || `https://ius.edu.bd/profile/${slug}`,
      imageUrl: formData.imageUrl || "",
      officeAddress: formData.officeAddress || "",
      bio: formData.bio || "",
      researchInterests,
      education: formData.education || [],
      experience: formData.experience || [],
      publications: formData.publications || [],
      room: formData.room || "",
    };

    try {
      await onSave(completeFaculty);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || "Failed to save faculty profile");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              <span>{initialData ? `Edit Faculty: ${initialData.name}` : "Add New Faculty Profile"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage teacher details, credentials, profile photo, and designations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold">
              {error}
            </div>
          )}

          {/* Photo & Basic Details Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || "Preview"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="w-full space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Photo URL (Cloudinary or Direct Image URL)
              </label>
              <input
                type="url"
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Initials / Code */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Initials / Code *
              </label>
              <input
                type="text"
                required
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MAA, DRA, RBS"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold uppercase focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Engr. Md. Ahsan Arif"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation || ""}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Associate Professor & Head of CSE"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Department of Computer Science and Engineering"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="teacher@ius.edu.bd"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="017XX-XXXXXX"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Office Address */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office / Faculty Room
              </label>
              <input
                type="text"
                value={formData.officeAddress || ""}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                placeholder="Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Research Interests */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Research Interests (Comma separated)
              </label>
              <input
                type="text"
                value={researchStr}
                onChange={(e) => setResearchStr(e.target.value)}
                placeholder="Machine Learning, Data Science, Artificial Intelligence, IoT"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Biography
              </label>
              <textarea
                rows={2}
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Short bio or background statement..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : initialData ? "Update Faculty Profile" : "Create Faculty Member"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
