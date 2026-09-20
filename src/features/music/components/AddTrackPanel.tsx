// components/AddTrackPanel.tsx
import { FileMusic, Link2, Music2 } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import type { MusicTrack } from "../types";
import { getAudioDuration } from "../utils";

type Props = {
  playlistId: number;
  onAddTrack: (track: Omit<MusicTrack, "id" | "createdAt">) => Promise<void>;
};

export function AddTrackPanel({ playlistId, onAddTrack }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");
  const [adding, setAdding] = useState(false);

  const fileModeActive = selectedFile !== null;
  const urlModeActive = url.trim().length > 0;

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const fileName = file.name.replace(/\.[^/.]+$/, "");

    setTitle(fileName);
    setArtist("");
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setTitle("");
    setArtist("");

    const input = document.getElementById(
      "music-file-input",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function clearUrl() {
    setUrl("");
    setUrlTitle("");
    setUrlArtist("");
  }

  async function handleAddFile() {
    if (!selectedFile || !title.trim() || adding) {
      return;
    }

    setAdding(true);

    try {
      const blobUrl = URL.createObjectURL(selectedFile);

      let duration = 0;

      try {
        duration = await getAudioDuration(blobUrl);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }

      await onAddTrack({
        playlistId,
        title,
        artist,
        duration,
        sourceType: "file",
        audioBlob: selectedFile,
        sortOrder: Date.now(),
      });

      clearSelectedFile();
    } finally {
      setAdding(false);
    }
  }

  async function handleAddUrl() {
    if (!url.trim() || !urlTitle.trim() || adding) {
      return;
    }

    setAdding(true);

    try {
      await onAddTrack({
        playlistId,
        title: urlTitle.trim(),
        artist:
          urlArtist.trim() ||
          text("music.unknownArtist", "هنرمند ناشناس", "Unknown artist"),
        duration: 0,
        sourceType: "url",
        audioUrl: url.trim(),
        sortOrder: Date.now(),
      }); 

      clearUrl();
    } finally {
      setAdding(false);
    }
  }

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5"
    >
      <div className="mb-5">
        <h2 className="text-sm font-bold text-white">
          {text("music.addTrack", "افزودن آهنگ", "Add Track")}
        </h2>

        <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
          {text(
            "music.addTrackDescription",
            "فایل موسیقی را از سیستم انتخاب کن یا آدرس مستقیم آهنگ را وارد کن.",
            "Choose a music file from your device or enter a direct song URL.",
          )}
        </p>
      </div>

      <div
        className={`min-w-0 overflow-hidden rounded-xl border p-3 transition-all sm:p-4 ${
          urlModeActive
            ? "pointer-events-none border-[var(--color-border)] bg-[var(--color-bg)] opacity-40"
            : "border-[var(--color-border)] bg-[var(--color-bg)]"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <FileMusic
            size={17}
            className="shrink-0 text-[var(--color-primary)]"
          />

          <span className="text-xs font-bold text-white">
            {text("music.fileFromSystem", "فایل از سیستم", "File from device")}
          </span>
        </div>

        <input
          id="music-file-input"
          type="file"
          accept="audio/*"
          disabled={urlModeActive}
          onChange={handleFileChange}
          className="block w-full min-w-0 max-w-full cursor-pointer overflow-hidden text-xs text-[var(--color-text-muted)] file:mr-2 file:rounded-lg file:border-0 file:bg-[var(--color-primary-soft)] file:px-3 file:py-2 file:text-[11px] file:font-medium file:text-[var(--color-primary)] disabled:cursor-not-allowed"
        />

        {selectedFile && (
          <div className="mt-4 space-y-4">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {text(
                    "music.selectedFile",
                    "فایل انتخاب‌شده",
                    "Selected file",
                  )}
                </p>

                <p
                  className="mt-1 truncate text-xs font-medium text-white"
                  title={selectedFile.name}
                  dir="ltr"
                >
                  {selectedFile.name}
                </p>
              </div>

              <button
                type="button"
                onClick={clearSelectedFile}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] text-[var(--color-text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
              >
                × {text("music.removeFile", "حذف فایل", "Remove file")}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={text("music.songName", "نام آهنگ", "Song title")}
                className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
              />

              <input
                type="text"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                placeholder={text(
                  "music.artistName",
                  "نام هنرمند",
                  "Artist name",
                )}
                className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
              />
            </div>

            <button
              type="button"
              disabled={!title.trim() || adding}
              onClick={handleAddFile}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Music2 size={15} />
              {adding
                ? text("music.adding", "در حال افزودن...", "Adding...")
                : text("music.addTrack", "افزودن آهنگ", "Add Track")}
            </button>
          </div>
        )}
      </div>

      <div
        className={`mt-4 min-w-0 overflow-hidden rounded-xl border p-3 transition-all sm:p-4 ${
          fileModeActive
            ? "pointer-events-none border-[var(--color-border)] bg-[var(--color-bg)] opacity-40"
            : "border-[var(--color-border)] bg-[var(--color-bg)]"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <Link2 size={17} className="shrink-0 text-[var(--color-primary)]" />

          <span className="text-xs font-bold text-white">
            {text("music.addFromUrl", "افزودن از URL", "Add from URL")}
          </span>
        </div>

        <div className="space-y-3">
          <input
            type="url"
            value={url}
            disabled={fileModeActive}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/song.mp3"
            dir="ltr"
            className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={urlTitle}
              disabled={fileModeActive}
              onChange={(event) => setUrlTitle(event.target.value)}
              placeholder={text("music.songName", "نام آهنگ", "Song title")}
              className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            />

            <input
              type="text"
              value={urlArtist}
              disabled={fileModeActive}
              onChange={(event) => setUrlArtist(event.target.value)}
              placeholder={text(
                "music.artistName",
                "نام هنرمند",
                "Artist name",
              )}
              className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={
                fileModeActive || !url.trim() || !urlTitle.trim() || adding
              }
              onClick={handleAddUrl}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] text-xs font-bold text-white transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Link2 size={15} />

              {adding
                ? text("music.adding", "در حال افزودن...", "Adding...")
                : text("music.addFromUrl", "افزودن از URL", "Add from URL")}
            </button>

            {url.trim() && (
              <button
                type="button"
                onClick={clearUrl}
                className="h-11 rounded-xl border border-[var(--color-border)] px-4 text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
              >
                × {text("music.clear", "پاک کردن", "Clear")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
