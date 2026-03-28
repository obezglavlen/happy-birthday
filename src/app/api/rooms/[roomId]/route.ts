import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await resolveRoomParams(params);
  const room = await roomsStore.getRoom(roomId);

  if (!room) {
    return NextResponse.json({ error: "Комната не найдена" }, { status: 404 });
  }

  return NextResponse.json({ room });
}
