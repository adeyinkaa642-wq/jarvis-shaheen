"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";
import {
  Search, Mail, CheckSquare, TrendingUp,
  ArrowRight, Home, Clock, DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const { leads, emails, approvals, activity } = useStore();

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      sub: `${leads.filter((l) => l.status === "New").length} new`,
      icon: Home,
      color: "#c9a84c",
    },
    {
      label: "Emails Sent",
      value: emails.filter((e) => e.status !== "Draft").length,
      sub: `${emails.filter((e) => e.status === "Replied").length} replied`,
      icon: Mail,
      color: "#93c5fd",
    },
    {
      label: "Pending Approvals",
      value: approvals.filter((a) => a.status === "Pending").length,
      sub: "awaiting your action",
      icon: CheckSquare,
      color: "#fbbf24",
    },
    {
      label: "Leads Approved",
      value: leads.filter((l) => l.status === "Approved" || l.status === "Paid").length,
      sub: "ready for video",
      icon: TrendingUp,
      color: "#34d399",
    },
  ];

  const pipeline: { status: string; color: string }[] = [
    { status: "New", color: "#888" },
    { status: "Contacted", color: "#93c5fd" },
    { status: "Replied", color: "#fbbf24" },
    { status: "Approved", color: "#34d399" },
    { status: "Paid", color: "#c9a84c" },
    { status: "Video Sent", color: "#a78bfa" },
    { status: "Closed", color: "#555" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d0d0d 0%, #111 50%, #0a0a0a 100%)",
          border: "1px solid #1e1e1e",
          borderRadius: "14px",
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />
        <p style={{ fontSize: "0.72rem", color: "#c9a84c", letterSpacing: "0.18em", marginBottom: "6px" }}>
          WELCOME BACK
        </p>
        <h2
          style={{
            fontSize: "1.8rem",
            fontFamily: "Georgia, serif",
            background: "linear-gradient(135deg, #e8c97a, #c9a84c, #9a7a2e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          SHAHEEN
        </h2>
        <p style={{ color: "#666", fontSize: "0.85rem", maxWidth: "480px", lineHeight: 1.6 }}>
          Jarvis is online and monitoring your property workflows across Zillow, Airbnb, and Realtor.
          {" "}{approvals.filter((a) => a.status === "Pending").length} approval{approvals.filter((a) => a.status === "Pending").length !== 1 ? "s" : ""} awaiting your decision.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="jarvis-card"
              style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "2rem", fontFamily: "Georgia, serif", color: s.color, lineHeight: 1.2, marginTop: "4px" }}>
                    {s.value}
                  </p>
                </div>
                <div
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    background: `${s.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <Icon size={18} color={s.color} />
                </div>
              </div>
              <p style={{ fontSize: "0.72rem", color: "#555" }}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Pipeline */}
        <div className="jarvis-card" style={{ padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Lead Pipeline
            </h3>
            <Link href="/leads" style={{ fontSize: "0.72rem", color: "#666", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pipeline.map(({ status, color }) => {
              const count = leads.filter((l) => l.status === status).length;
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>{status}</span>
                    <span style={{ fontSize: "0.75rem", color }}>{count}</span>
                  </div>
                  <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px" }}>
                    <div
                      style={{
                        height: "100%", width: `${pct}%`,
                        background: color, borderRadius: "2px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="jarvis-card" style={{ padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Recent Activity
            </h3>
            <Link href="/activity" style={{ fontSize: "0.72rem", color: "#666", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {activity.slice(0, 5).map((a) => (
              <div key={a.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1rem", lineHeight: 1 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.78rem", color: "#ccc", lineHeight: 1.4 }}>{a.message}</p>
                  <p style={{ fontSize: "0.68rem", color: "#555", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={10} /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="jarvis-card" style={{ padding: "22px" }}>
        <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
          Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { label: "Find New Leads", icon: Search, href: "/leads", color: "#c9a84c" },
            { label: "Send Outreach Email", icon: Mail, href: "/emails", color: "#93c5fd" },
            { label: "Review Approvals", icon: CheckSquare, href: "/approvals", color: "#fbbf24" },
            { label: "View Activity", icon: TrendingUp, href: "/activity", color: "#34d399" },
          ].map(({ label, icon: Icon, href, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                padding: "18px 12px",
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                borderRadius: "10px",
                textDecoration: "none",
                transition: "border-color 0.2s",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: `${color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon size={20} color={color} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "#aaa", textAlign: "center", fontFamily: "Georgia, serif" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending approvals snapshot */}
      {approvals.filter((a) => a.status === "Pending").length > 0 && (
        <div className="jarvis-card" style={{ padding: "22px", border: "1px solid rgba(201,168,76,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ⚠ Pending Approvals
            </h3>
            <Link href="/approvals" style={{ fontSize: "0.72rem", color: "#c9a84c", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Review all <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {approvals.filter((a) => a.status === "Pending").map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 14px", background: "#0d0d0d",
                  border: "1px solid #1e1e1e", borderRadius: "8px",
                }}
              >
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: "4px", display: "inline-flex" }}>{a.type}</span>
                  <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "4px" }}>{a.description}</p>
                  <p style={{ fontSize: "0.68rem", color: "#555", marginTop: "2px" }}>{a.createdAt}</p>
                </div>
                <Link href="/approvals">
                  <button className="btn-gold" style={{ padding: "7px 16px", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    Review
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
