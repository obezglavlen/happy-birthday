import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const body = await request.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const ownerToken = body?.ownerToken
    ? String(body.ownerToken).trim()
    : undefined;
  const roomId = await resolveRoomParams(params);

  if (!name && !ownerToken) {
    return NextResponse.json(
      { error: "Введите имя перед входом" },
      { status: 400 },
    );
  }

  try {
    const { participant, room } = await roomsStore.joinRoom(
      roomId,
      name,
      ownerToken,
    );
    return NextResponse.json({
      room,
      participant: {
        id: participant.id,
        name: participant.name,
      },
      token: participant.token,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось присоединиться";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
