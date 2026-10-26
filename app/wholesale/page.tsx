"use client";
import { useState } from "react";
import { useStore, WholesaleDeal, WholesaleStatus, WholesaleLeadSource, WholesaleBuyer } from "@/lib/store";
import { Plus, Phone, Mail, MapPin, DollarSign, Users, CheckCircle, Clock, Star, Search } from "lucide-react";

const STATUS_PIPELINE: WholesaleStatus[] = [
  "Researching", "Initial Outreach", "Interested", "AI Call Scheduled",
  "Qualified", "Approval Pending", "Under Contract", "Buyer Found", "Assigned", "Closed",
];

const STATUS_COLORS: Record<WholesaleStatus, string> = {
  "Researching": "#888",
  "Initial Outreach": "#93c5fd",
  "Interested": "#fbbf24",
  "AI Call Scheduled": "#a78bfa",
  "Qualified": "#34d399",
  "Approval Pending": "#f97316",
  "Under Contract": "#c9a84c",
  "Buyer Found": "#818cf8",
  "Assigned": "#10b981",
  "Closed": "#555",
};

const SOURCES: WholesaleLeadSource[] = ["Direct Mail", "Cold Call", "Driving for Dollars", "Online", "Referral", "MLS", "Other"];

const lbl: React.CSSProperties = {
  fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em",
  textTransform: "uppercase", display: "block", marginBottom: "5px", fontFamily: "Georgia, serif",
};

export default function WholesalePage() {
  const { wholesaleDeals, addWholesaleDeal, updateWholesaleStatus, wholesaleBuyers, addWholesaleBuyer, addActivity, approvals, resolveApproval } = useStore();

  const [activeTab, setActiveTab] = useState<"pipeline" | "buyers">("pipeline");
  const [filterStatus, setFilterStatus] = useState<WholesaleStatus | "All">("All");
  const [searchQ, setSearchQ] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<WholesaleDeal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddBuyer, setShowAddBuyer] = useState(false);

  const [dealForm, setDealForm] = useState({
    ownerName: "", ownerPhone: "", ownerEmail: "",
    address: "", city: "", state: "",
    propertyType: "Single Family" as WholesaleDeal["propertyType"],
    estimatedValue: "", askingPrice: "", offerPrice: "", assignmentFee: "",
    leadSource: "Direct Mail" as WholesaleLeadSource,
    followUpDate: "", motivated: false, notes: "",
  });

  const [buyerForm, setBuyerForm] = useState({ name: "", email: "", phone: "", buyBox: "" });

  const filtered = wholesaleDeals.filter((d) => {
    if (filterStatus !== "All" && d.status !== filterStatus) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return d.ownerName.toLowerCase().includes(q) || d.address.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingApprovals = approvals.filter((a) => a.status === "Pending" && a.wholesaleId);

  function handleAddDeal() {
    if (!dealForm.ownerName || !dealForm.address) return;
    const deal: WholesaleDeal = {
      id: `W${Date.now()}`,
      ownerName: dealForm.ownerName, ownerPhone: dealForm.ownerPhone, ownerEmail: dealForm.ownerEmail,
      address: dealForm.address, city: dealForm.city, state: dealForm.state,
      propertyType: dealForm.propertyType,
      estimatedValue: dealForm.estimatedValue, askingPrice: dealForm.askingPrice,
      offerPrice: dealForm.offerPrice, assignmentFee: dealForm.assignmentFee,
      status: "Researching", leadSource: dealForm.leadSource,
      addedAt: new Date().toISOString().split("T")[0],
      followUpDate: dealForm.followUpDate, motivated: dealForm.motivated, notes: dealForm.notes,
    };
    addWholesaleDeal(deal);
    addActivity({ id: `ACT${Date.now()}`, icon: "🏡", message: `New wholesale deal added — ${dealForm.ownerName}, ${dealForm.city} ${dealForm.state}`, time: "Just now", type: "wholesale" });
    setShowAddDeal(false);
    setDealForm({ ownerName: "", ownerPhone: "", ownerEmail: "", address: "", city: "", state: "", propertyType: "Single Family", estimatedValue: "", askingPrice: "", offerPrice: "", assignmentFee: "", leadSource: "Direct Mail", followUpDate: "", motivated: false, notes: "" });
  }

  function handleAddBuyer() {
    if (!buyerForm.name || !buyerForm.email) return;
    const buyer: WholesaleBuyer = { id: `B${Date.now()}`, ...buyerForm, addedAt: new Date().toISOString().split("T")[0] };
    addWholesaleBuyer(buyer);
    setShowAddBuyer(false);
    setBuyerForm({ name: "", email: "", phone: "", buyBox: "" });
  }

  const stats = [
    { label: "Total Deals", value: wholesaleDeals.length, color: "#a78bfa", icon: "🏡" },
    { label: "Motivated Sellers", value: wholesaleDeals.filter((d) => d.motivated).length, color: "#fbbf24", icon: "🔥" },
    { label: "Under Contract", value: wholesaleDeals.filter((d) => d.status === "Under Contract").length, color: "#c9a84c", icon: "📝" },
    { label: "Cash Buyers", value: wholesaleBuyers.length, color: "#34d399", icon: "💰" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0d0d0d, #0f0a1a, #0a0a0a)",
        border: "1px solid #2a1a4a", borderRadius: "14px", padding: "24px 32px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }} />
        <p style={{ fontSize: "0.7rem", color: "#a78bfa", letterSpacing: "0.18em", marginBottom: "6px" }}>AGENT 2 — SHAHEEN</p>
        <h2 style={{ fontSize: "1.6rem", fontFamily: "Georgia, serif", background: "linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" }}>
          Wholesale Real Estate
        </h2>
        <p style={{ color: "#666", fontSize: "0.82rem", maxWidth: "520px", lineHeight: 1.6 }}>
          Full pipeline: Lead list → compliant outreach → AI call → qualification → your approval → contract → buyer assignment → closed deal.
          {pendingApprovals.length > 0 && <span style={{ color: "#f97316" }}> {pendingApprovals.length} action{pendingApprovals.length !== 1 ? "s" : ""} pending your approval.</span>}
        </p>
      </div>

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

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="jarvis-card" style={{ padding: "20px 22px", border: "1px solid rgba(249,115,22,0.3)" }}>
          <h3 style={{ fontSize: "0.8rem", color: "#f97316", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
            ⚠ Wholesale Approvals Needed
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingApprovals.map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px" }}>
                <div>
                  <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px", background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", fontWeight: 700, letterSpacing: "0.07em" }}>
                    {a.type.toUpperCase()}
                  </span>
                  <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "6px" }}>{a.description}</p>
                  <p style={{ fontSize: "0.68rem", color: "#555", marginTop: "2px" }}>{a.createdAt}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "16px" }}>
                  <button onClick={() => resolveApproval(a.id, "Rejected")} style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontFamily: "Georgia, serif" }}>Reject</button>
                  <button onClick={() => resolveApproval(a.id, "Approved")} style={{ padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.72rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontFamily: "Georgia, serif" }}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {(["pipeline", "buyers"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", borderRadius: "999px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia, serif",
            border: `1px solid ${activeTab === tab ? "#a78bfa" : "#1e1e1e"}`,
            background: activeTab === tab ? "rgba(167,139,250,0.1)" : "transparent",
            color: activeTab === tab ? "#a78bfa" : "#666",
            textTransform: "capitalize",
          }}>
            {tab === "pipeline" ? `Deal Pipeline (${wholesaleDeals.length})` : `Cash Buyers (${wholesaleBuyers.length})`}
          </button>
        ))}
        <button className="btn-gold" onClick={() => activeTab === "pipeline" ? setShowAddDeal(true) : setShowAddBuyer(true)}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", fontSize: "0.78rem" }}>
          <Plus size={13} /> {activeTab === "pipeline" ? "Add Deal" : "Add Buyer"}
        </button>
      </div>

      {/* ── PIPELINE TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "pipeline" && (
        <>
          {/* Stage filter */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button onClick={() => setFilterStatus("All")} style={{ padding: "4px 12px", borderRadius: "999px", cursor: "pointer", fontSize: "0.68rem", border: `1px solid ${filterStatus === "All" ? "#a78bfa" : "#1e1e1e"}`, background: filterStatus === "All" ? "rgba(167,139,250,0.1)" : "transparent", color: filterStatus === "All" ? "#a78bfa" : "#666", fontFamily: "Georgia, serif" }}>
              All ({wholesaleDeals.length})
            </button>
            {STATUS_PIPELINE.map((s) => {
              const count = wholesaleDeals.filter((d) => d.status === s).length;
              if (!count) return null;
              const c = STATUS_COLORS[s];
              return (
                <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "All" : s)} style={{ padding: "4px 12px", borderRadius: "999px", cursor: "pointer", fontSize: "0.68rem", border: `1px solid ${filterStatus === s ? c : c + "40"}`, background: filterStatus === s ? `${c}15` : "transparent", color: c, fontFamily: "Georgia, serif" }}>
                  {s} · {count}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={13} color="#555" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input className="jarvis-input" style={{ paddingLeft: "32px" }} placeholder="Search by owner, address or city..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
          </div>

          {/* Deal cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
                No deals found. Add your first wholesale deal.
              </div>
            )}
            {filtered.map((deal) => {
              const sc = STATUS_COLORS[deal.status];
              return (
                <div key={deal.id} className="jarvis-card" onClick={() => setSelectedDeal(deal)}
                  style={{ padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", borderLeft: `3px solid ${sc}` }}>
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {deal.motivated && <span title="Motivated Seller" style={{ fontSize: "0.85rem" }}>🔥</span>}
                      <span style={{ fontSize: "0.88rem", color: "#e8c97a", fontFamily: "Georgia, serif" }}>{deal.ownerName}</span>
                    </div>
                    <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "999px", background: `${sc}15`, color: sc, border: `1px solid ${sc}30`, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {deal.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Address */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={12} color="#a78bfa" />
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>{deal.address}, {deal.city}, {deal.state}</span>
                  </div>

                  {/* Financials */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { label: "ARV", value: deal.estimatedValue },
                      { label: "Offer", value: deal.offerPrice || "—" },
                      { label: "Asking", value: deal.askingPrice },
                      { label: "Fee", value: deal.assignmentFee || "—" },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "6px 10px" }}>
                        <p style={{ fontSize: "0.6rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                        <p style={{ fontSize: "0.82rem", color: "#c9a84c", fontFamily: "Georgia, serif" }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Source + contact */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1a1a1a", paddingTop: "10px" }}>
                    <span style={{ fontSize: "0.68rem", color: "#555" }}>{deal.leadSource}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {deal.ownerPhone && <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "#666" }}><Phone size={10} />{deal.ownerPhone}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── BUYERS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "buyers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="jarvis-card" style={{ padding: "14px 20px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <p style={{ fontSize: "0.78rem", color: "#34d399", lineHeight: 1.6 }}>
              💡 Your cash buyers list. Match qualified deals to buyers instantly and assign contracts for your assignment fee.
            </p>
          </div>
          {wholesaleBuyers.map((buyer) => (
            <div key={buyer.id} className="jarvis-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={14} color="#34d399" />
                  </div>
                  <span style={{ fontSize: "0.92rem", color: "#e8c97a", fontFamily: "Georgia, serif" }}>{buyer.name}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Mail size={11} /> {buyer.email}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Phone size={11} /> {buyer.phone}
                </p>
                <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "8px 12px" }}>
                  <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>Buy Box</p>
                  <p style={{ fontSize: "0.75rem", color: "#aaa", lineHeight: 1.5 }}>{buyer.buyBox}</p>
                </div>
              </div>
              <div style={{ flexShrink: 0, marginLeft: "16px", textAlign: "right" }}>
                <p style={{ fontSize: "0.62rem", color: "#444" }}>Added {buyer.addedAt}</p>
                <button className="btn-ghost" style={{ marginTop: "10px", fontSize: "0.72rem", padding: "6px 12px" }}>
                  Match Deal
                </button>
              </div>
            </div>
          ))}
          {wholesaleBuyers.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>No buyers yet. Add your first cash buyer.</div>
          )}
        </div>
      )}

      {/* ── DEAL DETAIL MODAL ─────────────────────────────────────────────────── */}
      {selectedDeal && (
        <div onClick={() => setSelectedDeal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {selectedDeal.motivated && <span>🔥</span>}
                  <h2 style={{ fontSize: "1rem", color: "#e8c97a", fontFamily: "Georgia, serif" }}>{selectedDeal.ownerName}</h2>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#666", marginTop: "2px" }}>{selectedDeal.address}, {selectedDeal.city}, {selectedDeal.state}</p>
              </div>
              <span style={{ fontSize: "0.65rem", padding: "3px 10px", borderRadius: "999px", background: `${STATUS_COLORS[selectedDeal.status]}15`, color: STATUS_COLORS[selectedDeal.status], border: `1px solid ${STATUS_COLORS[selectedDeal.status]}30` }}>
                {selectedDeal.status}
              </span>
            </div>

            <div className="gold-divider" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "ARV", value: selectedDeal.estimatedValue },
                { label: "Asking Price", value: selectedDeal.askingPrice },
                { label: "Our Offer", value: selectedDeal.offerPrice || "—" },
                { label: "Assignment Fee", value: selectedDeal.assignmentFee || "—" },
                { label: "Property Type", value: selectedDeal.propertyType },
                { label: "Lead Source", value: selectedDeal.leadSource },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                  <p style={{ fontSize: "0.85rem", color: "#c9a84c", fontFamily: "Georgia, serif", marginTop: "2px" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "12px 14px" }}>
              <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Contact</p>
              <p style={{ fontSize: "0.8rem", color: "#aaa", display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {selectedDeal.ownerPhone || "—"}</p>
              <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {selectedDeal.ownerEmail || "—"}</p>
            </div>

            {selectedDeal.notes && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "12px 14px" }}>
                <p style={{ fontSize: "0.62rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Notes</p>
                <p style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: 1.5 }}>{selectedDeal.notes}</p>
              </div>
            )}

            <div>
              <label style={lbl}>Update Stage</label>
              <select className="jarvis-select" style={{ width: "100%" }} value={selectedDeal.status}
                onChange={(e) => {
                  const s = e.target.value as WholesaleStatus;
                  updateWholesaleStatus(selectedDeal.id, s);
                  setSelectedDeal({ ...selectedDeal, status: s });
                  addActivity({ id: `ACT${Date.now()}`, icon: "🔄", message: `Wholesale deal "${selectedDeal.ownerName}" moved to ${s}`, time: "Just now", type: "wholesale" });
                }}>
                {STATUS_PIPELINE.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setSelectedDeal(null)} style={{ fontSize: "0.78rem", padding: "7px 16px" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD DEAL MODAL ────────────────────────────────────────────────────── */}
      {showAddDeal && (
        <div onClick={() => setShowAddDeal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1rem", color: "#a78bfa", fontFamily: "Georgia, serif" }}>Add Wholesale Deal</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Owner Name *</label>
                <input className="jarvis-input" placeholder="John Smith" value={dealForm.ownerName} onChange={(e) => setDealForm({ ...dealForm, ownerName: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input className="jarvis-input" placeholder="555-555-0100" value={dealForm.ownerPhone} onChange={(e) => setDealForm({ ...dealForm, ownerPhone: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Email</label>
                <input className="jarvis-input" type="email" placeholder="owner@email.com" value={dealForm.ownerEmail} onChange={(e) => setDealForm({ ...dealForm, ownerEmail: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Property Address *</label>
                <input className="jarvis-input" placeholder="123 Main St" value={dealForm.address} onChange={(e) => setDealForm({ ...dealForm, address: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>City</label>
                <input className="jarvis-input" placeholder="Houston" value={dealForm.city} onChange={(e) => setDealForm({ ...dealForm, city: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>State</label>
                <input className="jarvis-input" placeholder="TX" value={dealForm.state} onChange={(e) => setDealForm({ ...dealForm, state: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Property Type</label>
                <select className="jarvis-select" style={{ width: "100%" }} value={dealForm.propertyType} onChange={(e) => setDealForm({ ...dealForm, propertyType: e.target.value as WholesaleDeal["propertyType"] })}>
                  {["Single Family", "Multi-Family", "Commercial", "Land", "Other"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Lead Source</label>
                <select className="jarvis-select" style={{ width: "100%" }} value={dealForm.leadSource} onChange={(e) => setDealForm({ ...dealForm, leadSource: e.target.value as WholesaleLeadSource })}>
                  {SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Estimated ARV</label>
                <input className="jarvis-input" placeholder="$200,000" value={dealForm.estimatedValue} onChange={(e) => setDealForm({ ...dealForm, estimatedValue: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Asking Price</label>
                <input className="jarvis-input" placeholder="$150,000" value={dealForm.askingPrice} onChange={(e) => setDealForm({ ...dealForm, askingPrice: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Our Offer</label>
                <input className="jarvis-input" placeholder="$120,000" value={dealForm.offerPrice} onChange={(e) => setDealForm({ ...dealForm, offerPrice: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Assignment Fee</label>
                <input className="jarvis-input" placeholder="$10,000" value={dealForm.assignmentFee} onChange={(e) => setDealForm({ ...dealForm, assignmentFee: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Follow-Up Date</label>
                <input className="jarvis-input" type="date" value={dealForm.followUpDate} onChange={(e) => setDealForm({ ...dealForm, followUpDate: e.target.value })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "20px" }}>
                <input type="checkbox" id="motivated" checked={dealForm.motivated} onChange={(e) => setDealForm({ ...dealForm, motivated: e.target.checked })} style={{ accentColor: "#a78bfa", width: "15px", height: "15px" }} />
                <label htmlFor="motivated" style={{ fontSize: "0.8rem", color: "#aaa", cursor: "pointer" }}>🔥 Motivated Seller</label>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Notes</label>
                <textarea className="jarvis-input" style={{ minHeight: "70px", resize: "vertical" }} placeholder="Situation, motivation, timeline..." value={dealForm.notes} onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAddDeal(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleAddDeal}>Add Deal</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD BUYER MODAL ───────────────────────────────────────────────────── */}
      {showAddBuyer && (
        <div onClick={() => setShowAddBuyer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0e0e0e", border: "1px solid #2a2a2a", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <h2 style={{ fontSize: "1rem", color: "#34d399", fontFamily: "Georgia, serif" }}>Add Cash Buyer</h2>
            <div>
              <label style={lbl}>Buyer Name *</label>
              <input className="jarvis-input" placeholder="John Investor" value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Email *</label>
              <input className="jarvis-input" type="email" placeholder="buyer@invest.com" value={buyerForm.email} onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input className="jarvis-input" placeholder="555-555-0100" value={buyerForm.phone} onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Buy Box (what they buy)</label>
              <textarea className="jarvis-input" style={{ minHeight: "80px", resize: "vertical" }} placeholder="e.g. Single Family, Houston TX, $80K-$150K ARV, Cash closes" value={buyerForm.buyBox} onChange={(e) => setBuyerForm({ ...buyerForm, buyBox: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowAddBuyer(false)}>Cancel</button>
              <button className="btn-gold" onClick={handleAddBuyer}>Add Buyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
