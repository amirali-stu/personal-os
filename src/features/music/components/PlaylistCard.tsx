// components/PlaylistCard.tsx
import { Edit3, ListMusic, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import type { MusicPlaylist } from "../types";

type Props = {
  playlist: MusicPlaylist;
  trackCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
};

export function PlaylistCard({
  playlist,
  trackCount,
  onOpen,
  onEdit,
  onDelete,
  isDragging,
}: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleEdit() {
    setMenuOpen(false);
    onEdit();
  }

  function handleDelete() {
    setMenuOpen(false);
    onDelete();
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`${
        isDragging ? "ring-2 ring-[var(--color-primary)] " : ""
      }group relative cursor-pointer rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-border-hover)]`}
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <ListMusic size={21} />
        </div>

        <div
          ref={menuRef}
          className="relative"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all ${
              menuOpen
                ? "bg-[var(--color-surface-hover)] text-white"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
            }`}
            aria-label={text(
              "music.playlistActions",
              "عملیات لیست",
              "Playlist actions",
            )}
            aria-expanded={menuOpen}
          >
            <MoreVertical size={17} />
          </button>

          {menuOpen && (
            <div
              className={`absolute top-10 z-30 w-40 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-2xl shadow-black/40 ${
                isRtl ? "right-0" : "left-0"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white"
              >
                <Edit3 size={15} />
                {text("music.edit", "ویرایش", "Edit")}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-[11px] font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={15} />
                {text("music.deletePlaylist", "حذف لیست", "Delete playlist")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h3
          className="truncate text-sm font-bold text-white"
          title={playlist.name}
        >
          {playlist.name}
        </h3>

        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
          {trackCount} {text("music.track", "آهنگ", "tracks")}
        </p>
      </div>
    </div>
  );
}
