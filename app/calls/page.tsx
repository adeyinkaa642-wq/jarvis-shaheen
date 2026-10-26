"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Phone, PhoneCall, PhoneOff, Clock, CheckCircle, XCircle, Plus, Mic, FileText } from "lucide-react";

type CallStatus = "Scheduled" | "Calling" | "Completed" | "No Answer" | "Voicemail" | "Rejected";
type CallType = "Property Video Tour" | "Wholesale Outreach";

interface CallLog {
  id: string;
  to: string;
  contactName: string;
  callType: CallType;
  script: string;
  status: CallStatus;
  scheduledAt: string;
  duration?: string;
  outcome?: string;
  notes?: string;
}

const STATUS_COLORS: Record<CallStatus, string> = {
  "Scheduled": "#fbbf24",
  "Calling": "#a78bfa",
  "Completed": "#34d399",
  "No Answer": "#888",
  "Voicemail": "#93c5fd",
  "Rejected": "#f87171",
};

const VIDEO_TOUR_SCRIPT = `Hi, this is Jarvis calling on behalf of SHAHEEN. I'm reaching out because we noticed your property listing and wanted to offer you a complimentary cinematic video tour that could significantly increase your bookings and rental income. Our professional video tours have helped hosts increase their revenue by up to 40 percent. This is a quick call to see if you'd be open to learning more.`;

const WHOLESALE_SCRIPT = `Hi, my name is Jarvis and I'm calling on behalf of SHAHEEN Real Estate. I'm reaching out because we're actively buying properties in your area and I wanted to see if you might be open to a fair cash offer for your property. We can close quickly, as-is, with no repairs needed and no agent fees. I just have a few quick questions to see if we might be a good fit.`;

const FOLLOWUP_SCRIPT = `Hi, this is Jarvis following up on our previous conversation about your property. I wanted to check in and see if you had any questions or if you're ready to move forward. We have a limited number of spots available this week and I wanted to make sure you don't miss out.`;

const SCRIPTS = [
  { name: "Property Video Tour Pitch", type: "Property Video Tour" as CallType, text: VIDEO_TOUR_SCRIPT },
  { name: "Wholesale Cash Offer", type: "Wholesale Outreach" as CallType, text: WHOLESALE_SCRIPT },
  { name: "Follow-Up Call", type: "Property Video Tour" as CallType, text: FOLLOWUP_SCRIPT },
];

const lbl: React.CSSProperties = {
  fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em",
  textTransform: "uppercase", display: "block", marginBottom: "5px", fontFamily: "Georgia, serif",
};

export default function CallsPage() {
  const { leads, wholesaleDeals, addActivity, approvals, resolveApproval } = useStore();

  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: "C001", to: "+15125550198", contactName: "Robert M.", callType: "Wholesale Outreach",
      script: WHOLESALE_SCRIPT, status: "Scheduled",
      scheduledAt: "2026-10-03 10:00 AM",
    },
    {
      id: "C002", to: "+17135550147", contactName: "Linda C.", callType: "Wholesale Outreach",
      script: WHOLESALE_SCRIPT, status: "Completed",
      scheduledAt: "2026-10-02 2:00 PM", duration: "3m 42s",
      outcome: "Interested — agreed to receive purchase agreement",
    },
    {
      id: "C003", to: "+13105550000", contactName: "Marcus D.", callType: "Property Video Tour",
      script: VIDEO_TOUR_SCRIPT, status: "Voicemail",
      scheduledAt: "2026-10-01 11:00 AM", duration: "0m 45s",
      outcome: "Left voicemail. Will follow up via email.",
    },
  ]);

  const [showSchedule, setShowSchedule] = useState(false);
  const [activeCall, setActiveCall] = useState<CallLog | null>(null);
  const [calling, setCalling] = useState(false);
  const [callResult, setCallResult] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus | "All">("All");

  const [form, setForm] = useState({
    contactName: "", to: "", callType: "Property Video Tour" as CallType,
    scriptIndex: 0, customScript: "", linkId: "",
  });

  const filtered = callLogs.filter((c) => filterStatus === "All" ? true : c.status === filterStatus);

  const pendingCallApprovals = approvals.filter((a) => a.status === "Pending" && a.type === "AI Call");

  async function initiateCall(log: CallLog) {
    setCalling(true);
    setCallResult("");

    // Update status to Calling
    setCallLogs((prev) => prev.map((c) => c.id === log.id ? { ...c, status: "Calling" } : c));

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: log.to, script: log.script, callType: log.callType }),
      });
      const data = await res.json();

      if (data.success) {
        setCallResult(`✅ Jarvis is calling ${log.contactName} at ${log.to}. Call SID: ${data.callSid}`);
        addActivity({ id: `ACT${Date.now()}`, icon: "📞", message: `Jarvis called ${log.contactName} — ${log.callType}`, time: "Just now", type: "system" });
      } else {
        setCallResult(`⚠️ ${data.error}`);
        setCallLogs((prev) => prev.map((c) => c.id === log.id ? { ...c, status: "Scheduled" } : c));
      }
    } catch {
      setCallResult("⚠️ Twilio not configured. Add your API keys in Settings → API Keys to enable live calls.");
      setCallLogs((prev) => prev.map((c) => c.id === log.id ? { ...c, status: "Scheduled" } : c));
    }

    setCalling(false);
  }

  function scheduleCall() {
    if (!form.contactName || !form.to) return;
    const script = form.customScript || SCRIPTS[form.scriptIndex].text;
    const newCall: CallLog = {
      id: `C${Date.now()}`,
      to: form.to, contactName: form.contactName,
      callType: form.callType, script,
      status: "Scheduled",
      scheduledAt: new Date().toLocaleString(),
    };
    setCallLogs((prev) => [newCall, ...prev]);
    addActivity({ id: `ACT${Date.now()}`, icon: "📅", message: `AI call scheduled for ${form.contactName} — ${form.callType}`, time: "Just now", type: "system" });
    setShowSchedule(false);
    setForm({ contactName: "", to: "", callType: "Property Video Tour", scriptIndex: 0, customScript: "", linkId: "" });
  }

  const stats = [
    { label: "Total Calls", value: callLogs.length, color: "#a78bfa", icon: "📞" },
    { label: "Scheduled", value: callLogs.filter((c) => c.status === "Scheduled").length, color: "#fbbf24", icon: "📅" },
    { label: "Completed", value: callLogs.filter((c) => c.status === "Completed").length, color: "#34d399", icon: "✅" },
    { label: "Interested", value: callLogs.filter((c) => c.outcome?.toLowerCase().includes("interest")).length, color: "#c9a84c", icon: "🔥" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0d0d0d, #0a0d1a, #0a0a0a)",
        border: "1px solid #1a1a2e", borderRadius: "14px", padding: "24px 32px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }} />
        <p style={{ fontSize: "0.7rem", color: "#a78bfa", letterSpacing: "0.18em", marginBottom: "6px" }}>JARVIS AI PHONE SYSTEM</p>
        <h2 style={{ fontSize: "1.6rem", fontFamily: "Georgia, serif", background: "linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" }}>
          AI Call Center
        </h2>
        <p style={{ color: "#666", fontSize: "0.82rem", maxWidth: "540px", lineHeight: 1.6 }}>
          Jarvis makes AI-powered outbound calls on your behalf — property video tour pitches and wholesale outreach. You approve before every call. All calls are logged and reported back to you.
        </p>
      </div>

      {/* Twilio setup notice */}
      <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Mic size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontSize: "0.8rem", color: "#a78bfa", marginBottom: "4px", fontWeight: 700 }}>Setup Required for Live Calls</p>
          <p style={{ fontSize: "0.75rem", color: "#666", lineHeight: 1.6 }}>
            To activate live AI calls, add your Twilio credentials in <strong style={{ color: "#aaa" }}>Settings → API Keys</strong>:
            TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.
            Get a free Twilio account at <strong style={{ color: "#a78bfa" }}>twilio.com</strong>. Call scripts are already built and ready to go.
          </p>
        </div>
      </div>

      {/* Pending call approvals */}
      {pendingCallApprovals.length > 0 && (
        <div className="jarvis-card" style={{ padding: "20px 22px", border: "1px solid rgba(167,139,250,0.3)" }}>
          <h3 style={{ fontSize: "0.8rem", color: "#a78bfa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
            ⚠ Calls Awaiting Your Approval
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingCallApprovals.map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px", background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", fontWeight: 700, letterSpacing: "0.07em" }}>AI CALL</span>
                  <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "6px" }}>{a.description}</p>
                  <p style={{ fontSize: "0.68rem", color: "#555", marginTop: "2px" }}>{a.createdAt}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "16px", flexShrink: 0 }}>
                  <button onClick={() => resolveApproval(a.id, "Rejected")} style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontFamily: "Georgia, serif" }}>Reject</button>
                  <button onClick={() => {
                    resolveApproval(a.id, "Approved");
                    const match = callLogs.find((c) => c.contactName.includes(a.description.split(" ")[4] || ""));
                    if (match) initiateCall(match);
                  }} style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.72rem", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Phone size={11} /> Approve & Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {stats.map((s) => (
          <div key={s.label} className="jarvis-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.68rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
                <p style={{ fontSize: "1.9rem", fontFamily: "Georgia, serif", color: s.color, lineHeight: 1.2, marginTop: "4px" }}>{s.value}</p>
              </div>
              <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Call result */}
      {callResult && (
        <div style={{ background: callResult.includes("✅") ? "rgba(52,211,153,0.08)" : "rgba(251,191,36,0.08)", border: `1px solid ${callResult.includes("✅") ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`, borderRadius: "10px", padding: "14px 18px" }}>
          <p style={{ fontSize: "0.82rem", color: callResult.includes("✅") ? "#34d399" : "#fbbf24", lineHeight: 1.6 }}>{callResult}</p>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {(["All", "Scheduled", "Calling", "Completed", "No Answer", "Voicemail"] as const).map((s) => {
          const count = s === "All" ? callLogs.length : callLogs.filter((c) => c.status === s).length;
          const color = s === "All" ? "#888" : STATUS_COLORS[s as CallStatus];
          return (
            <button key={s} onClick={() => setFilterStatus(s as CallStatus | "All")} style={{ padding: "6px 14px", borderRadius: "999px", cursor: "pointer", fontSize: "0.72rem", fontFamily: "Georgia, serif", border: `1px solid ${filterStatus === s ? color : "#1e1e1e"}`, background: filterStatus === s ? `${color}15` : "transparent", color: filterStatus === s ? color : "#666" }}>
              {s} ({count})
            </button>
          );
        })}
        <button className="btn-gold" onClick={() => setShowSchedule(true)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", fontSize: "0.78rem" }}>
          <Plus size={13} /> Schedule Call
        </button>
      </div>

      {/* Call log */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>No calls found.</div>
        )}
        {filtered.map((call) => {
          const sc = STATUS_COLORS[call.status];
          return (
            <div key={call.id} className="jarvis-card" style={{ padding: "18px 22px", borderLeft: `3px solid ${sc}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.9rem", color: "#e8c97a", fontFamily: "Georgia, serif" }}>{call.contactName}</span>
                  <span style={{ fontSize: "0.68rem", color: "#666" }}>{call.to}</span>
                  <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px", background: `${sc}15`, color: sc, border: `1px solid ${sc}30`, fontWeight: 700, letterSpacing: "0.06em" }}>{call.status.toUpperCase()}</span>
                  <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px", background: call.callType === "Property Video Tour" ? "rgba(201,168,76,0.1)" : "rgba(167,139,250,0.1)", color: call.callType === "Property Video Tour" ? "#c9a84c" : "#a78bfa", border: `1px solid ${call.callType === "Property Video Tour" ? "#c9a84c" : "#a78bfa"}30` }}>
                    {call.callType}
                  </span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "#555", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  <Clock size={10} /> {call.scheduledAt} {call.duration && `· ${call.duration}`}
                </p>
                {call.outcome && (
                  <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "4px", fontStyle: "italic" }}>
                    Outcome: {call.outcome}
                  </p>
                )}
                {/* Script preview */}
                <div style={{ marginTop: "8px", padding: "8px 12px", background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "6px" }}>
                  <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FileText size={9} /> Script Preview
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#666", lineHeight: 1.5 }}>
                    {call.script.substring(0, 120)}...
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                {call.status === "Scheduled" && (
                  <button
                    onClick={() => initiateCall(call)}
                    disabled={calling}
                    style={{ padding: "8px 16px", borderRadius: "8px", cursor: calling ? "not-allowed" : "pointer", fontSize: "0.75rem", background: calling ? "#1a1a1a" : "linear-gradient(135deg, #a78bfa, #7c3aed)", border: "none", color: calling ? "#555" : "#fff", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: "5px", opacity: calling ? 0.6 : 1 }}
                  >
                    <PhoneCall size={12} /> {calling ? "Calling..." : "Call Now"}
                  </button>
                )}
                {call.status === "Calling" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "8px" }}>
                    <div className="glow-pulse" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a78bfa" }} />
                    <span style={{ fontSize: "0.72rem", color: "#a78bfa" }}>Live Call</span>
                  </div>
                )}
                {(call.status === "Completed" || call.status === "Voicemail" || call.status === "No Answer") && (
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {call.status === "Completed" ? <CheckCircle size={13} color="#34d399" /> : <PhoneOff size={13} color="#888" />}
                    <span style={{ fontSize: "0.72rem", color: "#555" }}>{call.status}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    const outcome = prompt(`Update outcome for ${call.contactName}:`);
                    if (outcome) setCallLogs((prev) => prev.map((c) => c.id === call.id ? { ...c, outcome, status: "Completed" } : c));
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.68rem", background: "transparent", border: "1px solid #1e1e1e", color: "#555", fontFamily: "Georgia, serif" }}
                >
                  Log Outcome
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SCHEDULE CALL MODAL ───────────────────────────────────────────────── */}
      {showSchedule && (
        <div onClick={() => setShowSchedule(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <PhoneCall size={18} color="#a78bfa" />
              <h2 style={{ fontSize: "1rem", color: "#a78bfa", fontFamily: "Georgia, serif" }}>Schedule AI Call</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={lbl}>Contact Name *</label>
                <input className="jarvis-input" placeholder="John Smith" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Phone Number *</label>
                <input className="jarvis-input" placeholder="+1 555 000 0000" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Call Type</label>
                <select className="jarvis-select" style={{ width: "100%" }} value={form.callType} onChange={(e) => setForm({ ...form, callType: e.target.value as CallType })}>
                  <option>Property Video Tour</option>
                  <option>Wholesale Outreach</option>
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Quick Script Templates</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {SCRIPTS.map((s, i) => (
                    <button key={i} onClick={() => setForm({ ...form, scriptIndex: i, customScript: "" })} style={{ padding: "10px 14px", borderRadius: "8px", cursor: "pointer", textAlign: "left", border: `1px solid ${form.scriptIndex === i && !form.customScript ? "#a78bfa" : "#1e1e1e"}`, background: form.scriptIndex === i && !form.customScript ? "rgba(167,139,250,0.08)" : "#0d0d0d", fontFamily: "Georgia, serif" }}>
                      <p style={{ fontSize: "0.78rem", color: form.scriptIndex === i && !form.customScript ? "#a78bfa" : "#aaa" }}>{s.name}</p>
                      <p style={{ fontSize: "0.68rem", color: "#555", marginTop: "2px" }}>{s.text.substring(0, 80)}...</p>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Custom Script (optional — overrides template)</label>
                <textarea className="jarvis-input" style={{ minHeight: "100px", resize: "vertical", fontSize: "0.8rem" }} placeholder="Write a custom script for Jarvis to say..." value={form.customScript} onChange={(e) => setForm({ ...form, customScript: e.target.value })} />
              </div>
            </div>

            {/* Link to existing lead/deal */}
            <div>
              <label style={lbl}>Link to Lead (optional)</label>
              <select className="jarvis-select" style={{ width: "100%" }} value={form.linkId} onChange={(e) => {
                const lead = leads.find((l) => l.id === e.target.value);
                if (lead) setForm({ ...form, linkId: e.target.value, contactName: lead.hostName, to: "" });
              }}>
                <option value="">— Select property lead —</option>
                {leads.map((l) => <option key={l.id} value={l.id}>{l.hostName} — {l.address}</option>)}
              </select>
            </div>

            <div>
              <label style={lbl}>Link to Wholesale Deal (optional)</label>
              <select className="jarvis-select" style={{ width: "100%" }} value={form.linkId} onChange={(e) => {
                const deal = wholesaleDeals.find((d) => d.id === e.target.value);
                if (deal) setForm({ ...form, linkId: e.target.value, contactName: deal.ownerName, to: deal.ownerPhone });
              }}>
                <option value="">— Select wholesale deal —</option>
                {wholesaleDeals.map((d) => <option key={d.id} value={d.id}>{d.ownerName} — {d.address}</option>)}
              </select>
            </div>

            {/* Script preview */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "12px 14px" }}>
              <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Mic size={9} /> Jarvis Will Say
              </p>
              <p style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.6 }}>
                {form.customScript || SCRIPTS[form.scriptIndex].text}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowSchedule(false)}>Cancel</button>
              <button className="btn-gold" onClick={scheduleCall} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={13} /> Schedule Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
