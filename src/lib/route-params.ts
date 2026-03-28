export async function resolveRoomParams(
  params: Promise<{ roomId: string }>,
) {
  const { roomId } = await params;
  return roomId;
}

export async function resolveParticipantParams(
  params: Promise<{ roomId: string; participantId: string }>,
) {
  const { roomId, participantId } = await params;
  return { roomId, participantId };
}
