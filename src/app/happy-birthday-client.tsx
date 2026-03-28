"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AssignmentPanel from "@/components/assignment-panel";
import CreateRoomForm from "@/components/create-room-form";
import HeroPanel from "@/components/hero-panel";
import InviteLink from "@/components/invite-link";
import JoinPanel from "@/components/join-panel";
import OwnerControls from "@/components/owner-controls";
import ParticipantsList from "@/components/participants-list";
import WishlistPanel from "@/components/wishlist-panel";
import {
  Participant,
  Room,
  SelfInfo,
} from "@/types/happy-birthday";

const TOKEN_STORE_PREFIX = "happy-birthday:token:";
const ROOM_REFRESH_MS = 6000;

export default function HappyBirthdayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const goHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  const [room, setRoom] = useState<Room | null>(null);
  const [selfInfo, setSelfInfo] = useState<SelfInfo | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [hostName, setHostName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [wishlistDraft, setWishlistDraft] = useState("");
  const [wishlistSaving, setWishlistSaving] = useState(false);
  const [isWishlistDirty, setIsWishlistDirty] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setSelfInfo(null);
      setToken(null);
      setRoomError(null);
      setParticipants([]);
      setWishlistDraft("");
      setIsWishlistDirty(false);
      return;
    }

    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`${TOKEN_STORE_PREFIX}${roomId}`);
    setToken(stored);
    setIsWishlistDirty(false);
  }, [roomId]);

  const fetchSelf = useCallback(
    async (id: string, currentToken: string) => {
      try {
        const response = await fetch(
          `/api/rooms/${id}/self?token=${encodeURIComponent(currentToken)}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error();
        }
        const data = (await response.json()) as { self: SelfInfo };
        setSelfInfo(data.self);
      } catch {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(`${TOKEN_STORE_PREFIX}${id}`);
        }
        setToken(null);
        setSelfInfo(null);
      }
    },
    [],
  );

  const fetchRoom = useCallback(
    async (id: string) => {
      setRoomLoading(true);
      setRoomError(null);
      const scrollPosition =
        typeof window !== "undefined" ? window.scrollY ?? 0 : 0;
      try {
        const response = await fetch(`/api/rooms/${id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Праздник не найден");
        }
        const data = (await response.json()) as { room: Room };
        setRoom(data.room);
        setParticipants(data.room.participants);
        if (token) {
          await fetchSelf(id, token);
        } else {
          setSelfInfo(null);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Не удалось загрузить детали праздника";
        setRoomError(message);
        setRoom(null);
      } finally {
        setRoomLoading(false);
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: scrollPosition });
          });
        }
      }
    },
    [token, fetchSelf],
  );

  const fetchParticipants = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(
          `/api/rooms/${id}/participants`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("Не удалось обновить список гостей");
        }
        const data = (await response.json()) as { participants: Participant[] };
        setParticipants(data.participants);
      } catch {
        // Игнорируем ошибки обновления
      }
    },
    [],
  );

  const handleKick = useCallback(
    async (participantId: string) => {
      if (!roomId || !token || !selfInfo?.isOwner) return;

      setActionError(null);
      setRemovingId(participantId);

      try {
        const response = await fetch(
          `/api/rooms/${roomId}/participants/${participantId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          },
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Не удалось удалить гостя");
        }
        setParticipants(payload.participants);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Не удалось удалить гостя";
        setActionError(message);
      } finally {
        setRemovingId(null);
      }
    },
    [roomId, token, selfInfo?.isOwner],
  );

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    }
  }, [roomId, fetchRoom]);

  useEffect(() => {
    if (!roomId) return undefined;

    const refresh = () => {
      fetchParticipants(roomId);
      if (token && !(selfInfo?.isOwner && isWishlistDirty)) {
        fetchSelf(roomId, token);
      }
    };

    refresh();
    const interval = setInterval(refresh, ROOM_REFRESH_MS);
    return () => clearInterval(interval);
  }, [roomId, token, fetchParticipants, fetchSelf, selfInfo?.isOwner, isWishlistDirty]);

  useEffect(() => {
    if (!selfInfo?.participant || !selfInfo.isOwner) {
      setWishlistDraft("");
      setIsWishlistDirty(false);
      return;
    }
    if (isWishlistDirty) return;
    setWishlistDraft(selfInfo.ownerWishlist.map((item) => item.text).join("\n"));
  }, [selfInfo?.isOwner, selfInfo?.ownerWishlist, selfInfo?.participant, isWishlistDirty]);

  const handleWishlistDraftChange = useCallback((value: string) => {
    setWishlistDraft(value);
    setIsWishlistDirty(true);
  }, []);

  const rememberToken = useCallback(
    (roomKey: string, nextToken: string) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(`${TOKEN_STORE_PREFIX}${roomKey}`, nextToken);
      setToken(nextToken);
    },
    [],
  );

  const handleCreateRoom = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (creatingRoom) return;

      setCreatingRoom(true);
      setActionError(null);

      try {
        const response = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hostName, roomName }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Не удалось создать комнату");
        }

        const createdRoom = payload.room as Room;
        const ownerToken = payload.token as string;
        const participant = payload.participant as SelfInfo["participant"];

        rememberToken(createdRoom.id, ownerToken);
        setSelfInfo({
          isOwner: true,
          participant: participant,
          claimedItemId: undefined,
          ownerWishlist: [],
          ownerName: hostName,
          ownerId: participant.id,
        });
        setRoom(createdRoom);
        router.push(`/?room=${createdRoom.id}`);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Во время создания произошла ошибка";
        setActionError(message);
      } finally {
        setCreatingRoom(false);
      }
    },
    [creatingRoom, hostName, roomName, rememberToken, router],
  );

  const handleJoinRoom = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!roomId || pendingAction) return;
      if (room?.startedAt) {
        setActionError("Праздник уже начался — вход закрыт");
        return;
      }

      setPendingAction(true);
      setActionError(null);

      try {
        const response = await fetch(`/api/rooms/${roomId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: joinName }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Не удалось войти");
        }

        const updatedRoom = payload.room as Room;
        const userToken = payload.token as string;
        const participant = payload.participant as SelfInfo["participant"];

        rememberToken(roomId, userToken);
        setSelfInfo({
          isOwner: false,
          participant: participant,
          claimedItemId: undefined,
          ownerWishlist: [],
          ownerName: "",
          ownerId: "",
        });
        setRoom(updatedRoom);
        setParticipants(updatedRoom.participants);
        setJoinName("");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Ошибка входа в комнату";
        setActionError(message);
      } finally {
        setPendingAction(false);
      }
    },
    [joinName, pendingAction, rememberToken, roomId, room?.startedAt],
  );

  const handleStart = useCallback(async () => {
    if (!roomId || !token || pendingAction) return;

    setPendingAction(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Не удалось запустить жеребьевку");
      }
      await fetchRoom(roomId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Сервис временно недоступен";
      setActionError(message);
    } finally {
      setPendingAction(false);
    }
  }, [fetchRoom, pendingAction, roomId, token]);

  const handleWishlistSave = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!roomId || !token || !selfInfo?.isOwner) return;

      setWishlistSaving(true);
      setActionError(null);

      const nextWishlist = wishlistDraft
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      try {
        const response = await fetch(`/api/rooms/${roomId}/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, wishlist: nextWishlist }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Не удалось сохранить вишлист");
        }

        const updatedOwnerWishlist = Array.isArray(payload?.ownerWishlist)
          ? (payload.ownerWishlist as SelfInfo["ownerWishlist"])
          : nextWishlist.map((text, index) => ({
              id: `draft-${index}`,
              text,
            }));

        setSelfInfo((prev) =>
          prev
            ? {
                ...prev,
                ownerWishlist: updatedOwnerWishlist,
              }
            : prev,
        );
        setWishlistDraft(updatedOwnerWishlist.map((item) => item.text).join("\n"));
        setIsWishlistDirty(false);
        setInfoMessage("Вишлист сохранён");
        setTimeout(() => setInfoMessage(null), 3000);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Не удалось сохранить вишлист";
        setActionError(message);
      } finally {
        setWishlistSaving(false);
      }
    },
    [roomId, token, wishlistDraft, selfInfo?.isOwner],
  );

      const handleClaim = useCallback(
        async (itemId: string) => {
          if (!roomId || !token) return;
          if (!room?.startedAt) {
            setActionError("Выбор подарков откроется после старта праздника");
            return;
          }

          setActionError(null);
          setPendingAction(true);

          try {
            const response = await fetch(`/api/rooms/${roomId}/claim`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, itemId }),
            });
            const payload = await response.json();
            if (!response.ok) {
              throw new Error(payload?.error ?? "Не удалось выбрать подарок");
            }

            setSelfInfo((prev) =>
              prev
                ? {
                    ...prev,
                    claimedItemId: payload.claimedItemId,
                  }
                : prev,
            );
            // Immediately refresh to reflect claimedBy states for all items.
            await Promise.all([fetchSelf(roomId, token), fetchParticipants(roomId)]);
            setInfoMessage("Подарок выбран! 🎉");
            setTimeout(() => setInfoMessage(null), 3000);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Не удалось выбрать подарок";
            setActionError(message);
          } finally {
            setPendingAction(false);
          }
        },
        [roomId, token, room?.startedAt, fetchSelf, fetchParticipants],
      );

      const shareLink = useMemo(() => {
        if (!origin || !roomId) return "";
        return `${origin}/?room=${roomId}`;
      }, [origin, roomId]);

  const handleCopyLink = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setInfoMessage("Ссылка скопирована ✅");
      setTimeout(() => setInfoMessage(null), 3000);
    } catch {
      setActionError("Не удалось скопировать ссылку");
    }
  }, [shareLink]);

    const canStart =
    !!selfInfo?.isOwner &&
    !!room &&
    participants.length >= 2 &&
    !room.startedAt;

    const youAreInRoom = Boolean(selfInfo?.participant);
    const alreadyStarted = Boolean(room?.startedAt);
    const assignmentName = selfInfo?.ownerName;

  return (
    <div className="min-h-screen px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 text-indigo-950 shadow-md border-2 border-pink-200">
          <button
            type="button"
            onClick={goHome}
            className="text-lg font-black uppercase tracking-[0.3em] text-pink-800 transition hover:text-pink-900"
          >
            Happy Birthday
          </button>
          <span className="text-xs uppercase font-black tracking-[0.4em] text-indigo-900/70">
            Твой идеальный праздник
          </span>
        </header>
        <HeroPanel />

        {!roomId && (
          <CreateRoomForm
            hostName={hostName}
            roomName={roomName}
            creating={creatingRoom}
            error={actionError}
            onHostChange={setHostName}
            onRoomChange={setRoomName}
            onSubmit={handleCreateRoom}
          />
        )}

        {roomId && (
          <section className="birthday-card confetti-fade px-8 py-10 border border-black/5">
            {roomLoading && <p className="text-sm font-medium text-slate-700">Загружаем детали...</p>}
            {roomError && (
              <p className="text-red-600 font-bold">
                {roomError}.{" "}
                <button
                  className="underline text-pink-700 font-black"
                  onClick={() => router.push("/")}
                >
                  Вернуться назад
                </button>
              </p>
            )}

            {!roomLoading && !roomError && room && (
              <div className="flex flex-col gap-8">
                <header className="flex flex-col gap-2">
                  <p className="text-sm uppercase font-black tracking-[0.3em] text-pink-700">
                    Праздник #{room.id}
                  </p>
                  <h2 className="text-3xl font-semibold text-slate-900">{room.name}</h2>
                  <div className="flex flex-col gap-2 text-sm text-slate-700 font-medium">
                    <p>Приглашено гостей: {participants.length}</p>
                    <p>
                      Статус:{" "}
                      {alreadyStarted ? "выбор подарков открыт!" : "сбор гостей"}
                    </p>
                  </div>
                </header>

                <InviteLink shareLink={shareLink} onCopy={handleCopyLink} />

                <div className="grid gap-6 lg:grid-cols-2">
                  <ParticipantsList
                    participants={participants}
                    highlightId={selfInfo?.participant.id ?? null}
                    ownerId={room?.ownerId ?? null}
                    showKickButton={Boolean(selfInfo?.isOwner)}
                    onKick={selfInfo?.isOwner ? handleKick : undefined}
                    busyId={removingId}
                  />
                  <div className="flex flex-col gap-6">
                    <JoinPanel
                      youAreInRoom={youAreInRoom}
                      participantName={selfInfo?.participant.name}
                      ownerName={selfInfo?.ownerName}
                      pending={pendingAction}
                      onJoin={handleJoinRoom}
                      onNameChange={setJoinName}
                      joinName={joinName}
                      isOwner={selfInfo?.isOwner}
                      roomStarted={alreadyStarted}
                    />
                    {youAreInRoom && selfInfo?.isOwner && (
                      <WishlistPanel
                        draft={wishlistDraft}
                        onDraftChange={handleWishlistDraftChange}
                        onSave={handleWishlistSave}
                        saving={wishlistSaving}
                        savedCount={selfInfo?.ownerWishlist.length ?? 0}
                        isOwner={true}
                        items={[]}
                        claimedItemId={undefined}
                        onClaim={undefined}
                      />
                    )}
                  </div>
                </div>

                {selfInfo?.isOwner && (
                  <OwnerControls
                    canStart={canStart}
                    pending={pendingAction}
                    participantsCount={participants.length}
                    started={Boolean(room.startedAt)}
                    onStart={handleStart}
                  />
                )}

                <AssignmentPanel
                  youAreInRoom={youAreInRoom}
                  alreadyStarted={alreadyStarted}
                  assignmentName={assignmentName}
                  ownerWishlist={selfInfo?.ownerWishlist}
                  ownerName={selfInfo?.ownerName}
                  claimedItemId={selfInfo?.claimedItemId}
                  onClaim={handleClaim}
                  isOwner={selfInfo?.isOwner}
                />

                {actionError && (
                  <p className="text-sm text-red-300">{actionError}</p>
                )}
                {infoMessage && (
                  <p className="text-sm text-cyan-400">{infoMessage}</p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
