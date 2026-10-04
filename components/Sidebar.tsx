"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Mail,
  CheckSquare,
  Activity,
  Settings,
  Zap,
} from "lucide-react";

const nav = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/leads",      label: "Leads",        icon: Search },
  { href: "/emails",     label: "Emails",       icon: Mail },
  { href: "/approvals",  label: "Approvals",    icon: CheckSquare },
  { href: "/activity",   label: "Activity",     icon: Activity },
  { href: "/settings",   label: "Settings",     icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside
      style={{
        width: "230px",
        minHeight: "100vh",
        background: "#080808",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: "28px 20px 24px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* SW Monogram */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "1.5px solid #c9a84c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            boxShadow: "0 0 12px rgba(201,168,76,0.2)",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 100 100" width="36" height="36">
            <defs>
              <linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8c97a" />
                <stop offset="50%" stopColor="#c9a84c" />
                <stop offset="100%" stopColor="#9a7a2e" />
              </linearGradient>
            </defs>
            {/* S */}
            <text x="8" y="62" fontSize="52" fontFamily="Georgia,serif" fill="url(#gld)" fontWeight="bold">S</text>
            {/* W */}
            <text x="42" y="70" fontSize="44" fontFamily="Georgia,serif" fill="url(#gld)" fontWeight="bold">W</text>
          </svg>
        </div>
        {/* Name */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#c9a84c",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            SHAHEEN
          </div>
          <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.1em", marginTop: "2px" }}>
            JARVIS AI SYSTEM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                fontFamily: "Georgia, serif",
                transition: "all 0.15s",
                background: active ? "rgba(201,168,76,0.1)" : "transparent",
                color: active ? "#c9a84c" : "#888",
                borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Jarvis AI indicator */}
      <div
        style={{
          margin: "12px",
          padding: "12px",
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          borderRadius: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <div
            className="glow-pulse"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#c9a84c",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "0.72rem", color: "#c9a84c", letterSpacing: "0.1em" }}>
            JARVIS ONLINE
          </span>
        </div>
        <div style={{ fontSize: "0.67rem", color: "#555", lineHeight: 1.4 }}>
          AI assistant active &amp; monitoring workflows
        </div>
      </div>

      <div style={{ padding: "12px 16px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Zap size={12} color="#555" />
        <span style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.08em" }}>
          PHASE 1 · v1.0.0
        </span>
      </div>
    </aside>
  );
}
