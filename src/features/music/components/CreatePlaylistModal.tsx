import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
};

export function CreatePlaylistModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit() {
    if (!name.trim() || loading) {
      return;
    }

    setLoading(true);

    try {
      await onCreate(name);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="بستن"
      />

      <div className="relative w-full max-w-[420px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-sidebar)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">ساخت لیست جدید</h2>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              برای مثال: آهنگ‌های خارجی
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="نام لیست..."
          className="mt-6 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />

        <button
          type="button"
          disabled={!name.trim() || loading}
          onClick={handleSubmit}
          className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "در حال ساخت..." : "ساخت لیست"}
        </button>
      </div>
    </div>
  );
}
