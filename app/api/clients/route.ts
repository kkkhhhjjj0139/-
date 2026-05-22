import { NextResponse } from "next/server";
import { createClient, getClients } from "@/lib/store";

export async function GET() {
  try {
    return NextResponse.json(await getClients());
  } catch (error) {
    return NextResponse.json({ message: "광고주 목록을 불러오지 못했습니다.", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await createClient(body);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "광고주를 등록하지 못했습니다.", error }, { status: 500 });
  }
}
