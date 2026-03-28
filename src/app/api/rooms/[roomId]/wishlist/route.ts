import { NextRequest, NextResponse } from "next/server";
import { roomsStore } from "@/lib/rooms-store";
import { resolveRoomParams } from "@/lib/route-params";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token ?? "").trim();
  const roomId = await resolveRoomParams(params);
  const rawWishlist: unknown[] = Array.isArray(body?.wishlist)
    ? body.wishlist
    : [];
  const wishlist = rawWishlist
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return {
          text: "",
          description: "",
        };
      }

      const payload = item as { id?: unknown; text?: unknown; description?: unknown };
      return {
        id: typeof payload.id === "string" ? payload.id.trim() : undefined,
        text: String(payload.text ?? "").trim(),
        description: String(payload.description ?? "").trim(),
      };
    })
    .filter((item) => item.text.length > 0);

  if (!token) {
    return NextResponse.json(
      { error: "Нужен токен участника" },
      { status: 400 }
    );
  }

  try {
    const updated = await roomsStore.updateWishlist(roomId, token, wishlist);
    return NextResponse.json({ ownerWishlist: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось обновить вишлист";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
