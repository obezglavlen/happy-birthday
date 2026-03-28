export default function HeroPanel() {
  return (
    <div className="birthday-card relative overflow-hidden bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 p-10 text-indigo-950 border-2 border-pink-300 shadow-xl">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)]" />
      <p className="text-xs uppercase font-black tracking-[0.4em] text-pink-700">
        Праздничный Вишлист
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-black">
        Твой день — твои идеальные подарки
      </h1>
      <p className="mt-4 text-lg text-slate-900 font-medium leading-relaxed max-w-2xl">
        Создавайте праздники, приглашайте друзей и делитесь списками желаний — пусть каждый получит то, о чем мечтает.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-black text-indigo-800">
        <span className="rounded-full bg-pink-200 px-4 py-1">Сюрпризы</span>
        <span className="rounded-full bg-purple-200 px-4 py-1">Удобные списки</span>
        <span className="rounded-full bg-blue-200 px-4 py-1">Без лишних хлопот</span>
      </div>
    </div>
  );
}
