import { AlertTriangle, Trash2, X } from "lucide-react";

type Props = {
  playlistName: string;
  trackCount: number;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeletePlaylistModal({
  playlistName,
  trackCount,
  deleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">حذف لیست</h3>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                این عملیات قابل بازگشت نیست
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="بستن"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
            آیا مطمئنی می‌خواهی این لیست را حذف کنی؟
          </p>

          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
            <p
              className="truncate text-xs font-bold text-white"
              title={playlistName}
            >
              {playlistName}
            </p>

            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {trackCount} آهنگ داخل این لیست قرار دارد.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
            <p className="text-[10px] leading-5 text-red-300/80">
              با حذف لیست، تمام آهنگ‌های ذخیره‌شده داخل آن نیز حذف خواهند شد.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 text-xs font-bold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting ? "در حال حذف..." : "حذف لیست"}
          </button>
        </div>
      </div>
    </div>
  );
}
