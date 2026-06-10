import { NextResponse } from "next/server";
import { serializeError } from "@/lib/error-utils";
import { createClient, getClients } from "@/lib/store";
import { seedClients } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const existing = await getClients();

    if (existing.length > 0) {
      return NextResponse.json({
        created: 0,
        message: "이미 등록된 광고주가 있어 초기 데이터를 추가하지 않았습니다."
      });
    }

    const seeds = seedClients();
    const created = [];

    for (const client of seeds) {
      created.push(await createClient(client));
    }

    return NextResponse.json({
      created: created.length,
      message: "초기 광고주 데이터를 복원했습니다."
    });
  } catch (error) {
    return NextResponse.json({
      message: "초기 데이터 복원에 실패했습니다.",
      error: serializeError(error)
    }, { status: 500 });
  }
}
