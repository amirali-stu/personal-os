export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function getAudioDuration(source: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");

    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);

      audio.remove();
    };

    audio.onerror = () => {
      reject(new Error("امکان خواندن فایل صوتی وجود ندارد"));
      audio.remove();
    };

    audio.src = source;
  });
}
