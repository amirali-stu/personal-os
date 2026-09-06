import { Link2, Music2, Pause, Play, Trash2 } from "lucide-react";

import { useMusicPlayerStore } from "../../../app/store/musicPlayerStore";
import type { MusicTrack } from "../types";
import { formatDuration } from "../utils";

type Props = {
  track: MusicTrack;
  tracks: MusicTrack[];
  onDelete: (track: MusicTrack) => void;
};

export function TrackRow({ track, tracks, onDelete }: Props) {
  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);

  const isPlaying = useMusicPlayerStore((state) => state.isPlaying);

  const setQueue = useMusicPlayerStore((state) => state.setQueue);

  const play = useMusicPlayerStore((state) => state.play);

  const pause = useMusicPlayerStore((state) => state.pause);

  const isCurrent = currentTrack?.id === track.id;

  function handlePlay() {
    /*
     * اگر همین آهنگ در حال پخش است،
     * با کلیک روی آن Pause می‌شود.
     */
    if (isCurrent && isPlaying) {
      pause();
      return;
    }

    /*
     * اگر همین آهنگ انتخاب شده ولی Pause است،
     * فقط دوباره Play می‌شود و از ابتدا شروع نمی‌شود.
     */
    if (isCurrent && !isPlaying) {
      play();
      return;
    }

    /*
     * اگر آهنگ دیگری انتخاب شده،
     * کل Playlist به عنوان Queue تنظیم می‌شود
     * و این آهنگ از داخل آن Queue پخش می‌شود.
     */
    const index = tracks.findIndex((item) => item.id === track.id);

    if (index === -1) {
      return;
    }

    setQueue(tracks, index);
  }

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-all ${
        isCurrent
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)]"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isCurrent
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
        }`}
      >
        {track.sourceType === "file" ? (
          <Music2 size={16} />
        ) : (
          <Link2 size={16} />
        )}
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-xs font-bold text-white"
          title={track.title}
        >
          {track.title}
        </p>

        <p
          className="mt-1 truncate text-[10px] text-[var(--color-text-muted)]"
          title={track.artist}
        >
          {track.artist}
        </p>
      </div>

      {/* Duration */}
      <span className="hidden shrink-0 text-[10px] tabular-nums text-[var(--color-text-muted)] sm:block">
        {track.duration ? formatDuration(track.duration) : "--:--"}
      </span>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={handlePlay}
        className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all active:scale-95 ${
          isCurrent && isPlaying
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
        }`}
        aria-label={isCurrent && isPlaying ? "توقف موقت آهنگ" : "پخش آهنگ"}
        title={isCurrent && isPlaying ? "توقف موقت" : "پخش آهنگ"}
      >
        {isCurrent && isPlaying ? (
          <Pause size={15} fill="currentColor" />
        ) : (
          <Play size={15} fill="currentColor" />
        )}
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(track)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
        aria-label="حذف آهنگ"
        title="حذف آهنگ"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
