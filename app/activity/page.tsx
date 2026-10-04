"use client";
import { useStore } from "@/lib/store";
import { Clock, Filter } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS = ["all", "lead", "email", "approval", "payment", "video", "system"] as const;
type FilterType = typeof TYPE_LABELS[number];

const TYPE_COLORS: Record<string, string> = {
  lead: "#c9a84c",
  email: "#93c5fd",
  approval: "#34d399",
  payment: "#a78bfa",
  video: "#fbbf24",
  system: "#888",
};

export default function ActivityPage() {
  const { activity } = useStore();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? activity : activity.filter((a) => a.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <Filter size={14} color="#555" />
        {TYPE_LABELS.map((t) => {
          const count = t === "all" ? activity.length : activity.filter((a) => a.type === t).length;
          const color = t === "all" ? "#888" : TYPE_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "5px 14px", borderRadius: "999px", cursor: "pointer", fontSize: "0.72rem",
                textTransform: "capitalize", fontFamily: "Georgia, serif",
                border: `1px solid ${filter === t ? color : "#1e1e1e"}`,
                background: filter === t ? `${color}15` : "transparent",
                color: filter === t ? color : "#666",
                transition: "all 0.15s",
              }}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="jarvis-card" style={{ padding: "24px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
            No activity to show.
          </div>
        )}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          {filtered.length > 0 && (
            <div
              style={{
                position: "absolute", left: "17px", top: "24px",
                bottom: "24px", width: "1px",
                background: "linear-gradient(to bottom, #c9a84c40, #1a1a1a)",
              }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {filtered.map((item, idx) => {
              const color = TYPE_COLORS[item.type] || "#888";
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex", gap: "16px", padding: "14px 0",
                    borderBottom: idx < filtered.length - 1 ? "1px solid #0f0f0f" : "none",
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: `${color}12`,
                      border: `1px solid ${color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: "0.9rem", position: "relative", zIndex: 1,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.82rem", color: "#ddd", lineHeight: 1.5 }}>
                      {item.message}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <Clock size={10} color="#444" />
                      <span style={{ fontSize: "0.68rem", color: "#555" }}>{item.time}</span>
                      <span
                        style={{
                          fontSize: "0.6rem", padding: "1px 7px", borderRadius: "999px",
                          background: `${color}10`, color: color,
                          border: `1px solid ${color}25`,
                          textTransform: "capitalize", letterSpacing: "0.08em",
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Total Events", value: activity.length, color: "#c9a84c" },
          { label: "Lead Events", value: activity.filter((a) => a.type === "lead").length, color: "#c9a84c" },
          { label: "Email Events", value: activity.filter((a) => a.type === "email").length, color: "#93c5fd" },
        ].map(({ label, value, color }) => (
          <div key={label} className="jarvis-card" style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: "0.7rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
            <p style={{ fontSize: "1.8rem", color, fontFamily: "Georgia, serif", marginTop: "4px" }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
