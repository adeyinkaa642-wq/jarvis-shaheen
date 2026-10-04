"use client";
import { useState } from "react";
import { useStore, Lead, Platform, LeadStatus } from "@/lib/store";
import { Search, Plus, Home, BedDouble, Bath } from "lucide-react";

const PLATFORMS: Platform[] = ["Zillow", "Airbnb", "Realtor"];
const STATUSES: LeadStatus[] = ["New", "Contacted", "Replied", "Approved", "Paid", "Video Sent", "Closed"];

const statusColors: Record<LeadStatus, string> = {
  New: "#888",
  Contacted: "#93c5fd",
  Replied: "#fbbf24",
  Approved: "#34d399",
  Paid: "#c9a84c",
  "Video Sent": "#a78bfa",
  Closed: "#555",
};

const platformColors: Record<Platform, string> = {
  Zillow: "#0064d2",
  Airbnb: "#ff5a5f",
  Realtor: "#d92228",
};

export default function LeadsPage() {
  const { leads, addLead, updateLeadStatus, addActivity } = useStore();
  const [filterPlatform, setFilterPlatform] = useState<Platform | "All">("All");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");
  const [searchQ, setSearchQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New lead form state
  const [form, setForm] = useState({
    platform: "Zillow" as Platform,
    address: "", city: "", state: "",
    hostName: "", hostEmail: "",
    price: "", bedrooms: "2", bathrooms: "1", notes: "",
  });

  const filtered = leads.filter((l) => {
    if (filterPlatform !== "All" && l.platform !== filterPlatform) return false;
    if (filterStatus !== "All" && l.status !== filterStatus) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return (
        l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.hostName.toLowerCase().includes(q) ||
        l.platform.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleAddLead() {
    if (!form.address || !form.city || !form.hostName) return;
    const newLead: Lead = {
      id: `L${Date.now()}`,
      platform: form.platform,
      address: form.address,
      city: form.city,
      state: form.state,
      hostName: form.hostName,
      hostEmail: form.hostEmail,
      price: form.price,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      status: "New",
      addedAt: new Date().toISOString().split("T")[0],
      notes: form.notes,
    };
    addLead(newLead);
    addActivity({
      id: `ACT${Date.now()}`,
      icon: "🏠",
      message: `New lead added: ${form.address}, ${form.city} (${form.platform})`,
      time: "Just now",
      type: "lead",
    });
    setShowAdd(false);
    setForm({ platform: "Zillow", address: "", city: "", state: "", hostName: "", hostEmail: "", price: "", bedrooms: "2", bathrooms: "1", notes: "" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Top controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search size={14} color="#555" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="jarvis-input"
            style={{ paddingLeft: "34px" }}
            placeholder="Search by address, city, host..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
        </div>

        {/* Platform filter */}
        <select
          className="jarvis-select"
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as Platform | "All")}
        >
          <option value="All">All Platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Status filter */}
        <select
          className="jarvis-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "All")}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button className="btn-gold" onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
          <Plus size={15} /> Add Lead
        </button>
      </div>

      {/* Summary pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {STATUSES.map((s) => {
          const count = leads.filter((l) => l.status === s).length;
          if (!count) return null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                border: `1px solid ${statusColors[s]}40`,
                background: filterStatus === s ? `${statusColors[s]}20` : "transparent",
                color: statusColors[s],
                fontSize: "0.72rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {s} · {count}
            </button>
          );
        })}
      </div>

      {/* Lead cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: "48px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
            No leads found. Click "Add Lead" to add one manually, or use the search filters.
          </div>
        )}
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="jarvis-card"
            onClick={() => setSelectedLead(lead)}
            style={{ padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: `${platformColors[lead.platform]}20`,
                  color: platformColors[lead.platform],
                  border: `1px solid ${platformColors[lead.platform]}40`,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {lead.platform.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: `${statusColors[lead.status]}15`,
                  color: statusColors[lead.status],
                  border: `1px solid ${statusColors[lead.status]}35`,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {lead.status.toUpperCase()}
              </span>
            </div>

            {/* Address */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Home size={13} color="#c9a84c" />
                <span style={{ fontSize: "0.88rem", color: "#e8c97a", fontFamily: "Georgia, serif" }}>{lead.address}</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px", marginLeft: "19px" }}>
                {lead.city}, {lead.state}
              </p>
            </div>

            {/* Details */}
            <div style={{ display: "flex", gap: "14px" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                <BedDouble size={12} /> {lead.bedrooms} bed
              </span>
              <span style={{ fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                <Bath size={12} /> {lead.bathrooms} bath
              </span>
              {lead.price && (
                <span style={{ fontSize: "0.75rem", color: "#c9a84c", marginLeft: "auto", fontWeight: 700 }}>
                  {lead.price}
                </span>
              )}
            </div>

            {/* Host */}
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "10px" }}>
              <p style={{ fontSize: "0.72rem", color: "#666" }}>
                Host: <span style={{ color: "#aaa" }}>{lead.hostName}</span>
              </p>
              <p style={{ fontSize: "0.68rem", color: "#555" }}>{lead.hostEmail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add Lead Modal ─────────────────────────────────────────────────── */}
      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px",
              padding: "28px", width: "100%", maxWidth: "500px",
              display: "flex", flexDirection: "column", gap: "16px",
            }}
          >
            <h2 style={{ fontSize: "1rem", color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.08em" }}>
              Add New Lead
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={lbl}>Platform</label>
                <select className="jarvis-select" style={{ width: "100%" }} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Price</label>
                <input className="jarvis-input" placeholder="e.g. $2,500/mo" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={lbl}>Street Address *</label>
              <input className="jarvis-input" placeholder="123 Main St" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "12px" }}>
              <div>
                <label style={lbl}>City *</label>
                <input className="jarvis-input" placeholder="Los Angeles" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>State</label>
                <input className="jarvis-input" placeholder="CA" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={lbl}>Bedrooms</label>
                <input className="jarvis-input" type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Bathrooms</label>
                <input className="jarvis-input" type="number" min="0" step="0.5" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={lbl}>Host Name *</label>
              <input className="jarvis-input" placeholder="John Smith" value={form.hostName} onChange={(e) => setForm({ ...form, hostName: e.target.value })} />
            </div>

            <div>
              <label style={lbl}>Host Email</label>
              <input className="jarvis-input" placeholder="john@email.com" type="email" value={form.hostEmail} onChange={(e) => setForm({ ...form, hostEmail: e.target.value })} />
            </div>

            <div>
              <label style={lbl}>Notes</label>
              <textarea
                className="jarvis-input"
                style={{ minHeight: "70px", resize: "vertical" }}
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleAddLead}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Detail Modal ─────────────────────────────────────────────── */}
      {selectedLead && (
        <div
          onClick={() => setSelectedLead(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px",
              padding: "28px", width: "100%", maxWidth: "480px",
              display: "flex", flexDirection: "column", gap: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 style={{ fontSize: "1rem", color: "#c9a84c", fontFamily: "Georgia, serif" }}>
                {selectedLead.address}
              </h2>
              <span
                style={{
                  fontSize: "0.65rem", padding: "3px 9px", borderRadius: "999px",
                  background: `${platformColors[selectedLead.platform]}20`,
                  color: platformColors[selectedLead.platform],
                  border: `1px solid ${platformColors[selectedLead.platform]}40`,
                }}
              >
                {selectedLead.platform}
              </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#888" }}>{selectedLead.city}, {selectedLead.state}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[
                { label: "Bedrooms", value: selectedLead.bedrooms },
                { label: "Bathrooms", value: selectedLead.bathrooms },
                { label: "Price", value: selectedLead.price || "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                  <p style={{ fontSize: "0.9rem", color: "#c9a84c", marginTop: "2px", fontFamily: "Georgia, serif" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "12px 14px" }}>
              <p style={{ fontSize: "0.72rem", color: "#666", marginBottom: "4px" }}>HOST</p>
              <p style={{ fontSize: "0.85rem", color: "#ddd" }}>{selectedLead.hostName}</p>
              <p style={{ fontSize: "0.75rem", color: "#555" }}>{selectedLead.hostEmail}</p>
            </div>

            {selectedLead.notes && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "12px 14px" }}>
                <p style={{ fontSize: "0.72rem", color: "#666", marginBottom: "4px" }}>NOTES</p>
                <p style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.5 }}>{selectedLead.notes}</p>
              </div>
            )}

            <div>
              <label style={lbl}>Update Status</label>
              <select
                className="jarvis-select"
                style={{ width: "100%" }}
                value={selectedLead.status}
                onChange={(e) => {
                  const s = e.target.value as LeadStatus;
                  updateLeadStatus(selectedLead.id, s);
                  setSelectedLead({ ...selectedLead, status: s });
                  addActivity({
                    id: `ACT${Date.now()}`,
                    icon: "🔄",
                    message: `Lead "${selectedLead.address}" status updated to ${s}`,
                    time: "Just now",
                    type: "lead",
                  });
                }}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setSelectedLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = {
  fontSize: "0.7rem",
  color: "#666",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "5px",
  fontFamily: "Georgia, serif",
};
