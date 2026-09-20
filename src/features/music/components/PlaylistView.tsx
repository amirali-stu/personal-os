// components/PlaylistView.tsx
import { ArrowRight, Music2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useMusicPlayerStore } from "../../../app/store/musicPlayerStore";
import { useSettingsStore } from "../../../app/store/settingsStore";
import type { MusicPlaylist, MusicTrack } from "../types";

import { AddTrackPanel } from "./AddTrackPanel";
import { DeleteTrackModal } from "./DeleteTrackModal";
import { TrackRow } from "./TrackRow";

type Props = {
  playlist: MusicPlaylist;
  tracks: MusicTrack[];
  onBack: () => void;
  onAddTrack: (
    track: Omit<MusicTrack, "id" | "createdAt" | "sortOrder"> & {
      sortOrder?: number;
    },
  ) => Promise<void>;
  onDeleteTrack: (id: number) => Promise<void>;
  onReorderTracks?: (orderedIds: number[]) => void;
};

export function PlaylistView({
  playlist,
  tracks,
  onBack,
  onAddTrack,
  onDeleteTrack,
  onReorderTracks,
}: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const [trackToDelete, setTrackToDelete] = useState<MusicTrack | null>(null);
  const [deletingTrack, setDeletingTrack] = useState(false);
  const [dragTrackId, setDragTrackId] = useState<number | null>(null);

  function handleTrackDragStart(id: number) {
    setDragTrackId(id);
  }

  function handleTrackDragOver(e: React.DragEvent, overId: number) {
    e.preventDefault();
    if (dragTrackId == null || dragTrackId === overId || !onReorderTracks) return;
    const ids = tracks.map((t) => t.id!).filter(Boolean);
    const from = ids.indexOf(dragTrackId);
    const to = ids.indexOf(overId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, dragTrackId);
    onReorderTracks(next);
  }

  function handleTrackDragEnd() {
    setDragTrackId(null);
  }

  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);
  const clearPlayer = useMusicPlayerStore((state) => state.clearPlayer);

  const playerActive = Boolean(currentTrack);

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  async function handleConfirmDelete() {
    if (!trackToDelete?.id) {
      return;
    }

    setDeletingTrack(true);

    try {
      if (currentTrack?.id === trackToDelete.id) {
        clearPlayer();
      }

      await onDeleteTrack(trackToDelete.id);
      setTrackToDelete(null);
    } finally {
      setDeletingTrack(false);
    }
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`space-y-6 ${playerActive ? "pb-20" : ""}`}
    >
      <section>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white active:scale-95"
            aria-label={text(
              "music.backToLibrary",
              "بازگشت به کتابخانه",
              "Back to library",
            )}
            title={text("music.back", "بازگشت", "Back")}
          >
            <ArrowRight size={18} className={isRtl ? "" : "rotate-180"} />
          </button>

          <div className="min-w-0">
            <h1
              className="truncate text-lg font-bold text-white sm:text-xl"
              title={playlist.name}
            >
              {playlist.name}
            </h1>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {tracks.length} {text("music.track", "آهنگ", "tracks")}
            </p>
          </div>
        </div>
      </section>

      <AddTrackPanel playlistId={playlist.id!} onAddTrack={onAddTrack} />

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">
              {text(
                "music.playlistTracks",
                "آهنگ‌های این لیست",
                "Playlist tracks",
              )}
            </h2>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {tracks.length === 0
                ? text(
                    "music.noTracksDescription",
                    "هنوز آهنگی به این لیست اضافه نشده",
                    "No tracks have been added to this playlist yet",
                  )
                : `${tracks.length} ${text(
                    "music.tracksInThisPlaylist",
                    "آهنگ در این لیست",
                    "tracks in this playlist",
                  )}`}
            </p>
          </div>
        </div>

        {tracks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Music2 size={21} />
            </div>

            <p className="mt-4 text-sm font-bold text-white">
              {text(
                "music.noTracks",
                "هنوز آهنگی اینجا نیست",
                "No tracks here yet",
              )}
            </p>

            <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
              {text(
                "music.addFirstTrack",
                "از بخش بالا اولین آهنگت را اضافه کن",
                "Add your first track from the section above",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                draggable
                onDragStart={() => handleTrackDragStart(track.id!)}
                onDragOver={(e) => handleTrackDragOver(e, track.id!)}
                onDragEnd={handleTrackDragEnd}
                className={`transition-all duration-300 ease-out ${
                  dragTrackId === track.id
                    ? "translate-x-1 scale-[0.98] opacity-50 shadow-lg shadow-purple-500/20"
                    : dragTrackId != null
                      ? "translate-y-0.5"
                      : ""
                }`}
              >
                <TrackRow
                  track={track}
                  tracks={tracks}
                  onDelete={setTrackToDelete}
                  showDragHandle
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {trackToDelete && (
        <DeleteTrackModal
          trackTitle={trackToDelete.title}
          deleting={deletingTrack}
          onClose={() => {
            if (!deletingTrack) {
              setTrackToDelete(null);
            }
          }}
          onConfirm={() => void handleConfirmDelete()}
        />
      )}
    </div>
  );
}
