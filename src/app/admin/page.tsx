"use client";

import React, { useState, useEffect } from "react";
import { AdminAuthModal } from "@/components/admin/AdminAuthModal";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // Check if session exists in localStorage
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("ius_admin_session");
      if (session && session.startsWith("authenticated_")) {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ius_admin_session");
    }
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuthModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
