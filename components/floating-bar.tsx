import { ViewTransition } from "react";

export function FloatingBar({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition name="floating-bar" share="bar-crossfade">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-black/[0.04] dark:border-white/[0.08] rounded-full px-5 h-12 flex items-center gap-4 shadow-lg shadow-black/[0.03]">
          {children}
        </div>
      </div>
    </ViewTransition>
  );
}
