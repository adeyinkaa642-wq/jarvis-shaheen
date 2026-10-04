"use client";
import { useState } from "react";
import { useStore, Email, EmailStatus } from "@/lib/store";
import { Plus, Send, Clock, CheckCircle, XCircle, FileText, Mail } from "lucide-react";

const STATUS_COLORS: Record<EmailStatus, string> = {
  Draft: "#888",
  Sent: "#93c5fd",
  Replied: "#34d399",
  "No Reply": "#f87171",
};

const TEMPLATES = [
  {
    name: "Cinematic Tour Intro",
    subject: "Professional Cinematic Tour for Your Property",
    body: `Hi [Host Name],

I came across your listing at [Property Address] and wanted to reach out about creating a stunning cinematic video tour for your property.

A high-quality video tour can significantly increase your booking rates and attract premium clients. Our cinematic tours are professionally produced with drone footage, interior walkthroughs, and atmospheric music.

Would you be open to a quick conversation about how we can showcase your property?

Best regards,
SHAHEEN`,
  },
  {
    name: "Airbnb Host Outreach",
    subject: "Elevate Your Airbnb Listing with a Cinematic Tour",
    body: `Hi [Host Name],

Your Airbnb listing at [Property Address] caught my eye — it's a beautiful property that deserves premium exposure.

I specialize in creating cinematic property video tours that help hosts like you stand out, increase views, and command higher nightly rates.

I'd love to discuss how we can take your listing to the next level.

Best regards,
SHAHEEN`,
  },
  {
    name: "Realtor Outreach",
    subject: "Luxury Video Tour for [Property Address]",
    body: `Hi [Realtor Name],

I noticed your listing at [Property Address] and wanted to introduce our luxury cinematic property tour service.

Our video tours are used by top realtors across the US to sell properties faster and at higher prices. A well-produced video can be the deciding factor for out-of-state buyers.

Would you be interested in discussing how we can work together?

Best regards,
SHAHEEN`,
  },
  {
    name: "Follow-Up",
    subject: "Following Up — Cinematic Tour for Your Property",
    body: `Hi [Host Name],

I wanted to follow up on my previous message about creating a cinematic video tour for your property at [Property Address].

I understand you're busy, but I genuinely believe a high-quality video could make a significant difference for your listing.

Would you have 10 minutes this week for a quick call?

Best regards,
SHAHEEN`,
  },
];

export default function EmailsPage() {
  const { emails, leads, addEmail, updateEmailStatus, addActivity } = useStore();
  const [showCompose, setShowCompose] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EmailStatus | "All">("All");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const [form, setForm] = useState({
    to: "", subject: "", body: "", leadId: "",
  });

  const filtered = emails.filter((e) =>
    filterStatus === "All" ? true : e.status === filterStatus
  );

  function applyTemplate(idx: number) {
    setSelectedTemplate(idx);
    setForm((f) => ({
      ...f,
      subject: TEMPLATES[idx].subject,
      body: TEMPLATES[idx].body,
    }));
  }

  function handleSend(asDraft = false) {
    if (!form.to || !form.subject) return;
    const now = new Date().toLocaleString();
    const newEmail: Email = {
      id: `E${Date.now()}`,
      to: form.to,
      subject: form.subject,
      body: form.body,
      status: asDraft ? "Draft" : "Sent",
      leadId: form.leadId || undefined,
      sentAt: asDraft ? undefined : now,
    };
    addEmail(newEmail);
    if (!asDraft) {
      addActivity({
        id: `ACT${Date.now()}`,
        icon: "📧",
        message: `Outreach email sent to ${form.to}`,
        time: "Just now",
        type: "email",
      });
    }
    setShowCompose(false);
    setForm({ to: "", subject: "", body: "", leadId: "" });
  }

  const stats: { label: string; status: EmailStatus | "All"; icon: React.ReactNode; color: string }[] = [
    { label: "All", status: "All", icon: <Mail size={14} />, color: "#888" },
    { label: "Draft", status: "Draft", icon: <FileText size={14} />, color: "#888" },
    { label: "Sent", status: "Sent", icon: <Send size={14} />, color: "#93c5fd" },
    { label: "Replied", status: "Replied", icon: <CheckCircle size={14} />, color: "#34d399" },
    { label: "No Reply", status: "No Reply", icon: <XCircle size={14} />, color: "#f87171" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {stats.map(({ label, status, icon, color }) => {
          const count = status === "All" ? emails.length : emails.filter((e) => e.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "999px", cursor: "pointer",
                border: `1px solid ${filterStatus === status ? color : "#1e1e1e"}`,
                background: filterStatus === status ? `${color}15` : "transparent",
                color: filterStatus === status ? color : "#666",
                fontSize: "0.75rem", fontFamily: "Georgia, serif",
                transition: "all 0.15s",
              }}
            >
              {icon} {label} ({count})
            </button>
          );
        })}
        <button
          className="btn-gold"
          onClick={() => setShowCompose(true)}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={14} /> Compose
        </button>
      </div>

      {/* Email list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
            No emails in this category.
          </div>
        )}
        {filtered.map((email) => {
          const lead = email.leadId ? leads.find((l) => l.id === email.leadId) : null;
          return (
            <div
              key={email.id}
              className="jarvis-card"
              onClick={() => setSelectedEmail(email)}
              style={{
                padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "16px",
                borderLeft: `3px solid ${STATUS_COLORS[email.status]}`,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#e8c97a", fontFamily: "Georgia, serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {email.subject}
                  </span>
                  <span
                    style={{
                      flexShrink: 0, fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px",
                      background: `${STATUS_COLORS[email.status]}15`,
                      color: STATUS_COLORS[email.status],
                      border: `1px solid ${STATUS_COLORS[email.status]}30`,
                      letterSpacing: "0.07em", fontWeight: 700,
                    }}
                  >
                    {email.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#666" }}>
                  To: <span style={{ color: "#aaa" }}>{email.to}</span>
                  {lead && <span style={{ color: "#555", marginLeft: "10px" }}>· {lead.address}</span>}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {email.sentAt && (
                  <p style={{ fontSize: "0.68rem", color: "#555", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <Clock size={10} /> {email.sentAt}
                  </p>
                )}
                {email.repliedAt && (
                  <p style={{ fontSize: "0.68rem", color: "#34d399", marginTop: "2px" }}>
                    Replied {email.repliedAt}
                  </p>
                )}
                {!email.sentAt && <p style={{ fontSize: "0.68rem", color: "#555" }}>Draft</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Compose Modal ──────────────────────────────────────────────────── */}
      {showCompose && (
        <div
          onClick={() => setShowCompose(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px",
              padding: "28px", width: "100%", maxWidth: "640px",
              display: "flex", flexDirection: "column", gap: "16px", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <h2 style={{ fontSize: "1rem", color: "#c9a84c", fontFamily: "Georgia, serif" }}>Compose Email</h2>

            {/* Templates */}
            <div>
              <label style={lbl}>Quick Templates</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(i)}
                    style={{
                      padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.72rem",
                      border: `1px solid ${selectedTemplate === i ? "#c9a84c" : "#2a2a2a"}`,
                      background: selectedTemplate === i ? "rgba(201,168,76,0.1)" : "transparent",
                      color: selectedTemplate === i ? "#c9a84c" : "#666",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Link to lead */}
            <div>
              <label style={lbl}>Link to Lead (optional)</label>
              <select className="jarvis-select" style={{ width: "100%" }} value={form.leadId} onChange={(e) => {
                const lead = leads.find((l) => l.id === e.target.value);
                setForm((f) => ({
                  ...f,
                  leadId: e.target.value,
                  to: lead?.hostEmail || f.to,
                }));
              }}>
                <option value="">— Select lead —</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>{l.address}, {l.city} — {l.hostName}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={lbl}>To *</label>
              <input className="jarvis-input" type="email" placeholder="host@email.com" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </div>

            <div>
              <label style={lbl}>Subject *</label>
              <input className="jarvis-input" placeholder="Subject line" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>

            <div>
              <label style={lbl}>Body</label>
              <textarea
                className="jarvis-input"
                style={{ minHeight: "200px", resize: "vertical", lineHeight: 1.6 }}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Email body..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowCompose(false)}>Cancel</button>
              <button className="btn-ghost" onClick={() => handleSend(true)}>Save Draft</button>
              <button className="btn-gold" onClick={() => handleSend(false)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Send size={14} /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Email View Modal ───────────────────────────────────────────────── */}
      {selectedEmail && (
        <div
          onClick={() => setSelectedEmail(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px",
              padding: "28px", width: "100%", maxWidth: "560px",
              display: "flex", flexDirection: "column", gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 style={{ fontSize: "1rem", color: "#e8c97a", fontFamily: "Georgia, serif", flex: 1, marginRight: "12px" }}>
                {selectedEmail.subject}
              </h2>
              <span
                style={{
                  fontSize: "0.65rem", padding: "3px 9px", borderRadius: "999px", flexShrink: 0,
                  background: `${STATUS_COLORS[selectedEmail.status]}15`,
                  color: STATUS_COLORS[selectedEmail.status],
                  border: `1px solid ${STATUS_COLORS[selectedEmail.status]}30`,
                }}
              >
                {selectedEmail.status}
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#666" }}>To: <span style={{ color: "#aaa" }}>{selectedEmail.to}</span></p>
            {selectedEmail.sentAt && <p style={{ fontSize: "0.72rem", color: "#555" }}>Sent: {selectedEmail.sentAt}</p>}
            <div className="gold-divider" />
            <pre style={{ fontSize: "0.82rem", color: "#ccc", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
              {selectedEmail.body}
            </pre>
            <div className="gold-divider" />
            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {selectedEmail.status === "Draft" && (
                  <button
                    className="btn-gold"
                    onClick={() => {
                      updateEmailStatus(selectedEmail.id, "Sent");
                      setSelectedEmail({ ...selectedEmail, status: "Sent" });
                      addActivity({ id: `ACT${Date.now()}`, icon: "📧", message: `Email sent to ${selectedEmail.to}`, time: "Just now", type: "email" });
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", fontSize: "0.78rem" }}
                  >
                    <Send size={13} /> Send Now
                  </button>
                )}
                {selectedEmail.status === "Sent" && (
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      updateEmailStatus(selectedEmail.id, "Replied");
                      setSelectedEmail({ ...selectedEmail, status: "Replied" });
                    }}
                    style={{ fontSize: "0.78rem", padding: "7px 14px" }}
                  >
                    Mark as Replied
                  </button>
                )}
              </div>
              <button className="btn-ghost" onClick={() => setSelectedEmail(null)} style={{ fontSize: "0.78rem", padding: "7px 14px" }}>Close</button>
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
