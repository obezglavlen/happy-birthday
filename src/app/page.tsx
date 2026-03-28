import { Suspense } from "react";
import HappyBirthdayClient from "./happy-birthday-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-4 py-10 text-slate-900">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <div className="birthday-card px-8 py-10 text-center text-slate-600">
              Готовим поздравления...
            </div>
          </div>
        </div>
      }
    >
      <HappyBirthdayClient />
    </Suspense>
  );
}
