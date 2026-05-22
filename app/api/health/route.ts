import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "conversion-script-manager",
    checkedAt: new Date().toISOString()
  });
}
