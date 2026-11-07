"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Maximize2, Mic, MicOff, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "jarvis";
  text: string;
}

export default function JarvisChat() {
  const { leads, emails, approvals, wholesaleDeals, wholesaleBuyers } = useStore();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "jarvis", text: "Hello SHAHEEN. I'm Jarvis — your AI business assistant. I manage your Property Video Tours and Wholesale Real Estate workflows. Press the mic to talk to me, or type your message." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const context = `
Leads: ${leads.length} total, ${leads.filter(l => l.status === "New").length} new, ${leads.filter(l => l.status === "Replied").length} replied
Emails: ${emails.length} total, ${emails.filter(e => e.status === "Sent").length} sent, ${emails.filter(e => e.status === "Replied").length} replied
Approvals: ${approvals.filter(a => a.status === "Pending").length} pending
Wholesale Deals: ${wholesaleDeals.length} total, ${wholesaleDeals.filter(d => d.motivated).length} motivated sellers, ${wholesaleDeals.filter(d => d.status === "Under Contract").length} under contract
Cash Buyers: ${wholesaleBuyers.length} in buyers list
`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Voice Input ───────────────────────────────────────────────────────────────
  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addJarvisMessage("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  // ── Voice Output ──────────────────────────────────────────────────────────────
  function speak(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    // Try to use a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  // ── AI Response ───────────────────────────────────────────────────────────────
  function addJarvisMessage(text: string, shouldSpeak = false) {
    setMessages(m => [...m, { id: `m${Date.now()}`, role: "jarvis", text }]);
    if (shouldSpeak) speak(text);
  }

  async function sendMessage(text?: string) {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg: Message = { id: `m${Date.now()}`, role: "user", text: userText };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // Build message history for OpenAI
    const history = [...messages, userMsg]
      .slice(-10) // last 10 messages for context
      .map(m => ({ role: m.role === "jarvis" ? "assistant" : "user", content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
      });
      const data = await res.json();
      setTyping(false);
      addJarvisMessage(data.reply, text !== undefined); // auto-speak if voice input
    } catch {
      setTyping(false);
      addJarvisMessage("I encountered an error. Please try again.");
    }
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
            height: "48px", borderRadius: "999px",
            background: "linear-gradient(135deg, #c9a84c, #9a7a2e)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", padding: "0 20px",
            boxShadow: "0 4px 20px rgba(201,168,76,0.5)",
          }}
        >
          <span style={{ fontSize: "1rem", fontFamily: "Georgia, serif", color: "#000", fontWeight: 700 }}>J</span>
          <span style={{ fontSize: "0.8rem", fontFamily: "Georgia, serif", color: "#000", fontWeight: 700, letterSpacing: "0.08em" }}>
            Ask Jarvis
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 200,
          width: "360px",
          background: "#0a0a0a",
          border: "1px solid #2a2a2a",
          borderRadius: "14px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          height: minimized ? "56px" : "520px",
          transition: "height 0.2s",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 16px",
            background: "linear-gradient(90deg, #0d0d0d, #111)",
            borderBottom: minimized ? "none" : "1px solid #1e1e1e",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="glow-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c9a84c" }} />
              <span style={{ fontSize: "0.82rem", color: "#c9a84c", fontFamily: "Georgia, serif", letterSpacing: "0.1em" }}>JARVIS</span>
              <span style={{ fontSize: "0.65rem", color: "#444" }}>AI ASSISTANT</span>
              {speaking && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Volume2 size={11} color="#c9a84c" />
                  <span style={{ fontSize: "0.6rem", color: "#c9a84c" }}>Speaking...</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {speaking && (
                <button onClick={stopSpeaking} style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a84c", padding: "2px" }} aria-label="Stop speaking">
                  <Volume2 size={14} />
                </button>
              )}
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
              <div style={{
                flex: 1, overflowY: "auto", padding: "16px",
                display: "flex", flexDirection: "column", gap: "12px",
              }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%",
                      padding: "10px 13px",
                      borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.role === "user" ? "linear-gradient(135deg, #c9a84c20, #9a7a2e20)" : "#111",
                      border: `1px solid ${msg.role === "user" ? "#c9a84c30" : "#1e1e1e"}`,
                      fontSize: "0.78rem",
                      color: msg.role === "user" ? "#e8c97a" : "#ccc",
                      lineHeight: 1.55,
                      fontFamily: "Georgia, serif",
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "10px 14px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px 12px 12px 2px" }}>
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Voice indicator */}
              {listening && (
                <div style={{
                  margin: "0 12px 8px",
                  padding: "8px 12px",
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <div className="glow-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c9a84c" }} />
                  <span style={{ fontSize: "0.72rem", color: "#c9a84c" }}>Listening... speak now</span>
                  <button onClick={stopListening} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: "0.68rem", fontFamily: "Georgia, serif" }}>
                    Stop
                  </button>
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: "12px", borderTop: "1px solid #1a1a1a",
                display: "flex", gap: "8px", flexShrink: 0,
              }}>
                {/* Mic button */}
                <button
                  onClick={listening ? stopListening : startListening}
                  style={{
                    flexShrink: 0, width: "36px", height: "36px", borderRadius: "8px",
                    background: listening ? "rgba(201,168,76,0.2)" : "#1a1a1a",
                    border: `1px solid ${listening ? "#c9a84c" : "#2a2a2a"}`,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                >
                  {listening ? <MicOff size={14} color="#c9a84c" /> : <Mic size={14} color="#666" />}
                </button>

                <input
                  className="jarvis-input"
                  style={{ fontSize: "0.78rem" }}
                  placeholder="Ask Jarvis or press mic to talk..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                />
                <button
                  onClick={() => sendMessage()}
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
