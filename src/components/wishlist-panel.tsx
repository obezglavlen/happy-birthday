import { FormEvent } from "react";
import { WishlistItem } from "@/types/happy-birthday";

type Props = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  savedCount: number;
  isOwner: boolean;
  items: WishlistItem[];
  claimedItemId?: string;
  onClaim?: (id: string) => void;
};

export default function WishlistPanel({
  draft,
  onDraftChange,
  onSave,
  saving,
  savedCount,
  isOwner = false,
  items = [],
  claimedItemId,
  onClaim,
}: Props) {
  const label = savedCount === 1 ? "желание" : (savedCount > 1 && savedCount < 5 ? "желания" : "желаний");

  return (
    <div className="birthday-card px-6 py-5 text-slate-900">
      <h3 className="text-lg font-semibold">
        {isOwner ? "Твой список желаний" : "Что подарить?"}
      </h3>
      
      {isOwner ? (
        <form onSubmit={onSave} className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-slate-600">
            Пиши желания по одному в строке. Гости разберут их сами!
          </p>
          <textarea
            className="min-h-30 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400"
            placeholder="Например: Полет на шаре, Подписка на музыку... Разделение происходит с помощью переноса строки"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>{savedCount} {label}</span>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-linear-to-r from-pink-400 to-pink-600 px-4 py-2 font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "..." : "Обновить список"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-2">
          {items?.length === 0 && (
            <p className="text-sm italic text-slate-400">Список пока пуст...</p>
          )}
          {items?.map((item) => {
            const isClaimedByMe = item.id === claimedItemId;
            const isClaimedByOthers = item.claimedBy && !isClaimedByMe;
            
            return (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition ${
                  isClaimedByMe ? "border-pink-400 bg-pink-50" : "border-slate-100"
                }`}
              >
                <span className={`text-sm font-medium ${
                  isClaimedByOthers ? "line-through text-slate-300" : "text-slate-700"
                }`}>
                  {item.text}
                </span>
                {!isClaimedByOthers && !claimedItemId && onClaim && (
                  <button
                    onClick={() => onClaim(item.id)}
                    className="text-xs font-black text-pink-600 uppercase hover:text-pink-800"
                  >
                    Выбрать
                  </button>
                )}
                {isClaimedByMe && (
                  <span className="text-[10px] font-black text-pink-600 uppercase">Выбрано вами</span>
                )}
                {isClaimedByOthers && (
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Занято</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}