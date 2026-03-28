type Props = {
  canStart: boolean;
  pending: boolean;
  participantsCount: number;
  started: boolean;
  onStart: () => void;
};

export default function OwnerControls({
  canStart,
  pending,
  participantsCount,
  started,
  onStart,
}: Props) {
  return (
    <div className="birthday-card px-6 py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Панель управления</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-pink-600 font-bold">
          {participantsCount} гостей
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Когда все друзья приглашены — нажмите кнопку для открытия выбора подарков.
      </p>
      <button
        type="button"
        onClick={onStart}
        disabled={!canStart || pending}
        className="mt-4 w-full rounded-2xl bg-linear-to-r from-pink-400 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {started ? "Выбор подарков открыт" : "Открыть выбор подарков"}
      </button>
      {participantsCount < 2 && (
        <p className="mt-2 text-xs text-pink-400">
          Нужно пригласить хотя бы одного друга.
        </p>
      )}
    </div>
  );
}
