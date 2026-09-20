// components/MusicPlayer.tsx
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useMusicPlayerStore } from "../../../app/store/musicPlayerStore";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { formatDuration } from "../utils";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function MusicPlayer() {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const audioRef = useAudioPlayer();

  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);
  const clearPlayer = useMusicPlayerStore((state) => state.clearPlayer);
  const isPlaying = useMusicPlayerStore((state) => state.isPlaying);
  const volume = useMusicPlayerStore((state) => state.volume);
  const isMuted = useMusicPlayerStore((state) => state.isMuted);
  const playbackRate = useMusicPlayerStore((state) => state.playbackRate);
  const isShuffle = useMusicPlayerStore((state) => state.isShuffle);
  const repeatMode = useMusicPlayerStore((state) => state.repeatMode);
  const play = useMusicPlayerStore((state) => state.play);
  const pause = useMusicPlayerStore((state) => state.pause);
  const previous = useMusicPlayerStore((state) => state.previous);
  const next = useMusicPlayerStore((state) => state.next);
  const setVolume = useMusicPlayerStore((state) => state.setVolume);
  const toggleMute = useMusicPlayerStore((state) => state.toggleMute);
  const setPlaybackRate = useMusicPlayerStore((state) => state.setPlaybackRate);
  const toggleShuffle = useMusicPlayerStore((state) => state.toggleShuffle);
  const setRepeatMode = useMusicPlayerStore((state) => state.setRepeatMode);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack?.duration ?? 0);
  const [expanded, setExpanded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const progressRef = useRef<HTMLDivElement | null>(null);

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const updateDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentTrack?.duration ?? 0);
  }, [currentTrack]);

  function handlePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function handleClosePlayer() {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    clearPlayer();
  }

  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    const container = progressRef.current;

    if (!audio || !container || !duration) {
      return;
    }

    const rect = container.getBoundingClientRect();

    const position = isRtl
      ? (rect.right - event.clientX) / rect.width
      : (event.clientX - rect.left) / rect.width;

    const clamped = Math.max(0, Math.min(1, position));

    audio.currentTime = clamped * duration;
    setCurrentTime(audio.currentTime);
  }

  function handleRepeat() {
    if (repeatMode === "off") {
      setRepeatMode("all");
      return;
    }

    if (repeatMode === "all") {
      setRepeatMode("one");
      return;
    }

    setRepeatMode("off");
  }

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(event.target.value));
  }

  if (!currentTrack) {
    return null;
  }

  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`
        fixed
        bottom-4
        left-4
        right-4
        z-40
        overflow-visible
        rounded-2xl
        border
        border-[var(--color-border)]/80
        bg-[var(--color-surface)]/75
        shadow-2xl
        shadow-black/20
        backdrop-blur-2xl
        backdrop-saturate-150
        lg:left-4
        ${isRtl ? "lg:right-[266px]" : "lg:left-[266px]"}
      `}
    >
      <div
        ref={progressRef}
        onClick={handleSeek}
        className="group absolute inset-x-0 top-0 h-1 cursor-pointer overflow-hidden rounded-t-2xl bg-white/5"
      >
        <div
          className="h-full bg-[var(--color-primary)] transition-[width] duration-100"
          style={{
            width: `${progress}%`,
          }}
        />

        <div
          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-0 shadow-lg shadow-purple-500/40 transition-opacity group-hover:opacity-100 ${
            isRtl ? "right-0" : "left-0"
          }`}
          style={{
            [isRtl ? "right" : "left"]: `${progress}%`,
          }}
        />
      </div>

      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleClosePlayer}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
            aria-label={text("music.stopPlayer", "توقف آهنگ", "Stop player")}
            title={text("music.stopPlayer", "توقف آهنگ", "Stop player")}
          >
            <X size={17} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] sm:flex">
                <Play size={18} fill="currentColor" />
              </div>

              <div className="min-w-0">
                <p
                  className="truncate text-xs font-bold text-white sm:text-sm"
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </p>

                <p
                  className="mt-1 truncate text-[10px] text-[var(--color-text-muted)]"
                  title={currentTrack.artist}
                >
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={previous}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-white sm:flex"
              aria-label={text("music.previous", "آهنگ قبلی", "Previous track")}
            >
              <SkipBack size={17} />
            </button>

            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-95"
              aria-label={
                isPlaying
                  ? text("music.pause", "توقف", "Pause")
                  : text("music.play", "پخش", "Play")
              }
            >
              {isPlaying ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
              aria-label={text("music.next", "آهنگ بعدی", "Next track")}
            >
              <SkipForward size={17} />
            </button>
          </div>

          <div className="hidden shrink-0 text-[10px] tabular-nums text-[var(--color-text-muted)] lg:block">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isShuffle
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white"
              }`}
              aria-label={text("music.shuffle", "تصادفی", "Shuffle")}
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              onClick={handleRepeat}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                repeatMode !== "off"
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white"
              }`}
              aria-label={text("music.repeat", "تکرار", "Repeat")}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={16} />
              ) : (
                <Repeat size={16} />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu((current) => !current)}
                className="flex h-9 items-center gap-1 rounded-lg px-2 text-[10px] font-bold text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
                aria-label={text("music.speed", "سرعت پخش", "Playback speed")}
              >
                {playbackRate}x
                {showSpeedMenu ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronUp size={13} />
                )}
              </button>

              {showSpeedMenu && (
                <div
                  className={`absolute bottom-11 z-50 w-28 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-2xl ${
                    isRtl ? "right-0" : "left-0"
                  }`}
                >
                  {SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => {
                        setPlaybackRate(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] transition-colors ${
                        playbackRate === speed
                          ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                          : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{speed}x</span>
                      {playbackRate === speed && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-white"
              aria-label={text("music.volume", "صدا", "Volume")}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[var(--color-primary)]"
              aria-label={text("music.volume", "ولوم", "Volume")}
            />
          </div>

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label={
              expanded
                ? text("music.collapse", "بستن کنترل‌ها", "Collapse controls")
                : text("music.expand", "باز کردن کنترل‌ها", "Expand controls")
            }
          >
            {expanded ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-border)] pt-3 md:hidden">
            <button
              type="button"
              onClick={previous}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-[10px] text-[var(--color-text-secondary)]"
            >
              <SkipBack size={14} />
              {text("music.previousShort", "قبلی", "Previous")}
            </button>

            <button
              type="button"
              onClick={next}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-[10px] text-[var(--color-text-secondary)]"
            >
              {text("music.nextShort", "بعدی", "Next")}
              <SkipForward size={14} />
            </button>

            <button
              type="button"
              onClick={toggleShuffle}
              className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-[10px] ${
                isShuffle
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
              }`}
            >
              <Shuffle size={14} />
              {text("music.shuffle", "تصادفی", "Shuffle")}
            </button>

            <button
              type="button"
              onClick={handleRepeat}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-[10px] text-[var(--color-text-secondary)]"
            >
              {repeatMode === "one" ? (
                <Repeat1 size={14} />
              ) : (
                <Repeat size={14} />
              )}

              {repeatMode === "off"
                ? text("music.repeatOff", "تکرار خاموش", "Repeat off")
                : repeatMode === "all"
                  ? text("music.repeatAll", "تکرار لیست", "Repeat all")
                  : text("music.repeatOne", "تکرار آهنگ", "Repeat one")}
            </button>

            <button
              type="button"
              onClick={() =>
                setPlaybackRate(playbackRate >= 2 ? 0.5 : playbackRate + 0.25)
              }
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-[10px] text-[var(--color-text-secondary)]"
            >
              {text("music.speedLabel", "سرعت", "Speed")} {playbackRate}x
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-[10px] text-[var(--color-text-secondary)]"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {text("music.volume", "صدا", "Volume")}
            </button>

            <div className="flex w-full items-center gap-2">
              <VolumeX
                size={14}
                className="shrink-0 text-[var(--color-text-muted)]"
              />

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-[var(--color-primary)]"
                aria-label={text("music.volume", "ولوم", "Volume")}
              />

              <Volume2
                size={14}
                className="shrink-0 text-[var(--color-text-muted)]"
              />
            </div>

            <div className="text-[10px] tabular-nums text-[var(--color-text-muted)]">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
