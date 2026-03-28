import { FormEvent } from "react";

type Props = {
  hostName: string;
  roomName: string;
  creating: boolean;
  error?: string | null;
  onHostChange: (value: string) => void;
  onRoomChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CreateRoomForm({
  hostName,
  roomName,
  creating,
  error,
  onHostChange,
  onRoomChange,
  onSubmit,
}: Props) {
  return (
    <section className="birthday-card confetti-fade px-8 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase font-black tracking-[0.3em] text-cyan-700">Новое событие</p>
        <h2 className="text-3xl font-semibold text-slate-900">Устройте вечеринку</h2>
        <p className="text-sm text-slate-800 font-medium">
          Введите имя именинника и название праздника, чтобы создать страницу события.
        </p>
      </div>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="text-sm text-slate-900 font-black">
          Имя именинника
          <input
            className="mt-1 w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-slate-950 font-bold outline-none transition focus:border-pink-500"
            value={hostName}
            onChange={(event) => onHostChange(event.target.value)}
            required
          />
        </label>
        <label className="text-sm text-slate-900 font-black">
          Название праздника (необязательно)
          <input
            className="mt-1 w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-slate-950 font-bold outline-none transition focus:border-pink-500"
            value={roomName}
            onChange={(event) => onRoomChange(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-2xl bg-linear-to-r from-pink-400 to-purple-500 px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {creating ? "Создаём праздник..." : "Создать праздник"}
        </button>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </form>
    </section>
  );
}
