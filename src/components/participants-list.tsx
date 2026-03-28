import { Participant } from "@/types/happy-birthday";

type Props = {
  participants: Participant[];
  highlightId?: string | null;
  ownerId?: string | null;
  showKickButton?: boolean;
  onKick?: (participantId: string) => void;
  busyId?: string | null;
};

export default function ParticipantsList({
  participants,
  highlightId,
  ownerId,
  showKickButton,
  onKick,
  busyId,
}: Props) {
  return (
    <div className="birthday-card px-6 py-5 text-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Список гостей</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-pink-800 font-black">
          {participants.length}
        </span>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-900 font-bold">
        {participants.map((participant) => (
          <li
            key={participant.id}
            className={`flex items-center justify-between rounded-2xl border-2 border-black/5 px-4 py-2 transition hover:border-pink-300 ${
              participant.id === highlightId
                ? "bg-pink-50 text-pink-800 border-pink-200"
                : "bg-white"
            }`}
          >
            <span>{participant.name}</span>
            <div className="flex items-center gap-2">
              {participant.id === highlightId && (
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs uppercase text-pink-300 font-bold">
                  вы
                </span>
              )}
              {participant.id === ownerId && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs uppercase text-amber-700 font-bold">
                  именинник
                </span>
              )}
              {showKickButton &&
                onKick &&
                participant.id !== highlightId &&
                !busyId && (
                  <button
                    type="button"
                    onClick={() => onKick(participant.id)}
                    className="rounded-full border border-pink-200 px-3 py-1 text-xs uppercase text-pink-600 transition hover:bg-pink-50"
                  >
                    Удалить
                  </button>
                )}
              {showKickButton &&
                onKick &&
                participant.id !== highlightId &&
                busyId === participant.id && (
                  <span className="text-xs uppercase tracking-[0.3em] text-pink-600">
                    удаляем...
                  </span>
                )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Редактировать список может только именинник.
      </p>
    </div>
  );
}
