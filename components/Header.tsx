"use client";
import { Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads":     "Property Leads",
  "/emails":    "Email Workflow",
  "/approvals": "Approvals",
  "/activity":  "Activity Log",
  "/settings":  "Settings",
};

export default function Header() {
  const path = usePathname();
  const title = titles[path] ?? "Jarvis";

  return (
    <header
      style={{
        height: "64px",
        background: "#080808",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h1
          style={{
            fontSize: "1.1rem",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #e8c97a, #c9a84c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notification bell */}
        <button
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888",
            padding: "6px",
            borderRadius: "8px",
            transition: "color 0.2s",
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#c9a84c",
              border: "1.5px solid #080808",
            }}
          />
        </button>

        {/* User avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 10px",
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={14} color="#000" />
          </div>
          <span style={{ fontSize: "0.78rem", color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.06em" }}>
            SHAHEEN
          </span>
        </div>
      </div>
    </header>
  );
}
