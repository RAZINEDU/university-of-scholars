import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "The International University of Scholars - CSE Class Routine & Schedule Portal Fall 2026";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  let logoBase64 = "";
  try {
    const logoData = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
  } catch (err) {
    console.error("Failed to load logo for OG image:", err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0B1120",
          backgroundImage: "radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(245, 158, 11, 0.16) 0%, transparent 45%)",
          padding: "48px 56px",
          justifyContent: "space-between",
          border: "10px solid #1E293B",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Row with Official University Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <div
              style={{
                width: "92px",
                height: "92px",
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                border: "2px solid #E2E8F0",
              }}
            >
              {logoBase64 ? (
                <img
                  src={logoBase64}
                  width={76}
                  height={76}
                  style={{ objectFit: "contain" }}
                  alt="IUS Official Logo"
                />
              ) : (
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#1E3A8A" }}>IUS</div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#FFFFFF", letterSpacing: "-0.5px" }}>
                The International University of Scholars
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#F59E0B", marginTop: "3px" }}>
                Department of Computer Science & Engineering (CSE)
              </span>
            </div>
          </div>

          {/* Fall 2026 Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.18)",
              border: "2px solid rgba(99, 102, 241, 0.4)",
              color: "#A5B4FC",
              fontSize: "16px",
              fontWeight: "800",
            }}
          >
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span>FALL 2026 SEMESTER</span>
          </div>
        </div>

        {/* Central Title and Highlights */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "14px" }}>
          <div
            style={{
              fontSize: "54px",
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: "1.12",
              letterSpacing: "-1.5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Interactive Class Routine &</span>
            <span style={{ color: "#818CF8" }}>Schedule Clash Checker Portal</span>
          </div>

          <p
            style={{
              fontSize: "21px",
              color: "#94A3B8",
              marginTop: "16px",
              fontWeight: "500",
              maxWidth: "1000px",
              lineHeight: "1.38",
            }}
          >
            Complete Class Routines for 19 Sections, Real-time Retake Conflict Detection, Teacher Consultation Hours & Free Room Finder.
          </p>
        </div>

        {/* Bottom Feature Badges & URL */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid rgba(255,255,255,0.1)", paddingTop: "22px" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: "14px", backgroundColor: "#1E293B", color: "#E2E8F0", fontSize: "16px", fontWeight: "700", border: "1px solid #334155" }}>
              📅 19 Section Routines
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: "14px", backgroundColor: "#1E293B", color: "#FBBF24", fontSize: "16px", fontWeight: "700", border: "1px solid #334155" }}>
              ⚡ 0-Clash Retake Builder
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: "14px", backgroundColor: "#1E293B", color: "#34D399", fontSize: "16px", fontWeight: "700", border: "1px solid #334155" }}>
              👨‍🏫 Teacher Schedules
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: "14px", backgroundColor: "#1E293B", color: "#38BDF8", fontSize: "16px", fontWeight: "700", border: "1px solid #334155" }}>
              🏫 Room Availability
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", color: "#CBD5E1", fontSize: "18px", fontWeight: "800" }}>
            🔗 iuscse.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
