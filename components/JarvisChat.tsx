"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { useStore } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "jarvis";
  text: string;
}

const RESPONSES: [RegExp, string][] = [
  [/how many leads/i, "You currently have {LEADS} leads in the system. {NEW} are new and awaiting outreach."],
  [/pending approval/i, "There are {PENDING_APPROVALS} pending approvals waiting for your decision. Head to the Approvals page to review them."],
  [/email/i, "You have {EMAILS} emails tracked. {SENT} sent, {REPLIED} replied. Go to the Emails page to compose a new outreach."],
  [/zillow|airbnb|realtor/i, "Jarvis is configured to monitor Zillow, Airbnb, and Realtor for US property listings. In Phase 2, live scraping and auto-discovery will be activated."],
  [/paypal|payment/i, "PayPal payment workflows are scoped for Phase 3. I'll request payment from approved clients via PayPal automatically once that's set up."],
  [/video/i, "AI cinematic property video generation is on the roadmap for Phase 3. I'll produce stunning tours and deliver them automatically once configured."],
  [/hello|hi|hey/i, "Hello, SHAHEEN. Jarvis is online and monitoring your workflows. How can I assist you today?"],
  [/status/i, "System status: All Phase 1 workflows are operational. Leads, emails, and approvals are active. Phase 2 (phone & live scraping) and Phase 3 (PayPal & video) pending."],
  [/phase 2/i, "Phase 2 will include: live property platform scraping, AI phone call handling (Twilio), SMS notifications, and automated outreach triggers."],
  [/phase 3/i, "Phase 3 will cover: PayPal payment requests, AI cinematic video generation, automatic delivery, and full reporting dashboard."],
  [/help|what can you do/i, "I can help you track leads, manage emails, review approvals, and monitor activity. Ask me about leads, emails, approvals, or system status."],
];

function getResponse(input: string, counts: { leads: number; newLeads: number; emails: number; sent: number; replied: number; pending: number }): string {
  for (const [pattern, template] of RESPONSES) {
    if (pattern.test(input)) {
      return template
        .replace("{LEADS}", String(counts.leads))
        .replace("{NEW}", String(counts.newLeads))
        .replace("{EMAILS}", String(counts.emails))
        .replace("{SENT}", String(counts.sent))
        .replace("{REPLIED}", String(counts.replied))
        .replace("{PENDING_APPROVALS}", String(counts.pending));
    }
  }
  return "I understand. For full AI capabilities, connect your OpenAI API key in Settings. Right now I can help with lead counts, email status, approvals, and system information.";
}

export default function JarvisChat() {
  const { leads, emails, approvals } = useStore();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "jarvis", text: "Hello, SHAHEEN. I'm Jarvis. I'm monitoring your property workflows. Ask me about your leads, emails, approvals, or system status." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const counts = {
    leads: leads.length,
    newLeads: leads.filter((l) => l.status === "New").length,
    emails: emails.length,
    sent: emails.filter((e) => e.status === "Sent").length,
    replied: emails.filter((e) => e.status === "Replied").length,
    pending: approvals.filter((a) => a.status === "Pending").length,
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: `m${Date.now()}`, role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getResponse(userMsg.text, counts);
      setTyping(false);
      setMessages((m) => [...m, { id: `m${Date.now()}`, role: "jarvis", text: reply }]);
    }, 900 + Math.random() * 600);
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="glow-pulse"
          aria-label="Open Jarvis chat"
          style={{
            position: "fixed", bottom: "28px", right: "28px", zIndex: 200,
            width: "54px", height: "54px", borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          }}
        >
          {/* J icon */}
          <span style={{ fontSize: "1.2rem", fontFamily: "Georgia, serif", color: "#000", fontWeight: 700 }}>J</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed", bottom: "28px", right: "28px", zIndex: 200,
            width: "340px",
            background: "#0a0a0a",
            border: "1px solid #2a2a2a",
            borderRadius: "14px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            transition: "height 0.2s",
            height: minimized ? "56px" : "480px",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(90deg, #0d0d0d, #111)",
              borderBottom: minimized ? "none" : "1px solid #1e1e1e",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="glow-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c9a84c" }} />
              <span style={{ fontSize: "0.82rem", color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.1em" }}>
                JARVIS
              </span>
              <span style={{ fontSize: "0.65rem", color: "#444" }}>AI ASSISTANT</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setMinimized(!minimized)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: "2px" }} aria-label="Minimize">
                {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: "2px" }} aria-label="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1, overflowY: "auto", padding: "16px",
                  display: "flex", flexDirection: "column", gap: "12px",
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "82%",
                        padding: "10px 13px",
                        borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, #c9a84c20, #9a7a2e20)"
                          : "#111",
                        border: `1px solid ${msg.role === "user" ? "#c9a84c30" : "#1e1e1e"}`,
                        fontSize: "0.78rem",
                        color: msg.role === "user" ? "#e8c97a" : "#ccc",
                        lineHeight: 1.55,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "10px 14px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px 12px 12px 2px" }}>
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  padding: "12px", borderTop: "1px solid #1a1a1a",
                  display: "flex", gap: "8px", flexShrink: 0,
                }}
              >
                <input
                  className="jarvis-input"
                  style={{ fontSize: "0.78rem" }}
                  placeholder="Ask Jarvis anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                />
                <button
                  onClick={send}
                  style={{
                    flexShrink: 0, width: "36px", height: "36px", borderRadius: "8px",
                    background: input.trim() ? "linear-gradient(135deg, #c9a84c, #9a7a2e)" : "#1a1a1a",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  aria-label="Send"
                >
                  <Send size={14} color={input.trim() ? "#000" : "#444"} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
