import { NextRequest, NextResponse } from "next/server";

// ─── Twilio AI Call API ────────────────────────────────────────────────────────
// This route initiates an outbound AI call using Twilio
// Set these in Vercel Environment Variables:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_PHONE_NUMBER
//   NEXT_PUBLIC_APP_URL (your Vercel URL)

export async function POST(req: NextRequest) {
  try {
    const { to, script, callType } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jarvis-shaheen.vercel.app";

    if (!accountSid || !authToken || !from) {
      return NextResponse.json({
        success: false,
        error: "Twilio credentials not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment variables.",
      }, { status: 400 });
    }

    // Build TwiML URL with the script encoded
    const twimlUrl = `${appUrl}/api/call/twiml?script=${encodeURIComponent(script)}&callType=${encodeURIComponent(callType)}`;

    // Make the Twilio call
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Url: twimlUrl,
          StatusCallback: `${appUrl}/api/call/status`,
          StatusCallbackMethod: "POST",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      callSid: data.sid,
      status: data.status,
      message: `Jarvis is calling ${to}`,
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
