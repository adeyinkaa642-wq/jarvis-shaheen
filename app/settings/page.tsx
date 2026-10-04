"use client";
import { useState } from "react";
import { Save, Bell, Mail, CreditCard, Key, Globe } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    javisName: "SHAHEEN",
    notifEmail: "swahdan3461@gmail.com",
    notifSms: "",
    emailSender: "swahdan3461@gmail.com",
    openaiKey: "",
    paypalEmail: "swahdan3461@gmail.com",
    targetMarket: "United States",
    platforms: { zillow: true, airbnb: true, realtor: true },
    approvalEmail: true,
    approvalDashboard: true,
    autoOutreach: false,
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="jarvis-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ color: "#c9a84c" }}>{icon}</div>
        <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "680px" }}>

      <Section title="Jarvis Identity" icon={<Globe size={16} />}>
        <div>
          <label style={lbl}>Jarvis Name</label>
          <input className="jarvis-input" value={settings.javisName} onChange={(e) => setSettings({ ...settings, javisName: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Target Market</label>
          <input className="jarvis-input" value={settings.targetMarket} onChange={(e) => setSettings({ ...settings, targetMarket: e.target.value })} />
        </div>
      </Section>

      <Section title="Platform Integrations" icon={<Globe size={16} />}>
        <p style={{ fontSize: "0.78rem", color: "#666", lineHeight: 1.6 }}>
          Select which platforms Jarvis will monitor for new property leads.
        </p>
        {[
          { key: "zillow", label: "Zillow", color: "#0064d2" },
          { key: "airbnb", label: "Airbnb", color: "#ff5a5f" },
          { key: "realtor", label: "Realtor.com", color: "#d92228" },
        ].map(({ key, label, color }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.85rem", color: "#ccc" }}>{label}</span>
            <button
              onClick={() => setSettings({ ...settings, platforms: { ...settings.platforms, [key]: !settings.platforms[key as keyof typeof settings.platforms] } })}
              style={{
                width: "42px", height: "22px", borderRadius: "999px", cursor: "pointer", border: "none",
                background: settings.platforms[key as keyof typeof settings.platforms] ? color : "#2a2a2a",
                position: "relative", transition: "background 0.2s",
              }}
              aria-label={`Toggle ${label}`}
            >
              <div style={{
                position: "absolute", top: "3px",
                left: settings.platforms[key as keyof typeof settings.platforms] ? "22px" : "3px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </button>
          </div>
        ))}
      </Section>

      <Section title="Notifications" icon={<Bell size={16} />}>
        <div>
          <label style={lbl}>Notification Email</label>
          <input className="jarvis-input" type="email" value={settings.notifEmail} onChange={(e) => setSettings({ ...settings, notifEmail: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>SMS / Phone Number (optional)</label>
          <input className="jarvis-input" type="tel" placeholder="+1 (555) 000-0000" value={settings.notifSms} onChange={(e) => setSettings({ ...settings, notifSms: e.target.value })} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={lbl}>Approval Channels</label>
          {[
            { key: "approvalEmail", label: "Receive approvals via Email" },
            { key: "approvalDashboard", label: "Receive approvals on Dashboard" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                style={{ accentColor: "#c9a84c", width: "15px", height: "15px" }}
              />
              <span style={{ fontSize: "0.82rem", color: "#aaa" }}>{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Email Settings" icon={<Mail size={16} />}>
        <div>
          <label style={lbl}>Sender Email</label>
          <input className="jarvis-input" type="email" value={settings.emailSender} onChange={(e) => setSettings({ ...settings, emailSender: e.target.value })} />
        </div>

        <div>
          <label style={lbl}>Auto-Outreach</label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px" }}>
            <div>
              <p style={{ fontSize: "0.82rem", color: "#ccc" }}>Automatic outreach emails</p>
              <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "2px" }}>Jarvis will draft emails for your approval before sending</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoOutreach: !settings.autoOutreach })}
              style={{
                width: "42px", height: "22px", borderRadius: "999px", cursor: "pointer", border: "none",
                background: settings.autoOutreach ? "#c9a84c" : "#2a2a2a",
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}
              aria-label="Toggle auto-outreach"
            >
              <div style={{
                position: "absolute", top: "3px",
                left: settings.autoOutreach ? "22px" : "3px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </button>
          </div>
        </div>
      </Section>

      <Section title="PayPal Integration" icon={<CreditCard size={16} />}>
        <div>
          <label style={lbl}>PayPal Email</label>
          <input className="jarvis-input" type="email" value={settings.paypalEmail} onChange={(e) => setSettings({ ...settings, paypalEmail: e.target.value })} />
          <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "5px" }}>
            Payments will be requested to this PayPal account. API keys configured in Phase 2.
          </p>
        </div>
      </Section>

      <Section title="API Keys" icon={<Key size={16} />}>
        <div>
          <label style={lbl}>OpenAI API Key</label>
          <input className="jarvis-input" type="password" placeholder="sk-..." value={settings.openaiKey} onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })} />
          <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "5px" }}>Used for AI email generation and Jarvis assistant. Required for full automation.</p>
        </div>
        <div style={{ padding: "12px 14px", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#555", lineHeight: 1.6 }}>
            📌 Additional API keys (Zillow/Airbnb/Realtor scrapers, Twilio for phone calls, AI video generation) will be configured in Phase 2 & 3.
          </p>
        </div>
      </Section>

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-gold"
          onClick={save}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 28px" }}
        >
          <Save size={15} />
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em",
  textTransform: "uppercase", display: "block", marginBottom: "5px", fontFamily: "Georgia, serif",
};
