import { WishlistItem } from "@/types/happy-birthday";

type Props = {
  youAreInRoom: boolean;
  alreadyStarted: boolean;
  assignmentName?: string;
  ownerWishlist?: WishlistItem[];
  ownerName?: string;
  claimedItemId?: string;
  onClaim?: (id: string) => void;
  isOwner?: boolean;
};

export default function AssignmentPanel({
  youAreInRoom,
  alreadyStarted,
  assignmentName,
  ownerWishlist,
  ownerName,
  claimedItemId,
  onClaim,
  isOwner,
}: Props) {
  if (!youAreInRoom) {
    return null;
  }

  // For birthday: show owner's wishlist for claiming
  if (ownerWishlist && ownerName && !isOwner) {
    return (
      <div className="birthday-card confetti-fade px-6 py-6">
        <p className="text-xs uppercase text-pink-600 font-bold text-center">Что подарить {ownerName}?</p>
        {!alreadyStarted && (
          <p className="mt-2 text-center text-xs font-medium text-slate-500">
            Выбор подарков откроется после старта праздника владельцем комнаты.
          </p>
        )}
        <div className="mt-4 space-y-2">
          {ownerWishlist.length === 0 && (
            <p className="text-sm italic text-slate-400">Список пока пуст...</p>
          )}
          {ownerWishlist.map((item) => {
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
                {!isClaimedByOthers && !claimedItemId && onClaim && alreadyStarted && (
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
      </div>
    );
  }

  // For owner or if no ownerWishlist, show nothing after started
  if (alreadyStarted) {
    return null;
  }

  // Legacy fallback UI (not used in current birthday flow)
  return (
    <div className="birthday-card confetti-fade px-6 py-6 text-center">
      <p className="text-xs uppercase text-pink-600 font-bold">Вы готовите сюрприз для</p>
      {!alreadyStarted && (
        <p className="mt-3 text-lg font-semibold text-slate-800">
          Скоро узнаем, чьи желания вам достались! 🎈
        </p>
      )}
      {alreadyStarted && assignmentName && (
        <>
          <p className="mt-4 text-sm text-slate-600 font-medium">Именинник:</p>
          <p className="text-4xl font-black text-pink-600">{assignmentName}</p>
          <p className="mt-2 text-sm text-slate-600">
            Тссс! Это сюрприз, список видите только вы.
          </p>
          <div className="mt-6 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold">
              Список желаний:
            </p>
            {/* assignedWishlist removed */}
          </div>
        </>
      )}
      {alreadyStarted && !assignmentName && (
        <p className="mt-4 text-lg font-semibold text-slate-500">
          Мы обновляем данные, подождите секунду...
        </p>
      )}
    </div>
  );
}
