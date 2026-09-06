import { FileMusic, Link2, Music2 } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import type { MusicTrack } from "../types";
import { getAudioDuration } from "../utils";

type Props = {
  playlistId: number;
  onAddTrack: (track: Omit<MusicTrack, "id" | "createdAt">) => Promise<void>;
};

export function AddTrackPanel({ playlistId, onAddTrack }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const [url, setUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");

  const [adding, setAdding] = useState(false);

  const fileModeActive = selectedFile !== null;

  const urlModeActive = url.trim().length > 0;

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
        title: title.trim(),
        artist: artist.trim() || "هنرمند ناشناس",
        duration,
        sourceType: "file",
        audioBlob: selectedFile,
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
        artist: urlArtist.trim() || "هنرمند ناشناس",
        duration: 0,
        sourceType: "url",
        audioUrl: url.trim(),
      });

      clearUrl();
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="mb-5">
        <h2 className="text-sm font-bold text-white">افزودن آهنگ</h2>

        <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
          فایل موسیقی را از سیستم انتخاب کن یا آدرس مستقیم آهنگ را وارد کن.
        </p>
      </div>

      {/* File */}
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

          <span className="text-xs font-bold text-white">فایل از سیستم</span>
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
                  فایل انتخاب‌شده
                </p>

                <p
                  className="mt-1 truncate text-xs font-medium text-white"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>
              </div>

              <button
                type="button"
                onClick={clearSelectedFile}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] text-[var(--color-text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
              >
                × حذف فایل
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="نام آهنگ"
                className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
              />

              <input
                type="text"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                placeholder="نام هنرمند"
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

              {adding ? "در حال افزودن..." : "افزودن آهنگ"}
            </button>
          </div>
        )}
      </div>

      {/* URL */}
      <div
        className={`mt-4 min-w-0 overflow-hidden rounded-xl border p-3 transition-all sm:p-4 ${
          fileModeActive
            ? "pointer-events-none border-[var(--color-border)] bg-[var(--color-bg)] opacity-40"
            : "border-[var(--color-border)] bg-[var(--color-bg)]"
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <Link2 size={17} className="shrink-0 text-[var(--color-primary)]" />

          <span className="text-xs font-bold text-white">افزودن از URL</span>
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
              placeholder="نام آهنگ"
              className="block h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            />

            <input
              type="text"
              value={urlArtist}
              disabled={fileModeActive}
              onChange={(event) => setUrlArtist(event.target.value)}
              placeholder="نام هنرمند"
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

              {adding ? "در حال افزودن..." : "افزودن از URL"}
            </button>

            {url.trim() && (
              <button
                type="button"
                onClick={clearUrl}
                className="h-11 rounded-xl border border-[var(--color-border)] px-4 text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
              >
                × پاک کردن
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
