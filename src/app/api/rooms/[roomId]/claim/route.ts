import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token ?? "").trim();
  const itemId = String(body?.itemId ?? "").trim();
  const roomId = await resolveRoomParams(params);

  if (!token) {
    return NextResponse.json(
      { error: "Нужен токен участника" },
      { status: 400 },
    );
  }

  if (!itemId) {
    return NextResponse.json(
      { error: "Нужен ID подарка" },
      { status: 400 },
    );
  }

  try {
    const result = await roomsStore.claimItem(roomId, token, itemId);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось выбрать подарок";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
