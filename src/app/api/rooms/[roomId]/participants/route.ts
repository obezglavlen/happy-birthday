import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const roomId = await resolveRoomParams(params);
    const participants = await roomsStore.getParticipants(roomId);
    return NextResponse.json({ participants });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Комната не найдена";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
