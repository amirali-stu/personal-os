import { useEffect, useRef } from "react";

import { useMusicPlayerStore } from "../../../app/store/musicPlayerStore";
import { useSettingsStore } from "../../../app/store/settingsStore";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const loadIdRef = useRef(0);
  const isLoadingRef = useRef(false);

  const currentTrack = useMusicPlayerStore((state) => state.currentTrack);

  const isPlaying = useMusicPlayerStore((state) => state.isPlaying);

  const volume = useMusicPlayerStore((state) => state.volume);

  const isMuted = useMusicPlayerStore((state) => state.isMuted);

  const playbackRate = useMusicPlayerStore((state) => state.playbackRate);

  const autoPlay = useSettingsStore((state) => state.autoPlay);

  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);

  /*
   * ساخت Audio فقط یک بار
   */
  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";

    audioRef.current = audio;

    /*
     * وقتی موزیک واقعاً شروع به پخش کرد
     */
    const handlePlay = () => {
      useMusicPlayerStore.getState().play();
    };

    /*
     * وقتی موزیک واقعاً متوقف / Pause شد
     */
    const handlePause = () => {
      useMusicPlayerStore.getState().pause();
    };

    /*
     * وقتی موزیک به انتها رسید
     */
    const handleEnded = () => {
      const store = useMusicPlayerStore.getState();

      if (store.repeatMode === "one") {
        audio.currentTime = 0;

        audio.play().catch(() => {
          store.pause();
        });

        return;
      }

      store.next();
    };

    audio.addEventListener("play", handlePlay);

    audio.addEventListener("pause", handlePause);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);

      audio.removeEventListener("pause", handlePause);

      audio.removeEventListener("ended", handleEnded);

      audio.pause();

      audio.removeAttribute("src");
      audio.load();

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);

        objectUrlRef.current = null;
      }

      audioRef.current = null;
    };
  }, []);

  /*
   * تغییر موزیک
   */
  useEffect(() => {
    const loadId = ++loadIdRef.current;

    isLoadingRef.current = true;

    async function loadTrack() {
      const audio = audioRef.current;

      if (!audio) {
        isLoadingRef.current = false;
        return;
      }

      /*
       * توقف موزیک قبلی
       */
      audio.pause();

      audio.currentTime = 0;

      audio.removeAttribute("src");
      audio.load();

      /*
       * آزاد کردن Blob قبلی
       */
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);

        objectUrlRef.current = null;
      }

      /*
       * اگر موزیکی انتخاب نشده
       */
      if (!currentTrack) {
        isLoadingRef.current = false;

        useMusicPlayerStore.getState().pause();

        return;
      }

      /*
       * ساخت Source
       */
      if (currentTrack.sourceType === "file" && currentTrack.audioBlob) {
        objectUrlRef.current = URL.createObjectURL(currentTrack.audioBlob);

        audio.src = objectUrlRef.current;
      } else if (currentTrack.sourceType === "url" && currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
      } else {
        isLoadingRef.current = false;

        useMusicPlayerStore.getState().pause();

        return;
      }

      audio.preload = "metadata";
      audio.playbackRate = defaultSpeed;

      useMusicPlayerStore.getState().setPlaybackRate(defaultSpeed);

      audio.load();

      /*
       * صبر می‌کنیم فایل واقعاً آماده شود
       */
      await new Promise<void>((resolve) => {
        if (audio.readyState >= 2) {
          resolve();
          return;
        }

        const handleCanPlay = () => {
          audio.removeEventListener("canplay", handleCanPlay);

          resolve();
        };

        audio.addEventListener("canplay", handleCanPlay);
      });

      /*
       * اگر در این فاصله Track عوض شده
       */
      if (loadId !== loadIdRef.current) {
        return;
      }

      isLoadingRef.current = false;

      /*
       * اگر Auto Play فعال است
       */
      if (autoPlay) {
        try {
          await audio.play();

          if (loadId !== loadIdRef.current) {
            audio.pause();
          }
        } catch {
          if (loadId === loadIdRef.current) {
            useMusicPlayerStore.getState().pause();
          }
        }

        return;
      }

      /*
       * Auto Play خاموش است
       */
      useMusicPlayerStore.getState().pause();
    }

    loadTrack();
  }, [currentTrack, autoPlay, defaultSpeed]);

  /*
   * Play / Pause
   *
   * فقط وقتی Track در حال Loading نیست
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch(() => {
          useMusicPlayerStore.getState().pause();
        });
      }

      return;
    }

    if (!audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  /*
   * Volume
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  /*
   * Playback Speed
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  return audioRef;
}
