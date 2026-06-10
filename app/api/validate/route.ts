import { NextResponse } from "next/server";
import { serializeError } from "@/lib/error-utils";
import { getClients, updateClient } from "@/lib/store";
import { validateClientSettings } from "@/lib/validation";
import { ValidationRequest } from "@/types/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidationRequest;
    const clients = await getClients();
    const client = clients.find((item) => item.clientId === body.clientId || item.siteUrl === body.url);
    let html = body.html || "";

    if (!html && body.url) {
      try {
        const response = await fetch(body.url, { cache: "no-store" });
        html = await response.text();
      } catch {
        // 외부 사이트는 CORS, 방화벽, SSL 정책 등으로 실패할 수 있어 HTML 붙여넣기 검수를 병행합니다.
      }
    }

    const items = validateClientSettings(client, html);
    const hasFail = items.some((item) => item.status === "fail");
    const hasWarn = items.some((item) => item.status === "warn");

    if (client) {
      await updateClient(client.id, {
        lastCheckedAt: new Date().toISOString(),
        installStatus: hasFail ? "오류" : hasWarn ? "검수 필요" : "설치 완료"
      });
    }

    return NextResponse.json({ client, items, htmlChecked: Boolean(html) });
  } catch (error) {
    return NextResponse.json({ message: "설치 검수 중 오류가 발생했습니다.", error: serializeError(error) }, { status: 500 });
  }
}
