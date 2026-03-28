import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const hostName = String(body?.hostName ?? "").trim();
  const roomName = String(body?.roomName ?? "").trim();

  if (!hostName) {
    return NextResponse.json(
      { error: "Нужно указать имя организатора" },
      { status: 400 }
    );
  }

  const displayName =
    roomName || `Комната ${hostName}`.slice(0, 40) || "Новый круг";

  const { room, ownerToken, participant } = await roomsStore.createRoom(
    displayName,
    hostName
  );

  return NextResponse.json({
    room,
    token: ownerToken,
    participant: {
      id: participant.id,
      name: participant.name,
    },
  });
}
