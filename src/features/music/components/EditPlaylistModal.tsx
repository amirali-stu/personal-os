// components/EditPlaylistModal.tsx
import { Check, Music2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";

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
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const [name, setName] = useState(currentName);

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName || saving) {
      return;
    }

    onSave(cleanName);
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Music2 size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {text("music.editPlaylist", "ویرایش لیست", "Edit Playlist")}
              </h3>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                {text(
                  "music.editPlaylistDescription",
                  "نام لیست موسیقی را تغییر بده",
                  "Change the playlist name",
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={text("music.close", "بستن", "Close")}
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label className="mb-2 block text-[11px] font-medium text-[var(--color-text-secondary)]">
              {text("music.playlistName", "نام لیست", "Playlist name")}
            </label>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={text(
                "music.playlistNameExample",
                "مثلاً آهنگ‌های خارجی",
                "e.g. International Music",
              )}
              disabled={saving}
              className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--color-border)] px-4 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {text("common.cancel", "انصراف", "Cancel")}
            </button>

            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white transition-all hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={15} />

              {saving
                ? text("music.saving", "در حال ذخیره...", "Saving...")
                : text("music.saveChanges", "ذخیره تغییرات", "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
