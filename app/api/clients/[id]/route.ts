import { NextResponse } from "next/server";
import { serializeError } from "@/lib/error-utils";
import { deleteClient, getClientById, updateClient } from "@/lib/store";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function GET(_: Request, { params }: RouteContext) {
  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json({ message: "광고주를 찾지 못했습니다." }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    const client = await updateClient(params.id, body);
    if (!client) {
      return NextResponse.json({ message: "광고주를 찾지 못했습니다." }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ message: "광고주 정보를 저장하지 못했습니다.", error: serializeError(error) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const deleted = await deleteClient(params.id);
  if (!deleted) {
    return NextResponse.json({ message: "광고주를 찾지 못했습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
