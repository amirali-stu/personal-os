// components/DeleteTrackModal.tsx
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";

type Props = {
  trackTitle: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteTrackModal({
  trackTitle,
  deleting,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {text("music.deleteTrack", "حذف آهنگ", "Delete Track")}
              </h3>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                {text(
                  "music.irreversible",
                  "این عملیات قابل بازگشت نیست",
                  "This action cannot be undone",
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={text("music.close", "بستن", "Close")}
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
            {text(
              "music.confirmDeleteTrack",
              "آیا مطمئنی می‌خواهی این آهنگ را حذف کنی؟",
              "Are you sure you want to delete this track?",
            )}
          </p>

          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
            <p className="truncate text-xs font-bold text-white">
              {trackTitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {text("common.cancel", "انصراف", "Cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 text-xs font-bold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting
              ? text("music.deleting", "در حال حذف...", "Deleting...")
              : text("music.deleteTrack", "حذف آهنگ", "Delete Track")}
          </button>
        </div>
      </div>
    </div>
  );
}
