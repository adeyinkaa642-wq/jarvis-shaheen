import { NextRequest, NextResponse } from "next/server";

// ─── TwiML Voice Response ─────────────────────────────────────────────────────
// Twilio calls this URL to get what Jarvis should say on the call

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const script = searchParams.get("script") || "";
  const callType = searchParams.get("callType") || "general";

  // Build TwiML response
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    ${escapeXml(script)}
  </Say>
  <Pause length="2"/>
  <Gather input="speech dtmf" timeout="10" numDigits="1" action="/api/call/gather" method="POST">
    <Say voice="Polly.Joanna">
      Press 1 or say yes if you are interested, press 2 or say no thank you to opt out.
    </Say>
  </Gather>
  <Say voice="Polly.Joanna">
    We did not receive a response. We will follow up with you shortly. Have a great day.
  </Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
