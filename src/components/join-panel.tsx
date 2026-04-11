import { FormEvent } from "react";

type Props = {
  youAreInRoom: boolean;
  participantName?: string;
  ownerName?: string;
  pending: boolean;
  onJoin: (event: FormEvent<HTMLFormElement>) => void;
  onNameChange: (value: string) => void;
  joinName: string;
  isOwner?: boolean;
  roomStarted?: boolean;
};

export default function JoinPanel({
  youAreInRoom,
  participantName,
  ownerName,
  pending,
  onJoin,
  onNameChange,
  joinName,
  isOwner,
  roomStarted,
}: Props) {
  return (
    <div className="birthday-card px-6 py-5">
      <h3 className="text-lg font-semibold text-slate-900">
        {youAreInRoom ? "Вы приглашены!" : "Присоединиться к гостям"}
      </h3>

      {!youAreInRoom && !roomStarted && (
        <form className="mt-4 flex flex-col gap-3" onSubmit={onJoin}>
          <input
            className="rounded-2xl border-2 border-pink-300 bg-white px-4 py-3 text-sm text-slate-950 font-bold placeholder:text-slate-500 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
            placeholder="Ваше имя"
            value={joinName}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Минутку..." : "Зайти на праздник"}
          </button>
        </form>
      )}

      {!youAreInRoom && roomStarted && (
        <form className="mt-4 flex flex-col gap-3" onSubmit={onJoin}>
          <p className="text-sm text-slate-500">
            Праздник начался. Введите своё имя, чтобы восстановить сессию.
          </p>
          <input
            className="rounded-2xl border-2 border-pink-300 bg-white px-4 py-3 text-sm text-slate-950 font-bold placeholder:text-slate-500 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
            placeholder="Ваше имя"
            value={joinName}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Минутку..." : "Войти"}
          </button>
        </form>
      )}

      {youAreInRoom && (
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>Вы в списке гостей как {participantName}.</p>
          {!isOwner && ownerName && (
            <p className="text-slate-600">Владелец комнаты: {ownerName}.</p>
          )}
          {isOwner && (
            <p className="text-pink-600 font-medium">
              Вы организатор, нажмите «Распределить», когда все гости соберутся.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
