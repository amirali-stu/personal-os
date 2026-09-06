import { Bot, MoreVertical, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = {
  onClear: () => void;
};

export function AIHeader({ onClear }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Bot size={21} />

          <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-success)]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">دستیار هوشمند</h1>

            <span className="hidden items-center gap-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-2 py-1 text-[9px] font-medium text-[var(--color-primary)] sm:flex">
              <Sparkles size={11} />
              AI
            </span>
          </div>

          <p className="mt-1 truncate text-[11px] text-[var(--color-text-muted)]">
            دستیار شخصی Personal OS
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-all ${
            menuOpen
              ? "bg-[var(--color-surface-hover)] text-white"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
          }`}
          aria-label="تنظیمات گفتگو"
          aria-expanded={menuOpen}
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-11 z-30 w-44 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-2xl shadow-black/40">
            <button
              type="button"
              onClick={() => {
                onClear();
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-right text-[11px] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white"
            >
              پاک کردن گفتگو
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
