"use client";
import { useState } from "react";
import { useStore, Approval } from "@/lib/store";
import { CheckCircle, XCircle, Clock, AlertCircle, CheckSquare } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  "Lead Outreach": "#c9a84c",
  "Payment Request": "#34d399",
  "Video Delivery": "#a78bfa",
  "Email Send": "#93c5fd",
};

export default function ApprovalsPage() {
  const { approvals, resolveApproval, leads } = useStore();
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [actionModal, setActionModal] = useState<{ approval: Approval; action: "Approved" | "Rejected" } | null>(null);
  const [noteText, setNoteText] = useState("");

  const filtered = approvals.filter((a) =>
    filter === "All" ? true : a.status === filter
  );

  const pending = approvals.filter((a) => a.status === "Pending").length;

  function confirm() {
    if (!actionModal) return;
    resolveApproval(actionModal.approval.id, actionModal.action, noteText);
    setActionModal(null);
    setNoteText("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header notice */}
      {pending > 0 && (
        <div
          style={{
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: "10px", padding: "14px 18px",
            display: "flex", alignItems: "center", gap: "10px",
          }}
        >
          <AlertCircle size={16} color="#c9a84c" />
          <span style={{ fontSize: "0.82rem", color: "#c9a84c" }}>
            You have <strong>{pending}</strong> pending approval{pending !== 1 ? "s" : ""} that require your decision.
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {(["Pending", "Approved", "Rejected", "All"] as const).map((tab) => {
          const count = tab === "All" ? approvals.length : approvals.filter((a) => a.status === tab).length;
          const colors = { Pending: "#fbbf24", Approved: "#34d399", Rejected: "#f87171", All: "#888" };
          const c = colors[tab];
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "7px 16px", borderRadius: "999px", cursor: "pointer", fontSize: "0.75rem",
                border: `1px solid ${filter === tab ? c : "#1e1e1e"}`,
                background: filter === tab ? `${c}15` : "transparent",
                color: filter === tab ? c : "#666",
                fontFamily: "Georgia, serif",
              }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Approval cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
            No {filter.toLowerCase()} approvals.
          </div>
        )}
        {filtered.map((approval) => {
          const lead = approval.leadId ? leads.find((l) => l.id === approval.leadId) : null;
          const isPending = approval.status === "Pending";
          return (
            <div
              key={approval.id}
              className="jarvis-card"
              style={{
                padding: "20px 22px",
                borderLeft: `3px solid ${
                  approval.status === "Approved" ? "#34d399" :
                  approval.status === "Rejected" ? "#f87171" : "#fbbf24"
                }`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  {/* Type badge */}
                  <div style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.65rem", padding: "3px 10px", borderRadius: "999px",
                        background: `${TYPE_COLORS[approval.type] || "#888"}15`,
                        color: TYPE_COLORS[approval.type] || "#888",
                        border: `1px solid ${TYPE_COLORS[approval.type] || "#888"}30`,
                        fontWeight: 700, letterSpacing: "0.07em",
                      }}
                    >
                      {approval.type.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.88rem", color: "#ddd", lineHeight: 1.5, marginBottom: "8px" }}>
                    {approval.description}
                  </p>

                  {lead && (
                    <p style={{ fontSize: "0.72rem", color: "#555" }}>
                      Lead: {lead.address}, {lead.city} · {lead.platform}
                    </p>
                  )}

                  <p style={{ fontSize: "0.7rem", color: "#444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={10} /> Created: {approval.createdAt}
                  </p>

                  {approval.resolvedAt && (
                    <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "2px" }}>
                      Resolved: {approval.resolvedAt}
                    </p>
                  )}

                  {approval.notes && (
                    <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "8px", fontStyle: "italic" }}>
                      Note: {approval.notes}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
                  {/* Status indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {approval.status === "Pending" && <Clock size={14} color="#fbbf24" />}
                    {approval.status === "Approved" && <CheckCircle size={14} color="#34d399" />}
                    {approval.status === "Rejected" && <XCircle size={14} color="#f87171" />}
                    <span
                      style={{
                        fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
                        color: approval.status === "Pending" ? "#fbbf24" :
                               approval.status === "Approved" ? "#34d399" : "#f87171",
                      }}
                    >
                      {approval.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Action buttons — only for pending */}
                  {isPending && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => { setActionModal({ approval, action: "Rejected" }); setNoteText(""); }}
                        style={{
                          padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.75rem",
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171", fontFamily: "Georgia, serif",
                          display: "flex", alignItems: "center", gap: "5px",
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                      <button
                        onClick={() => { setActionModal({ approval, action: "Approved" }); setNoteText(""); }}
                        style={{
                          padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.75rem",
                          background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                          color: "#34d399", fontFamily: "Georgia, serif",
                          display: "flex", alignItems: "center", gap: "5px",
                        }}
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Confirm Modal ──────────────────────────────────────────────────── */}
      {actionModal && (
        <div
          onClick={() => setActionModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e", border: `1px solid ${actionModal.action === "Approved" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "440px",
              display: "flex", flexDirection: "column", gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {actionModal.action === "Approved"
                ? <CheckCircle size={22} color="#34d399" />
                : <XCircle size={22} color="#f87171" />
              }
              <h2 style={{ fontSize: "1rem", color: actionModal.action === "Approved" ? "#34d399" : "#f87171", fontFamily: "Georgia, serif" }}>
                {actionModal.action === "Approved" ? "Approve" : "Reject"} Request
              </h2>
            </div>

            <p style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.5 }}>
              {actionModal.approval.description}
            </p>

            <div>
              <label style={lbl}>Add a note (optional)</label>
              <textarea
                className="jarvis-input"
                style={{ minHeight: "80px", resize: "vertical" }}
                placeholder={actionModal.action === "Approved" ? "e.g. Proceed immediately." : "e.g. Not the right time."}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setActionModal(null)}>Cancel</button>
              <button
                onClick={confirm}
                style={{
                  padding: "9px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: 700,
                  fontSize: "0.82rem", fontFamily: "Georgia, serif", border: "none",
                  background: actionModal.action === "Approved"
                    ? "linear-gradient(135deg, #34d399, #059669)"
                    : "linear-gradient(135deg, #f87171, #dc2626)",
                  color: "#fff",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {actionModal.action === "Approved" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                Confirm {actionModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = {
  fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em",
  textTransform: "uppercase", display: "block", marginBottom: "5px", fontFamily: "Georgia, serif",
};
