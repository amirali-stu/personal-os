import { useEffect, useState } from "react";
import { Check, Music2, X } from "lucide-react";

type Props = {
  currentName: string;
  saving: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export function EditPlaylistModal({
  currentName,
  saving,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName || saving) {
      return;
    }

    onSave(cleanName);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        dir="rtl"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Music2 size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">ویرایش لیست</h3>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                نام لیست موسیقی را تغییر بده
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="بستن"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label className="mb-2 block text-[11px] font-medium text-[var(--color-text-secondary)]">
              نام لیست
            </label>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="مثلاً آهنگ‌های خارجی"
              disabled={saving}
              className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={15} />

              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
