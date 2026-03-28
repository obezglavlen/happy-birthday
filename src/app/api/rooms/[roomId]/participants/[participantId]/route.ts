import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveParticipantParams } from "@/lib/route-params";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string; participantId: string }> },
) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token ?? "").trim();
  const { roomId, participantId } = await resolveParticipantParams(params);

  if (!token) {
    return NextResponse.json(
      { error: "Нужен токен организатора" },
      { status: 400 },
    );
  }

  try {
    const participants = await roomsStore.removeParticipant(
      roomId,
      token,
      participantId,
    );
    return NextResponse.json({ participants });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось удалить участника";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
