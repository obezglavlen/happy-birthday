import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token ?? "").trim();
  const roomId = await resolveRoomParams(params);

  if (!token) {
    return NextResponse.json(
      { error: "Нужен токен организатора" },
      { status: 400 },
    );
  }

  try {
    const result = await roomsStore.startRoom(roomId, token);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось запустить жеребьевку";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
