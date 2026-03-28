type Props = {
  shareLink: string;
  onCopy: () => void;
};

export default function InviteLink({ shareLink, onCopy }: Props) {
  return (
    <div className="birthday-card confetti-fade border-0 px-6 py-4">
      <p className="text-xs uppercase tracking-[0.4em] text-pink-400">Пригласить друзей</p>
      <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/50 px-4 py-3 text-sm text-slate-900 shadow-sm sm:flex-row">
        <input
          className="flex-1 bg-transparent text-slate-900 outline-none"
          value={shareLink}
          readOnly
        />
        <button
          type="button"
          onClick={onCopy}
          className="rounded-2xl bg-linear-to-r from-pink-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Скопировать
        </button>
      </div>
    </div>
  );
}
