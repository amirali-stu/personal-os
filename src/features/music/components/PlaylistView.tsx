import { ArrowRight, Music2 } from "lucide-react";
import { useState } from "react";

import { useMusicPlayerStore } from "../../../app/store/musicPlayerStore";
import type { MusicPlaylist, MusicTrack } from "../types";

import { AddTrackPanel } from "./AddTrackPanel";
import { DeleteTrackModal } from "./DeleteTrackModal";
import { TrackRow } from "./TrackRow";

type Props = {
  playlist: MusicPlaylist;
  tracks: MusicTrack[];
  onBack: () => void;
  onAddTrack: (track: Omit<MusicTrack, "id" | "createdAt">) => Promise<void>;
  onDeleteTrack: (id: number) => Promise<void>;
};

export function PlaylistView({
  playlist,
  tracks,
  onBack,
  onAddTrack,
  onDeleteTrack,
}: Props) {
  const [trackToDelete, setTrackToDelete] = useState<MusicTrack | null>(null);

  const [deletingTrack, setDeletingTrack] = useState(false);

  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);

  const clearPlayer = useMusicPlayerStore((state) => state.clearPlayer);

  const playerActive = Boolean(currentTrack);

  async function handleConfirmDelete() {
    if (!trackToDelete?.id) {
      return;
    }

    setDeletingTrack(true);

    try {
      /*
       * اگر آهنگی که قرار است حذف شود
       * همان آهنگ در حال پخش است،
       * ابتدا Player را متوقف و پاک می‌کنیم.
       */
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
    <div className={`space-y-6 ${playerActive ? "pb-20" : ""}`}>
      {/* Header */}
      <section>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-white active:scale-95"
            aria-label="بازگشت به کتابخانه"
            title="بازگشت"
          >
            <ArrowRight size={18} />
          </button>

          <div className="min-w-0">
            <h1
              className="truncate text-lg font-bold text-white sm:text-xl"
              title={playlist.name}
            >
              {playlist.name}
            </h1>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {tracks.length} آهنگ
            </p>
          </div>
        </div>
      </section>

      {/* Add Track */}
      <AddTrackPanel playlistId={playlist.id!} onAddTrack={onAddTrack} />

      {/* Tracks */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">آهنگ‌های این لیست</h2>

            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {tracks.length === 0
                ? "هنوز آهنگی به این لیست اضافه نشده"
                : `${tracks.length} آهنگ در این لیست`}
            </p>
          </div>
        </div>

        {tracks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Music2 size={21} />
            </div>

            <p className="mt-4 text-sm font-bold text-white">
              هنوز آهنگی اینجا نیست
            </p>

            <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
              از بخش بالا اولین آهنگت را اضافه کن
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                tracks={tracks}
                onDelete={setTrackToDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Track Modal */}
      {trackToDelete && (
        <DeleteTrackModal
          trackTitle={trackToDelete.title}
          deleting={deletingTrack}
          onClose={() => {
            if (!deletingTrack) {
              setTrackToDelete(null);
            }
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
