import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "conversion-script-manager",
    commit: process.env.RENDER_GIT_COMMIT || "local",
    checkedAt: new Date().toISOString()
  });
}
