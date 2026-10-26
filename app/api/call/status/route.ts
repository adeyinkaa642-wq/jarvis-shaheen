import { NextRequest, NextResponse } from "next/server";

// ─── Twilio Call Status Webhook ───────────────────────────────────────────────
// Twilio posts to this URL when call status changes

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid");
  const callStatus = formData.get("CallStatus");
  const to = formData.get("To");
  const duration = formData.get("CallDuration");

  console.log(`Call ${callSid} to ${to}: ${callStatus} (${duration}s)`);

  // In a real implementation this would update a database
  // For Phase 2, the call log is stored client-side

  return new NextResponse("OK", { status: 200 });
}
