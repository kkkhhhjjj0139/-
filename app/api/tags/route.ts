import { NextResponse } from "next/server";
import { publicCorsHeaders } from "@/lib/cors";
import { getClients } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: publicCorsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ message: "clientId가 필요합니다." }, { status: 400, headers: publicCorsHeaders });
  }

  const clients = await getClients();
  const client = clients.find((item) => item.clientId === clientId);

  if (!client) {
    return NextResponse.json({ message: "광고주 설정을 찾지 못했습니다." }, { status: 404, headers: publicCorsHeaders });
  }

  return NextResponse.json({
    clientId: client.clientId,
    name: client.name,
    tags: client.tags,
    events: client.events
  }, { headers: publicCorsHeaders });
}
