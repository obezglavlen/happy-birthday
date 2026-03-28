import { WishlistItem } from "@/types/happy-birthday";

type Props = {
  itemTextDraft: string;
  itemDescriptionDraft: string;
  onItemTextChange: (value: string) => void;
  onItemDescriptionChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  saving: boolean;
  savedCount: number;
  isOwner: boolean;
  items: WishlistItem[];
  claimedItemId?: string;
  onClaim?: (id: string) => void;
};

export default function WishlistPanel({
  itemTextDraft,
  itemDescriptionDraft,
  onItemTextChange,
  onItemDescriptionChange,
  onAddItem,
  onRemoveItem,
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
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-slate-600">
            Добавляй по одному подарку. После этого он появится карточкой в списке.
          </p>

          <input
            className="rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400"
            placeholder="Название подарка, например: Наушники"
            value={itemTextDraft}
            onChange={(event) => onItemTextChange(event.target.value)}
          />

          <textarea
            className="min-h-24 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400"
            placeholder="Описание: цвет, размер, бренд или ссылка"
            value={itemDescriptionDraft}
            onChange={(event) => onItemDescriptionChange(event.target.value)}
          />

          <button
            type="button"
            onClick={onAddItem}
            disabled={saving}
            className="self-start rounded-2xl border border-pink-300 px-4 py-2 text-xs font-bold uppercase text-pink-700 transition hover:bg-pink-50"
          >
            {saving ? "Сохраняем..." : "Добавить в список"}
          </button>

          <div className="space-y-2">
            {items.length === 0 && (
              <p className="text-sm italic text-slate-400">Пока нет добавленных подарков</p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-xl border-2 border-slate-100 p-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{item.text}</span>
                  {item.description && (
                    <span className="text-xs text-slate-500">{item.description}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={saving}
                  className="text-xs font-bold uppercase text-pink-600 hover:text-pink-800"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>{savedCount} {label}</span>
            <span>{saving ? "Сохраняем изменения..." : "Изменения сохраняются автоматически"}</span>
          </div>
        </div>
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
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    isClaimedByOthers ? "line-through text-slate-300" : "text-slate-700"
                  }`}>
                    {item.text}
                  </span>
                  {item.description && (
                    <span className={`text-xs ${
                      isClaimedByOthers ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {item.description}
                    </span>
                  )}
                </div>
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