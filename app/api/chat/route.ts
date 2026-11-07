import { NextRequest, NextResponse } from "next/server";

// ─── Jarvis AI Chat API ────────────────────────────────────────────────────────
// Powered by OpenAI GPT-4o
// Set OPENAI_API_KEY in Vercel Environment Variables

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "OpenAI API key not configured. Add OPENAI_API_KEY to your environment variables to activate full AI capabilities.",
      });
    }

    const systemPrompt = `You are Jarvis, an AI business assistant for SHAHEEN. You manage two businesses:

1. PROPERTY VIDEO TOURS — Find hosts/realtors on Zillow, Airbnb, Realtor. Send outreach emails. Make AI calls. Collect PayPal payments. Generate cinematic property videos. Deliver automatically.

2. WHOLESALE REAL ESTATE — Lead list outreach. AI qualification calls. Get seller approval. Send contracts. Match to cash buyers. Assign deals. Close.

Current system data:
${context || "No context provided."}

Your personality:
- Professional, confident, concise
- You call yourself Jarvis
- You address the user as SHAHEEN
- You always ask for approval before taking action
- You speak like a smart AI assistant, not a chatbot

Keep responses short and direct unless asked for detail.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        reply: `AI error: ${data.error?.message || "Unknown error"}`,
      });
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    return NextResponse.json({
      reply: "I encountered an error. Please try again.",
    });
  }
}
