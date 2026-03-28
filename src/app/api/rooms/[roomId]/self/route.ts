import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  const roomId = await resolveRoomParams(params);

  if (!token) {
    return NextResponse.json(
      { error: "Нужен токен участника" },
      { status: 400 },
    );
  }

  try {
    const info = await roomsStore.getSelf(roomId, token);
    return NextResponse.json({ self: info });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Участник не найден";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
